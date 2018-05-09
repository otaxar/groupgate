import React from 'react';
import { Card } from "semantic-ui-react";
import User from '../components/User';
import Auth from '../lib/Auth';
import axios from 'axios';

const API_URL = `http://localhost:3000/api`                                     // TODO: move to dedicate API calls file
var config =  {
  headers: {  'Content-Type' : `application/json`,
              Authorization: `${ Auth.getToken() }`     }
}

class OtherUsersPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      udId: this.props.udId,
      users: [],
      myGroups: [],
      myInvites: [],
    }
    this.eachUser = this.eachUser.bind(this);
  }

  componentDidMount () {
      axios.get(`${API_URL}/userdetails`, config )                              // TODO: move to dedicated API calls file
        .then( response => this.setState({ users: response.data }) )
        .catch( (error) => console.log('Get error: ', error.response) );

  }


  eachUser(user, i) {
    //console.log('USR->each, i: ', i, ' user.id: ', user.id, '  this user: ', this.props.udId )                       //DEBUG
    if( user.id !== this.props.udId){                                           // Dont didsplay current user
      return (
          <User key={i}                                                         // attributes for other user
                index={user.id}                                                 // ...
                username={user.username}
                aboutMe={user.aboutMe}
                totalRating={user.totalRating}
                numOfVotes={user.numOfVotes}
                recordId={user.id}                                              // TODO: remove, repetitive w/ index
                udId={this.props.udId}                                          // attributes for current user
                currName={this.props.currName}                                  // ...
              />
      )
    }
  }

  render () {
    const { loading, users } = this.state;

    if (loading) {
      return (
        <main>
          <h4>Loading...</h4>
        </main>
      )
    }

    return (
      <main
        className="CourseIndex"
        style={{margin: '0 2rem'}}
        >
          <br/><br/>

          <Card.Group itemsPerRow='4'>
            { users.map(this.eachUser) }
          </Card.Group>
        </main>
      )
  }
}

export default OtherUsersPage;
