
import './Graph.css';
import React, { Component } from 'react';
const NeoVis = require('neovis.js');


class Graph extends Component {
  constructor(props) {
    super(props);
  }

  draw() {
    var init = "";
    if (this.props.query !== ""){
      init = "MATCH (n)-[r:CONTAINS]->(m) WHERE m.name STARTS WITH '" + this.props.query + "' OR n.text CONTAINS '" + this.props.query + "' OR n.author CONTAINS '" + this.props.query + "' RETURN *";
    } else {
      init = "MATCH (n)-[r:CONTAINS]->(m) RETURN *";
    }
    var viz;
    var config = {
        container_id: "viz",
        // server_url: "bolt://localhost:7687",
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
        initial_cypher: init
    };

    viz = new NeoVis.default(config);
    viz.render();
  }

  componentDidMount(){
      this.draw();
  }
  componentWillReceiveProps(nextProps) {
      this.props = nextProps;
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