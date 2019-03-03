from flask import Flask, request
import requests
from flask_cors import CORS
import base64
import json
import os
from google.cloud import vision
from google.cloud import storage

# ================== FUNCTIONS ===========================

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './hoohacks19-9661c4101e40.json'
project_id = 'hoohacks19-233401'
vision_client = vision.ImageAnnotatorClient()

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

# ================== FLASK APP + ROUTES ==================

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_whale():
    return 'Hey guys!'

@app.route('/camera')
def camera():
    pass

@app.route('/upload')
def upload():
    return ''

@app.route('/detect', methods=['POST'])
def detect():
    url = request.form['url']
    return extract_text_from_url(url)
    
 
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
