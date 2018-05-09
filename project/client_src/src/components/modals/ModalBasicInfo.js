import React, { Component } from 'react'
import { Modal, Grid, Card, Button, Image, Form, Popup  } from 'semantic-ui-react'
import InlineError from "../messages/InlineError";
import user_img from '../../assets/user.png';

// Correction of the default Modal formatting bug
const inlineStyle = {
  modal : {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

class ModalBasicInfo extends Component {
  state = {
    data: {
      username: this.props.basicInfo.username ,
      aboutMe: this.props.basicInfo.aboutMe,
    },
    open: false,
    errors: {},
  }

  show = dimmer => () => this.setState({ dimmer, open: true })
  close = () => this.setState({ open: false })

  componentWillReceiveProps( nextProps ){
    if ( nextProps !== this.props ) {
      this.setState({ data: nextProps.basicInfo })
      //console.log("MP->props updated: ", this.state)
    }
  }

  validate = data => {
    const errors = {};
    if (!data.username) errors.username = "Can't be blank";                                                                        // TODO: Validate that the username is unique
    return errors;
  };

  onChange = e =>
  this.setState({
    data: { ...this.state.data, [e.target.name]: e.target.value }
  });

  onSubmit = () => {
    const errors = this.validate(this.state.data);
    this.setState({ errors });

    if (Object.keys(errors).length === 0) {
      this.setState({ open: false })
      this.props.onSave( this.state.data )
    }
  }

  render() {
    const { open, dimmer, errors, data } = this.state

    //console.log("Modal->BI, state data: ", data )

    return (
      <div>

        <Popup trigger={   <Button icon='pencil' size='mini' basic floated='right'
                                   onClick={this.show('blurring')} />}
               content='Edit' size='tiny'
        />



        <Modal dimmer={dimmer} open={open} onClose={this.close} style={inlineStyle.modal} >
          <Modal.Header>Edit Basic Info</Modal.Header>
          <Modal.Content>

            <Card fluid>
              <Card.Content>

                <Grid celled>
                  <Grid.Row>
                    <Grid.Column width={2} >
                      <Image src={user_img} size='tiny' floated='left'/>
                    </Grid.Column>
                    <Grid.Column width={10} >
                      <Form className="ui form center" >
                        <Form.Field error={!!errors.username}>
                          <Form.Input width={8}
                            label="Username:"
                            type="text"
                            id="username"
                            name="username"
                            className="login-form-control"
                            value={data.username}
                            onChange={this.onChange}
                          />
                          {errors.username && <InlineError text={errors.username} />}
                        </Form.Field>
                        <Form.Field>
                          <Form.TextArea autoHeight
                            label="About me:"
                            type="text"
                            id="aboutMe"
                            name="aboutMe"
                            className="login-form-control"
                            value={data.aboutMe}
                            onChange={this.onChange}
                          />
                        </Form.Field>
                      </Form>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>




              </Card.Content>
            </Card>





          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.close}>
              Cancel
            </Button>
            <Button positive icon='checkmark' labelPosition='right' content="Save" onClick={this.onSubmit} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default ModalBasicInfo
