import React, { Component} from 'react';
import { Card, Grid, Label, Button, Image, Icon, Modal } from 'semantic-ui-react';
import team_img from '../assets/team.png';
import ModalEditGroup from './modals/ModalAddGroup';
import ModalDelete from './modals/ModalDelete';
import ModalRate from './modals/ModalRate';
import Auth from '../lib/Auth';
import axios from 'axios';

const API_URL = `http://localhost:3000/api`
var config =  {
  headers: {  'Content-Type' : `application/json`,
              Authorization: `${ Auth.getToken() }`     }
}

// Correction of the default Modal formatting bug
const inlineStyle = {
  modal : {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

class Group extends Component {                     // TODO: turn into stateless component
  constructor(props){
    super(props)
    this.state = {
      groupMembers: [],
      ratings: [],
      skillsOK: false,
      commOK: false,
      timeOK: false,
      activeOK: false,
      myMemberId: '',
      myMemberRlock: null,
      openConfModal: false,
    }
    this.valSkills = this.valSkills.bind(this);
    this.valComm = this.valComm.bind(this);
    this.valTime = this.valTime.bind(this);
    this.valActive = this.valActive.bind(this);
    this.resetOKs = this.resetOKs.bind(this);
    this.update = this.update.bind(this);
    this.rate = this.rate.bind(this);
    this.checkRlock = this.checkRlock.bind(this);
  }

  componentDidMount() {                                                         // TODO: move the member loading to Modal
    if(this.props.index){
      var tmp = []                                                              // temp storage to filter out info needed in ratings array
      axios.get( `${API_URL}/groups/${this.props.index}/userdetails`, config )  // --- GET ADMIN
      .then( (response) => {  /*console.log('Get admin, resp data: ', response.data)  */               //DEBUG
            response.data.map( (userdetail) => {
              if( userdetail.id !== this.props.udId )
              tmp.push({ udId: userdetail.id, username: userdetail.username, skills: -1.0, comm: -1.0, time: -1.0, active: -1.0 });
            })
      })
      .catch( (error) => console.log('Get members err: ', error.response) );    // DEBUG

      axios.get( `${API_URL}/groups/${this.props.index}/members`, config )
      .then( (response) => {  /*console.log('Get members, resp data: ', response.data) */                //DEBUG
            response.data.map( (member) => {
              if( member.userdetailId !== this.props.udId ){
                tmp.push({ udId: member.userdetailId, username: member.username, skills: -1.0, comm: -1.0, time: -1.0, active: -1.0 });
              }else{
                this.setState({ myMemberId: member.id, myMemberRlock: member.rLock })
              }
            })
            this.setState({ ratings: tmp })
            this.setState({ groupMembers: response.data })
      })
      .catch( (error) => console.log('Get members err: ', error.response) );    // DEBUG
    }
  }

  close = () => { this.setState({  openConfModal: false }) }

  update( data, status, id ){
    this.props.update( data, status, id )
  }

  // Validations for the Rating form
  valSkills( ratings ){
    let negCt = 0

    let usrsLeft = ratings.length
    for(let i=0; i < ratings.length; i++){
      if( ratings[i].skills < 0 ) ++negCt
      else usrsLeft--
    }
    console.log('Users left: ', usrsLeft)                                       //DEBUG
    console.log("ratings: ", ratings )
    if( negCt === 0 && usrsLeft === 0){
      this.setState({ skillsOK: true })
      usrsLeft = ratings.length
    }
  }
  valComm( ratings ){
    let negCt = 0
    for(let i=0; i < ratings.length; i++){
      if( ratings[i].comm < 0 ) ++negCt
    }
    if( negCt === 0) this.setState({ commOK: true })
  }
  valTime( ratings ){
    let negCt = 0
    for(let i=0; i < ratings.length; i++){
      if( ratings[i].time < 0 ) ++negCt
    }
    if( negCt === 0) this.setState({ timeOK: true })
  }

  valActive( ratings ){
    let negCt = 0
    for(let i=0; i < ratings.length; i++){
      if( ratings[i].active < 0 ) ++negCt
    }
    if( negCt === 0) this.setState({ activeOK: true })
  }

  resetOKs(){
    this.setState({ skillsOK: false, commOK: false, timeOK: false, activeOK: false })
  }

  rate ( ratings ){
    for(let i=0; i < ratings.length; i++){
      let payload= { userdetailId: ratings[i].udId, skills: ratings[i].skills, comm: ratings[i].comm,
                     time: ratings[i].time,  active: ratings[i].active,
                     avg: (ratings[i].skills + ratings[i].comm + ratings[i].time + ratings[i].active)/4   }
      axios.post(`${API_URL}/ratings`, payload, config )                        // ADD RATINGS FOR THE OTHER GROUP MEMBERS
        .then( response => { console.log("Rating created: ", response.data ) } )
        .catch( (error) => console.log('Cannot create rating: ', error.response) );
      }

      if(this.props.admin){
        this.props.lockRating( this.props.index )                               //update my group rRlock
      }else{
        let payload = { rLock: true }
        axios.patch(`${API_URL}/members/${this.state.myMemberId}`, payload, config )  // UPDATE MY MEMBERSHIP group rLock
          .then( response => {} )
          .catch( (error) => console.log('Cannot update my membership rLock : ', error.response) );
        this.setState({ myMemberRlock: true })
      }

      this.setState({ openConfModal: true })
  }

  checkRlock(){
    return this.props.admin ? this.props.rLock : this.state.myMemberRlock
  }


  render(){
    //console.log("Group, members: ", this.state.groupMembers)                 //DEBUG
    //console.log("Group, ratings: ", this.state.ratings)
    return(
      <Card>
        <Card.Content>
          <Image src={team_img} size='mini' floated='left'/>
          { this.props.buttons ? <Button.Group size='mini' floated='right'>
                                  <ModalEditGroup udId={this.props.udId}
                                                  index={this.props.index}
                                                  name={this.props.name}
                                                  status={this.props.status}
                                                  descr={this.props.descr}
                                                  course={this.props.course}
                                                  url={this.props.url}
                                                  git={this.props.git}
                                                  update={this.update}
                                                  editMode={true} />
                                  <ModalDelete  index={this.props.index}
                                                size={'tiny'}
                                                subject={'group'}
                                                name={this.props.name}
                                                delete={this.props.delete} />
                                </Button.Group>
                             : <div></div>
          }
          <Card.Header>
            {this.props.name}
          </Card.Header>
            {this.props.course} &nbsp; &nbsp; &nbsp;
            Status: {this.props.status}

        </Card.Content>
            <Card.Content>
                  Description: {this.props.descr} <br/>
              <Grid>
                <Grid.Column width={3}>
                    Website:
                    Git:
                </Grid.Column>
                <Grid.Column width={10}>
                  <a target="_blank" href={'' + this.props.url}>{this.props.url} </a><br/>
                  <a target="_blank" href={'' + this.props.git}>{this.props.git} </a>
                </Grid.Column>
              </Grid>
              Admin: <Label basic horizontal >{this.props.owner}</Label> <br/>
              Members: {this.state.groupMembers.map( (member) => {
                        return (<Label basic horizontal key={member.id}> {member.username}</Label>)})}
            </Card.Content>
            { this.props.rButtons ?
              <Card.Content>
                { this.checkRlock() ?  <Grid><Grid.Column width={8}>
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                          <Label basic color='green' floated='right'><Icon name='checkmark' />Members rated</Label>
                                        </Grid.Column>
                                      </Grid>
                                   :
                                      this.state.groupMembers.length > 0 ?
                                        <ModalRate groupName={this.props.name}
                                          course={this.props.course} ratings={this.state.ratings}
                                          valSkills={this.valSkills} skillsOK={this.state.skillsOK}
                                          valComm={this.valComm} commOK={this.state.commOK}
                                          valTime={this.valTime} timeOK={this.state.timeOK}
                                          valActive={this.valActive} activeOK={this.state.activeOK}
                                          resetOKs={this.resetOKs} rate={this.rate}
                                        />
                                        : <Grid><Grid.Column width={9}>
                                            </Grid.Column>
                                            <Grid.Column width={7}>
                                              <Label floated='right'>No members yet</Label>
                                            </Grid.Column>
                                          </Grid>
                }
              </Card.Content>
              : <div></div>
            }

            <Modal size='tiny' dimmer={'blurring'} open={this.state.openConfModal}
                   onClose={this.close} style={inlineStyle.modal} >
              <Modal.Content>
                <Card.Group itemsPerRow='1'>
                  <Card>
                    <Card.Content>
                      <Card.Header>
                         <Icon name='checkmark' color='green' /> Your ratings for {this.props.name} have been submitted.
                      </Card.Header>
                    </Card.Content>
                  </Card>
                </Card.Group>
              </Modal.Content>
              <Modal.Actions>
                <Button color='green' onClick={this.close} >Close</Button>
                </Modal.Actions>
            </Modal>
      </Card>
    )
  }
}
export default Group;
