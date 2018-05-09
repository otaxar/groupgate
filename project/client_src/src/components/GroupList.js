import React, { Component } from 'react';
import { Card } from "semantic-ui-react";
import Group from './Group';
import ModalAddGroup from './modals/ModalAddGroup';
import Auth from '../lib/Auth';
import axios from 'axios';

const API_URL = `http://localhost:3000/api`
var config =  {
  headers: {  'Content-Type' : `application/json`,
              Authorization: `${ Auth.getToken() }`     }
}

class GroupList extends Component{
  constructor(props){
    super(props)
    this.state ={
      udId: this.props.udId,
      groups: [],                                                               // Groups owned
      memberships: [],                                                          // list of membership refs
      mGroups: [],                                                              // Groups where being a member
      nameOK: false,
    }
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.valName = this.valName.bind(this);
    this.lockRating = this.lockRating.bind(this);
    this.eachGroup = this.eachGroup.bind(this);
  }

  componentDidMount() {
    if( this.state.udId && this.props.admin )                                   // GET MY GROUPS (ADMIN)
      axios.get(`${API_URL}/userdetails/${this.props.udId}/groups`, config )     // TODO: move to dedicated API calls file
        .then( response => this.setState({ groups: response.data }) )
        .catch( (error) => console.log('Get error: ', error.response) );

    if( this.state.udId && !this.props.admin ){                                 // GET MY GROUPS (MEMBER ONLY)
      axios.get(`${API_URL}/userdetails/${this.props.udId}/members`, config )   // Get my memberships to groups (helper)
        .then( response => this.setState({ memberships: response.data })  )
        .then( response => {

          for (let i = 0; i < this.state.memberships.length; i++){              // get group infos
            axios.get(`${API_URL}/groups/${this.state.memberships[i].groupId}`, config )
              .then( response => this.setState({ mGroups: [...this.state.mGroups, response.data] }) )
              .catch( (error) => console.log('Get error: ', error.response) );
          }
        })
        .catch( (error) => console.log('Get error: ', error.response) );
    }
  }

  // --- ADD GROUP ---
  add( payload ) {
    console.log("Add group->payload: ", payload)         // DEBUG
    axios.post(`${API_URL}/userdetails/${this.props.udId}/groups`, payload, config )
      .then( response => { /*console.log("Group created: ", response.data ) */
      } )
      .catch( (error) => console.log('Cannot create: ', error.response) );


    this.setState({ groups: [...this.state.groups, payload] });
  }

  update( payload, id ){
    console.log("Update group->payload: ", payload, ' index: ', id )           // DEBUG

    axios.put(`${API_URL}/userdetails/${this.props.udId}/groups/${id}`, payload, config )
      .then( response => {} )
      .catch( (error) => console.log('Cannot create: ', error.response) );

    this.setState(prevState => ({
    	groups: prevState.groups.map( group => (group.id !== id) ? group : {...group, name: payload.name,
                   course: payload.course, status: payload.status, descr: payload.descr, url: payload.url, git: payload.git } )
    	}))
  }

  delete( id ) {
      // console.log('Delete group: ', id)
      axios.delete(`${API_URL}/userdetails/${this.props.udId}/groups/${id}`, config )
        .then( response => console.log("Deleted: ", response) )                // DEBUG
        .catch( (error) => console.log('Delete error: ', error.response) );
      this.setState(
        prevState => ({ groups: prevState.groups.filter( group => group.id !== id ) })
      )
  }

  valName( data ){
    if (data.name){
      console.log("GL->data.name: ", data.name)
      this.setState({ nameOK: true })
    }
    else{ this.setState({ nameOK: false }) }
  }

  lockRating( id ){
    let payload = { rLock: true }
    axios.patch(`${API_URL}/groups/${id}`, payload, config )
      .then( response => {} )
      .catch( (error) => console.log('Cannot update my admin group rLock : ', error.response) );
    this.setState(prevState => ({
      groups: prevState.groups.map( group => (group.id !== id) ? group : {...group, rLock: true } )
      }))
  }


  eachGroup(group, i) {
    //console.log('GL->each, i: ', i, ' group: ', group )                         //DEBUG
    return (
      <Group key={i}
        index={group.id}                                                        // index = group record id
        name={group.name}
        status={group.status}
        descr={group.descr}
        course={group.course}
        owner={group.owner}
        admin={this.props.admin}                                                // differentiates between admin and member groups
        rLock={group.rLock}
        url={group.url}
        git={group.git}
        udId={this.props.udId}
        buttons={ this.props.buttons }                                          // enables/disabled edit/delete buttons
        rButtons={this.props.rButtons}                                          // enables/disables rating section
        update={this.update}
        delete={this.delete}
        lockRating={this.lockRating}
      />
    )
  }

  render() {
    const { groups, mGroups } = this.state

    //console.log("GL render, mGroups:", this.state.mGroups)                    //DEBUG

    return(
      <div>
        {this.props.addButton ? <ModalAddGroup udId={this.props.udId}
                                          currName={this.props.currName}
                                          valName={this.valName}
                                          editMode={false}
                                          add={this.add} />
                          : <div></div>
        } <br/>

        {this.props.admin ? <Card.Group itemsPerRow='3'>
                              { groups.map(this.eachGroup) }
                            </Card.Group>
                          : <Card.Group itemsPerRow='3'>
                              { mGroups.map(this.eachGroup) }
                            </Card.Group>
        }
      </div>
    )
  }
}

export default GroupList;
