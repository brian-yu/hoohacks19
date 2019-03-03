from flask import Flask
import requests
import base64
import json
import os
from py2neo import Graph

app = Flask(__name__)
graph = Graph("bolt://db-api:7687", auth=("neo4j","reinform"))
 
@app.route('/')
def hello_whale():
    return 'Hey guys!'


@app.route('/upload')
def upload():
	return ''

@app.route("/graph")
def get_graph():
    results = graph.run("MATCH (people:Person) RETURN people.name LIMIT 10").to_table()
    return str(results)
 
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
