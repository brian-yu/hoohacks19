
import './Graph.css';
import React, { Component } from 'react';
const NeoVis = require('neovis.js');


class Graph extends Component {

  draw() {
    var viz;
    var config = {
        container_id: "viz",
        server_url: "bolt://localhost:7687",
        server_user: "neo4j",
        server_password: "reinform",
        labels: { //labels: Keyword and Note
            "Keyword": {
                "caption": "name",
                "size": "pagerank",
                "community": "community"
            }
        },
        relationships: {
          "CONTAINS": {
              "thickness": "salience",
              "caption": false
          }
        },
        // initial_cypher: "MATCH (n) RETURN *"
        initial_cypher: "MATCH (n)-[r:CONTAINS]->(m) RETURN *"
    };

    viz = new NeoVis.default(config);
    viz.render();
  }

  componentDidMount(){
      this.draw();
  }

  render() {
    return (
      <div className="Graph" id="viz"> 
      </div>
    );
  }
}
  
export default Graph;