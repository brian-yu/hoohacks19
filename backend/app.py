from flask import Flask, request
import requests
from flask_cors import CORS, logging
import base64
import json
import os
import uuid
import random
from google.cloud import vision
from google.cloud import storage
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from py2neo import Graph, Node, Relationship, NodeMatcher

# ================== FUNCTIONS ===========================

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './hoohacks19-9661c4101e40.json'
project_id = 'hoohacks19-233401'
vision_client = vision.ImageAnnotatorClient()
language_client = language.LanguageServiceClient();
storage_client = storage.Client()
bucket_id = 'hoohacks-images'
bucket = storage_client.get_bucket(bucket_id)

graph = Graph("bolt://db-api:7687", auth=("neo4j","reinform"))
matcher = NodeMatcher(graph)

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
    text = text.encode('utf-8')
    print(text)
    return text

def extract_entities_from_text(text):
    #document = language_client.document_from_text(text)
    #sent_analysis = document.analyze_sentiment()
    #dir(sent_analysis)
    #sentiment = sent_analysis.sentiment

    try:

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
    except:
        return False

def upload_blob(source_file_name, fid):
    """Uploads a file to the bucket."""

    dest = "{}.png".format(fid)
    
    blob = bucket.blob(dest)

    blob.upload_from_filename(source_file_name)

def add_document_helper(content):
    try:
        text = content['text']
        link = content['link']
        author = content['author']
        a = Node("Note", text=text, link=link, author=author)
        for item in content['keywords']:
            name = item['name']
            salience = str(item['salience'])
            query = "MERGE (n:Note {text:\""+text+"\", link: \""+link+"\", author:\""+author+"\"})"
            query += "MERGE (m:Keyword {name:\""+name+"\"})"
            query += "MERGE (n)-[:CONTAINS {salience:\""+salience+"\"}]->(m)"
            results = graph.run(query)
        return "Success"
    except Exception as e:
        return str(e)

def get_documents():
    return json.dumps(list(matcher.match("Note").limit(20)))

def search_documents(query):
    query.lower()
    lowerMatches = list(matcher.match("Note", text__contains=query))
    query.title()
    matches = lowerMatches + list(matcher.match("Note", text__contains=query))
    return json.dumps(matches)

# ================== FLASK APP + ROUTES ==================

app = Flask(__name__)
CORS(app)
logging.getLogger('flask_cors').level = logging.DEBUG

@app.route('/api')
def hello_whale():
    return "Hey guys!"

@app.route('/camera')
def camera():
    pass

@app.route('/api/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        fid = uuid.uuid4()
        file = open('upload.png', 'w')
        file.write(request.data)
        file.close()
        upload_blob('upload.png', str(fid))
        url = "http://{}.storage.googleapis.com/{}.png".format(bucket_id, str(fid))
        print('Photo uploaded to {}.'.format(url))
        text = extract_text_from_url(url)
        if len(text.strip()) == 0:
            return "No text detected"
        print(text)
        entities = extract_entities_from_text(text)
        if not entities:
            return 'No entities detected.'
        authors = ["Brian Yu", "Rashid Lasker", "Joanna Zhao", "Aaron Gu"]
        content = {
            "text": text,
            "link": url,
            "author": random.choice(authors),
            "keywords": json.loads(entities)
        }
        add_document_helper(content)
        return text
    else:
        return 'get'

@app.route('/detect', methods=['POST'])
def detect():
    url = request.form['url']
    return extract_text_from_url(url)
    
@app.route('/entities', methods=['POST'])
def entities():
    text = request.form['text']
    entities = extract_entities_from_text(text)
    return entities

@app.route("/graph")
def get_graph():
    # results = graph.run("MATCH (people:Person) RETURN people.name LIMIT 10").to_table()
    # return str(results)
    pass

@app.route("/api/documents")
def documents():
    return get_documents()

@app.route("/api/search/<query>")
def search(query):
    return search_documents(query)

@app.route("/api/documents/new", methods=['POST'])
def add_document():
    content = request.get_json()
    try:
        add_document_helper(content)
        return "Success"
    except Exception as e:
        return str(e)

@app.route("/api/flush")
def flush_db():
    try:
        query = "MATCH (n) DETACH DELETE n"
        results = graph.run(query)
        return "Flushed data"
    except Exception as e:
        return str(e)

@app.route("/api/load")
def load_db():
    flush_db()
    try:
        query = """
                CREATE (note1:Note {text:'lmfao no u', link:"facebook.com", author:"Brian Yu"})
                CREATE (note2:Note {text:'lmfao no me', link:"facebook.com", author:"Brian Yu"})
                CREATE (note3:Note {text:'lmfao no 2', link:"facebook.com", author:"Rashid Lasker"})
                CREATE (note4:Note {text:'lmfao no 3', link:"facebook.com", author:"Aaron Gu"})
                CREATE (note5:Note {text:'lmfao no 4', link:"facebook.com", author:"Joanna Zhao"})

                CREATE (no:Keyword {name:"no"})
                CREATE (u:Keyword {name:"u"})
                CREATE (me:Keyword {name:"me"})

                CREATE
                  (note1)-[:CONTAINS {salience:200}]->(no),
                  (note2)-[:CONTAINS {salience:2040}]->(no),
                  (note3)-[:CONTAINS {salience:4}]->(me),
                  (note3)-[:CONTAINS {salience:2}]->(no),
                  (note4)-[:CONTAINS {salience:2020}]->(no),
                  (note1)-[:CONTAINS {salience:200}]->(u),
                  (note5)-[:CONTAINS {salience:200}]->(me),
                  (note2)-[:CONTAINS {salience:3}]->(u)
                """
        results = graph.run(query)
        return "Loaded data"
    except Exception as e:
        return str(e)

 
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
    
