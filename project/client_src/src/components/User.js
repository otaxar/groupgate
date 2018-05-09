import React, { Component } from 'react';
import { Card, Image } from 'semantic-ui-react';
import user_img from '../assets/user.png';
import ModalUserDetails from './modals/ModalUserDetails';
import ModalInvite from './modals/ModalInvite';
import Auth from '../lib/Auth';
import axios from 'axios';

const API_URL = `http://localhost:3000/api`
var config =  {
  headers: {  'Content-Type' : `application/json`,
              Authorization: `${ Auth.getToken() }`     }
}

class User extends Component {
  constructor(props){
    super(props)
    this.state = {
      ratings: [],
      totalAvg: 0,
      skillsAvg: 0,
      commAvg: 0,
      timeAvg: 0,
      activeAvg: 0
    }
    //this.getTotal = this.getTotal.bind(this)
    this.invite = this.invite.bind(this);
  }

  componentDidMount(){
    axios.get(`${API_URL}/userdetails/${this.props.index}/ratings`, config )                              // TODO: move to dedicated API calls file
      .then( response => {
        this.setState({ ratings: response.data })
      })
      .catch( (error) => console.log('Get error: ', error.response) );
  }

  getTotal = () => {
    let tAvg = 0
    if( this.state.ratings.length > 0 ){
      for (let i=0; i < this.state.ratings.length; i++){ tAvg += this.state.ratings[i].avg }
      tAvg /= this.state.ratings.length
    }
    return (tAvg).toFixed(1)
  }

  getSkillsAvg = () => {
    let sAvg = 0
    if( this.state.ratings.length > 0 ){
      for (let i=0; i < this.state.ratings.length; i++){ sAvg += this.state.ratings[i].skills }
      sAvg /= this.state.ratings.length
    }
    return (sAvg).toFixed(1)
  }
  getCommAvg = () => {
    let cAvg = 0
    if( this.state.ratings.length > 0 ){
      for (let i=0; i < this.state.ratings.length; i++){ cAvg += this.state.ratings[i].comm }
      cAvg /= this.state.ratings.length
    }
    return (cAvg).toFixed(1)
  }
  getTimeAvg = () => {
    let tmAvg = 0
    if( this.state.ratings.length > 0 ){
      for (let i=0; i < this.state.ratings.length; i++){ tmAvg += this.state.ratings[i].time }
      tmAvg /= this.state.ratings.length
    }
    return (tmAvg).toFixed(1)
  }
  getActiveAvg = () => {
    let aAvg = 0
    if( this.state.ratings.length > 0 ){
      for (let i=0; i < this.state.ratings.length; i++){ aAvg += this.state.ratings[i].active }
      aAvg /= this.state.ratings.length
    }
    return (aAvg).toFixed(1)
  }




  invite ( data ){
    // console.log("invite-data: ", data)                                        //DEBUG
    let payload = { fromUdId: this.props.udId, fromName: this.props.currName,
                    toUdId: this.props.recordId, toName: this.props.username,
                    groupId: data.groupId, groupName: data.groupName,
                    course: data.course, status: 'Pending'
                  }
    axios.post(`${API_URL}/invites`, payload, config )
    .then( response => {} )
    .catch( (error) => console.log('Cannot create invite: ', error.response) );
  }

  render() {
    const { username, aboutMe } = this.props

    return(
      <Card>
        <Card.Content>
          <Image src={user_img} size='mini' floated='left'/>

          <Card.Header>
            { username } {"  "}
          </Card.Header>
          ( { this.getTotal() } % | { this.state.ratings.length } ratings )
        </Card.Content>
        <Card.Content>
          { aboutMe }
        </Card.Content>
        <Card.Content>
          <ModalInvite udId={this.props.udId}
                      toUsername={username}
                      totalRating={this.getTotal()}
                      numOfVotes={this.state.ratings.length}
                      invite={this.invite}
          />

          <ModalUserDetails udId={this.props.index}
                            username={this.props.username}
                            aboutMe={aboutMe}
                            totalRating={this.getTotal()}
                            numOfVotes={this.state.ratings.length}
                            skillsAvg={this.getSkillsAvg()}
                            commAvg={this.getCommAvg()}
                            timeAvg={this.getTimeAvg()}
                            activeAvg={this.getActiveAvg()}
          />

        </Card.Content>


      </Card>

    )
  }
}

export default User;
