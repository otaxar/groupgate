import React, { Component } from 'react'
import { Modal, Dropdown, Button, Form, Card  } from 'semantic-ui-react'
import InlineError from "../messages/InlineError";
//import li_img from '../../assets/linkedin.png';
//import git_img from '../../assets/git3.png';
//import stackflow_img from '../../assets/stackflow.png';
//import hrank_img from '../../assets/hrank.png';
//import other_img from '../../assets/other.png';

// Correction of the default Modal formatting bug
const inlineStyle = {
  modal : {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

const options = [
  { key: 'linkedin', text: 'LinkedIn', value: 'LinkedIn' },
  { key: 'git', text: 'Git', value: 'Git' },
  { key: 'stackoverflow', text: 'StackOverflow', value: 'StackOverflow' },
  { key: 'hackerrank', text: 'HackerRank', value: 'HackerRank' },
  { key: 'other', text: 'Other', value: 'Other' },
]


class ModalAddRef extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: {
        provider: '' ,
        url: ''
      },
      open: false,
      errors: {},
    }
  }

  show = dimmer => () => {
    this.setState({
      dimmer, open: true,
      errors: {},
      url: ''
    })
  }

  close = () => {
    this.reset()
  }

  reset = () => {
    this.setState({
      data: {   provider: '',
                url: '',         },
      open: false,
      errors: {},
    })
  }

  validate = data => {
    const errors = {};
    if (!data.url) { errors.url = "Can't be blank"; }
    if (!data.provider) { errors.provider = "Provider must be selected"; }
    return errors;
  };

  handleDropdownChange = (e, { value }) => this.setState({ data: {provider: value} })

  onChange = e =>
    this.setState({
      data: { ...this.state.data, [e.target.name]: e.target.value }
  });

  onSubmit = () => {
    const errors = this.validate(this.state.data);
    this.setState({ errors });

    if (Object.keys(errors).length === 0) {
      this.setState({ open: false })
      this.props.add( this.state.data );
      this.reset();
    }
  }

  render() {
    const { open, dimmer, errors, data } = this.state

    //console.log("addRef, prov:", data.provider, " url: ", data.url)

    return (
      <div>
        <Button id="add" basic color="blue" onClick={this.show('blurring')}> + Add Reference</Button> <br></br>
        <Modal size='small' dimmer={dimmer} open={open} onClose={this.close} style={inlineStyle.modal} >
          <Modal.Header>+ Add Reference</Modal.Header>
          <Modal.Content>

          <Card.Group itemsPerRow='1'>


            <Card>
              <Card.Content>
                <Card.Description>
                     <Dropdown  placeholder='Select Provider'
                                options={options}
                                selection
                                value={data.provider}
                                onChange={this.handleDropdownChange}
                                        />
                     {errors.provider && <InlineError text={errors.provider} />}
                </Card.Description>
                <br/>
                <Card.Description>
                  <Form.Field error={!!errors.url}>
                    <Form.Input
                      fluid
                      placeholder="HTTP link to your profile"
                      type="text"
                      id="url"
                      name="url"
                      className="login-form-control"
                      defaultValue={data.url}
                      onChange={this.onChange}
                    />
                    {errors.url && <InlineError text={errors.url} />}
                  </Form.Field>
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
            <Button positive icon='checkmark' labelPosition='right' content="Save" onClick={this.onSubmit} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default ModalAddRef
