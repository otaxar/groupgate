import React, { Component } from 'react'
import { Modal, Grid, Button, Dropdown, Card, Image, Icon, Popup  } from 'semantic-ui-react'
//import InlineError from "../messages/InlineError";
import user_img from '../../assets/user.png';
import Auth from '../../lib/Auth';
import axios from 'axios';

const API_URL = `http://localhost:3000/api`                                     //TODO: Move to dedicated API calls file
var config =  {
  headers: {  'Content-Type' : `application/json`,
              Authorization: `${ Auth.getToken() }`  }
}

// Correction of the default Modal formatting bug
const inlineStyle = {
  modal : {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

class ModalInvite extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: {
        group: '' ,
        groupName: '',
        course: ''
      },
      groupsAvail: [],
      saveDisabled: true,
      openConfModal: false,
      open: false,
    }
  }

  componentDidMount(){
    if(this.props.udId){
      let tmp = []
      axios.get(`${API_URL}/userdetails/${this.props.udId}/groups`, config ) // -- GET CURRENT USER`s GROUPS
      .then(response => {
        response.data.map( (group) => { tmp.push({ key: group.id, text: group.name, value: group.id, course: group.course }) })
        this.setState({groupsAvail: tmp })
      })
      .catch( (error) => console.log('Cannot get group: ', error.response) );  // DEBUG
    }
  }

  show = dimmer => () => {
    this.setState({
      dimmer, open: true
    })
  }

  close = () => { this.reset() }

  reset = () => { this.setState({ data: { groupId: '',
                                          groupName: '',
                                          course: ''     },
                                          saveDisabled: true,
                                          openConfModal: false,
                                          open: false,
                               })
  }

  handleDropdownChange = (e, { value }) => {
      var item = this.state.groupsAvail.find(item => item.key === value)
      this.setState({ data: {groupId: value, groupName: item.text, course: item.course },
                      saveDisabled: false})
  }

  onSubmit = () => {
      this.setState({ open: false, openConfModal: true })
      this.props.invite( this.state.data );
  }

  render() {
    const { open, dimmer, data, groupsAvail } = this.state

    return (
      <div>
        <Popup trigger={ <Button size='mini' basic color='blue'
                                 floated='right' onClick={this.show('blurring')} ><Icon name='mail outline'/>Invite</Button> }
               content='Invite user to your group' size='tiny'
        />
        <Modal size='tiny' dimmer={dimmer} open={open} onClose={this.close} style={inlineStyle.modal} >
          <Modal.Header>Invite User</Modal.Header>
          <Modal.Content>

          <Card.Group itemsPerRow='1'>
            <Card>
              <Card.Content>

                <Card>
                  <Card.Content>
                    <Image src={user_img} size='mini' floated='left'/>

                    <Card.Header>
                      { this.props.toUsername } {"  "}
                    </Card.Header>
                    ( { this.props.totalRating } % | { this.props.numOfVotes } ratings )
                  </Card.Content>
                </Card>

                <Card.Description>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={9}>
                        <h4>Into your group:</h4>
                        <Dropdown  placeholder='Select Group'
                                  options={groupsAvail}
                                  selection
                                  value={data.groupId}
                                  onChange={this.handleDropdownChange}
                        />
                      </Grid.Column>
                      <Grid.Column width={7}>
                          <h4>Course:</h4><h5>{this.state.data.course}</h5>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card.Description>
                <br/>
              </Card.Content>
            </Card>
          </Card.Group>

          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.close}>
              Cancel
            </Button>
            <Button disabled={this.state.saveDisabled} positive icon='checkmark' labelPosition='right' content="Invite" onClick={this.onSubmit} />
          </Modal.Actions>
        </Modal>

        <Modal size='tiny' dimmer={dimmer} open={this.state.openConfModal}
               onClose={this.close} style={inlineStyle.modal}
        >
          <Modal.Content>
            <Card.Group itemsPerRow='1'>
              <Card>
                <Card.Content>
                  <Card.Header>
                     <Icon name='checkmark' color='green' /> Your invitation to {this.props.toUsername} has been sent.
                  </Card.Header>
                </Card.Content>
              </Card>
            </Card.Group>
          </Modal.Content>

          <Modal.Actions>
            <Button color='green' onClick={this.close} >Close</Button>
            </Modal.Actions>
        </Modal>

      </div>
    )
  }
}

export default ModalInvite
