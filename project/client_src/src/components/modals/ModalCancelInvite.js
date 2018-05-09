import React, { Component } from 'react'
import { Modal, Grid, Card, Image, Button, Icon  } from 'semantic-ui-react';
import user_img from '../../assets/user.png';

// Correction of the default Modal formatting bug
const inlineStyle = {
  modal : {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

class ModalCancelInvite extends Component {
  state = {
    open: false
  }

  show = dimmer => () => this.setState({ dimmer, open: true })
  close = () => this.setState({ open: false })

  cancel = () => {
    this.close();
    this.props.cancel( this.props.id )
  }

  getButton(){
    if (this.props.status === "Pending"){
      return <Button size='mini' basic color='red'
                  onClick={this.show('blurring')}>
                  <Icon name='close'/>Cancel</Button>
    }
  }

  render() {
    const { open, dimmer } = this.state

    return (
      <div>

        {this.getButton()}

        <Modal size={this.props.size} dimmer={dimmer} open={open} onClose={this.close} style={inlineStyle.modal} >
          <Modal.Header>Cancel {this.props.subject}</Modal.Header>

          <Modal.Content>

            <Card.Group itemsPerRow='1'>
              <Card>
                <Card.Content>

                  <Card>
                    <Card.Content>
                      <Image src={user_img} size='mini' floated='left'/>

                      <Card.Header>
                        { this.props.toUsername }
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
                      </Grid.Row>
                    </Grid>
                  </Card.Description>
                  <br/>
                </Card.Content>
              </Card>
            </Card.Group>

              <h4>Are you sure you want to cancel this {this.props.subject} ?</h4>
          </Modal.Content>

          <Modal.Actions>
            <Button color='black' onClick={this.close}>
              Cancel
            </Button>
            <Button negative icon='close' labelPosition='right' content="Cancel" onClick={this.cancel} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default ModalCancelInvite
