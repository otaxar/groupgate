import React, { Component } from 'react'
import { Modal, Grid, Button, Card, Image, Icon  } from 'semantic-ui-react'
//import InlineError from "../messages/InlineError";
import user_img from '../../assets/user.png';

// Correction of the default Modal formatting bug
const inlineStyle = {
  modal : {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

class ModalAnswerInvite extends Component {
  constructor(props){
    super(props)
    this.state = {
      openConfModal: false,
      open: false,
    }
  }

  show = dimmer => () => this.setState({ dimmer, open: true })
  close = () => this.setState({ open: false, openConfModal: false })

  update =() => {
    this.setState({ open: false, openConfModal: true });
    this.props.update( this.props.groupId, this.props.toUsername, this.props.id, this.props.accept ? 'Accepted' : 'Declined' )
  }

  getButton(){
    if (this.props.status === "Pending"){
      return this.props.accept ?
      <Button size='mini' basic color='green' floated='right'
                               onClick={this.show('blurring')}><Icon name='checkmark'/>Accept</Button>
        : <Button size='mini' basic color='red'
                  onClick={this.show('blurring')}><Icon name='close'/>Decline</Button>
    }
  }

  render() {
    const { open, dimmer } = this.state

    return (
      <div>
        {this.getButton()}
        <Modal size='tiny' dimmer={dimmer} open={open} onClose={this.close} style={inlineStyle.modal} >
          <Modal.Header> { this.props.accept ? <div>Accept Invitation From</div> : <div>Decline Invitation From</div>}  </Modal.Header>
          <Modal.Content>

          <Card.Group itemsPerRow='1'>
            <Card>
              <Card.Content>

                <Card>
                  <Card.Content>
                    <Image src={user_img} size='mini' floated='left'/>

                    <Card.Header>
                      { this.props.fromUsername }
                    </Card.Header>
                    Course: { this.props.course }
                  </Card.Content>
                </Card>

                <Card.Description>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={9}>
                        <h4>Into group:</h4>
                        {this.props.groupName}
                      </Grid.Column>
                      <Grid.Column width={7}>

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
            { this.props.accept
              ? <Button positive icon='checkmark' labelPosition='right' content="Accept" onClick={this.update} />
              : <Button negative icon='close' labelPosition='right' content="Decline" onClick={this.update} />   }
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
                     <Icon name= {this.props.accept ? 'checkmark' : 'close' }
                           color= {this.props.accept ? 'green' : 'red' } />
                      Your have {this.props.accept ? <span>accepted </span> : <span>declined </span>}
                      invitation
                  </Card.Header>
                  from: {this.props.fromUsername} ( {this.props.course}  )<br/>
                  into group:  {this.props.groupName}
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

export default ModalAnswerInvite
