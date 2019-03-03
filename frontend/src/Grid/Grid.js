import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import {BeatLoader} from 'react-spinners';
import './Grid.css';

class Grid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gridResults: null
        }
    }

    componentDidMount = () => {
        fetch('https://horum.serveo.net/documents')
          .then((response) => {
            return response.json();
          })
          .then((myJson) => {
            console.log(JSON.stringify(myJson));
            this.setState({
                gridResults: myJson
            })
          });
    }

    isLoading = () => {
        return this.state.gridResults == null;
    }


    render() {
        if (this.state.gridResults == null) {
            return <BeatLoader
              sizeUnit={"px"}
              size={40}
              loading={this.isLoading()}
            />
        }

      return (
        <div>
            
            <div className="grid">
                {this.state.gridResults.map((res, idx) =>
                    <div className="item" key={idx}>
                        <img className="gridImg" src={res.link} alt={res.text}/>
                        <h3>{res.author}</h3>
                    </div>
                )}
            </div>
        </div>
      );
    }
}
  
export default Grid;