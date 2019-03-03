from flask import Flask, request
import requests
from flask_cors import CORS, logging
import base64
import json
import os


app = Flask(__name__)
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
 
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
    
