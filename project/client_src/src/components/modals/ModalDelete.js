import React, { Component } from 'react'
import { Modal, Card, Image, Button, Popup  } from 'semantic-ui-react';

// Correction of the default Modal formatting bug
const inlineStyle = {
  modal : {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

class ModalDelete extends Component {
  state = {
    open: false
  }

  show = dimmer => () => this.setState({ dimmer, open: true })
  close = () => this.setState({ open: false })

  delete = () => {
    this.close();
    this.props.delete( this.props.index )
  }

  render() {
    const { open, dimmer } = this.state

    return (
      <div>

        <Popup trigger={ <Button icon='delete' basic size='mini' floated='right'
                                 onClick={this.show('blurring')} />}
               content='Delete' size='mini'
        />

        <Modal size={this.props.size} dimmer={dimmer} open={open} onClose={this.close} style={inlineStyle.modal} >
          <Modal.Header>Delete {this.props.subject}</Modal.Header>

          <Modal.Content>

            <Card fluid>
              <Card.Content>

                <Image src={this.props.icon} size='mini' floated='left'/>
                <Card.Header>
                  {this.props.name}
                </Card.Header>
                  {this.props.label1}{' '}{this.props.item1} {'   '}{this.props.item2}
              </Card.Content>
            </Card>

              <p>Are you sure you want to delete this {this.props.subject} ?</p>
          </Modal.Content>

          <Modal.Actions>
            <Button color='black' onClick={this.close}>
              Cancel
            </Button>
            <Button positive icon='checkmark' labelPosition='right' content="Delete" onClick={this.delete} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default ModalDelete
