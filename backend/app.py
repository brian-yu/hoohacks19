from flask import Flask, request
import requests
from flask_cors import CORS, logging
import base64
import json
import os
from google.cloud import vision
from google.cloud import storage
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from py2neo import Graph

# ================== FUNCTIONS ===========================

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './hoohacks19-9661c4101e40.json'
project_id = 'hoohacks19-233401'
vision_client = vision.ImageAnnotatorClient()
language_client = language.LanguageServiceClient();
storage_client = storage.Client()

bucket = storage_client.get_bucket('hoohacks19-images')

def extract_text_from_url(url):
    print(url)
    text_detection_response = vision_client.document_text_detection({
        'source': {'image_uri': url}
    })
    annotations = text_detection_response.text_annotations
    if len(annotations) > 0:
        text = annotations[0].description
    else:
        text = ''
    print(text)
    return text

def extract_entities_from_text(text):
    #document = language_client.document_from_text(text)
    #sent_analysis = document.analyze_sentiment()
    #dir(sent_analysis)
    #sentiment = sent_analysis.sentiment

    document = types.Document(
        content=text,
        type=enums.Document.Type.PLAIN_TEXT)
    entities = language_client.analyze_entities(document).entities

    entList = []
    for e in entities:
        d = {}
        d['name']=e.name
        l = ['Unknown','Person','Location','Organization','Event','Work of art','Consumer goods','Other']        
        d['type']=l[e.type]
        #d['metadata']=MessageToDict(e.metadata)
        d['wikipedia_url']=e.metadata.get('wikipedia_url', '-')
        d['mid']=e.metadata.get('mid', '-')
        d['salience']=e.salience
        entList.append(d)


    return json.dumps(entList)

def upload_blob(source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""
    
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    print('File {} uploaded to {}.'.format(
        source_file_name,
        destination_blob_name))

# ================== FLASK APP + ROUTES ==================

app = Flask(__name__)
graph = Graph("bolt://db-api:7687", auth=("neo4j","reinform"))
CORS(app)
logging.getLogger('flask_cors').level = logging.DEBUG

@app.route('/')
def hello_whale():
    return 'Hey guys!'

@app.route('/camera')
def camera():
    pass

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        file = open('test.png', 'w')
        file.write(request.data)
        file.close()
        
        return 'post'
    else:
        return 'get'

@app.route('/detect', methods=['POST'])
def detect():
    url = request.form['url']
    return extract_text_from_url(url)
    
@app.route('/entities', methods=['POST'])
def entities():
    text = request.form['text']
    return extract_entities_from_text(text)

@app.route("/graph")
def get_graph():
    results = graph.run("MATCH (people:Person) RETURN people.name LIMIT 10").to_table()
    return str(results)
 
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
    
