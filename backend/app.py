from flask import Flask
import requests
from flask_cors import CORS
import base64
import json
import os


app = Flask(__name__)
CORS(app)

 
 
@app.route('/')
def hello_whale():
    return 'Hey guys!'


@app.route('/upload')
def upload():
	return ''
 
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
