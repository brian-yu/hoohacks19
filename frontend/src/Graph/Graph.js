import React, { Component } from 'react';
import NeoVis from 'neoviz.js';


class Graph extends Component {



  draw() {
    var viz;
    var config = {
        container_id: "viz",
        server_url: "localhost:7474",
        server_user: "neo4j",
        server_password: "reinform",
        labels: {
            "Character": {
                "caption": "name",
                "size": "pagerank",
                "community": "community"
            }
        },
        relationships: {
        "INTERACTS": {
            "thickness": "weight",
            "caption": false
        }
        },
        initial_cypher: "MATCH (n) RETURN *"
        // initial_cypher: "MATCH (n)-[r:INTERACTS]->(m) RETURN *"
    };

    viz = new NeoVis.default(config);
    viz.render();
  }

  componentDidMount(){
      
      const script = document.createElement("script");
      script.src = "https://rawgit.com/neo4j-contrib/neovis.js/master/dist/neovis.js"
      script.async = true;

      document.body.appendChild(script);

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