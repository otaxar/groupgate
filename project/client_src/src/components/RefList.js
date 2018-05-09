import React, { Component } from 'react';
import { Card } from "semantic-ui-react";
import Ref from './Ref';
import ModalAddRef from './modals/ModalAddRef';
import Auth from '../lib/Auth';
import axios from 'axios';

const API_URL = `http://localhost:3000/api`                                     // TODO: move into dedicated file to handle APi calls
var config =  {
  headers: {  'Content-Type' : `application/json`,
              Authorization: `${ Auth.getToken() }`     }
}

class RefList extends Component{
  constructor(props){
    super(props)
    this.state ={
        udId: this.props.udId,
        refs: []
    }

    this.add = this.add.bind(this);
    this.delete = this.delete.bind(this);
    this.eachRef = this.eachRef.bind(this);
  }

  componentDidMount(){
    if(this.props.udId)
      axios.get(`${API_URL}/userdetails/${this.props.udId}/refsActive`, config ) // -- GET REFS
        .then( response => this.setState({ refs: response.data }) )
        .catch( (error) => console.log('Cannot get refs: ', error.response) );  // DEBUG
  }

  add( data ){
    let payload = {   provider: data.provider, url: data.url,
                      userdetailId: this.state.udId               }
    axios.post(`${API_URL}/userdetails/${this.props.udId}/refsActive`, payload, config )
    .then( response => {} )
    .catch( (error) => console.log('Cannot create: ', error.response) );

    this.setState({ refs: [...this.state.refs, data] });
  }

  delete( id ){
    axios.delete(`${API_URL}/userdetails/${this.props.udId}/refsActive/${id}`, config )
      .then( response => console.log("App->deleted: ", response) )                // DEBUG
      .catch( (error) => console.log('Delete error: ', error.response) );
    this.setState(
      prevState => ({ refs: prevState.refs.filter( ref => ref.id !== id ) })
    )
  }

  eachRef(ref, i) {
    return (
      <Ref key={i}
        index={ref.id}
        provider={ref.provider}
        url={ref.url}
        recordId={ref.id}
        edit={this.props.edit}
        delete={this.delete}
      />
    )
  }

  render() {
    const { refs } = this.state
    return(
      <div>
        { this.props.edit ? <ModalAddRef add={this.add} /> : <div></div>
        }
        <br/>
        <Card.Group itemsPerRow='2'>
          { refs.map(this.eachRef) }
        </Card.Group>
      </div>
    )
  }
}

export default RefList;
