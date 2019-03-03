import React, { Component } from 'react';






class Graph extends Component {

  draw() {
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

  render() {
    return (
      <div className="Graph">
        Hello World
      </div>
    );
  }
}
  
export default Graph;