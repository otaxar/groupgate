import React, { Component } from 'react'
import { Modal, Button, Form, Card, Image  } from 'semantic-ui-react'
import InlineError from "../messages/InlineError";
import acad_img from '../../assets/academia.png';

const date = new Date();
// Correction of the default Modal formatting bug
const inlineStyle = {
  modal : {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

class ModalAddCourse extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: {
        name: '' ,
        term: this.getCurrentTerm(),
        year: date.getFullYear() ,
      },
      open: false,
      errors: {},
    }
  }

  show = dimmer => () => {
    this.setState({
      dimmer, open: true,
      errors: {},
      name: ''
    })
  }

  close = () => {
    this.reset()
  }

  reset = () => {
    this.setState({
      data: {
        name: '' ,
        term: this.getCurrentTerm(),
        year: date.getFullYear() ,
      },
      open: false,
      errors: {},
    })
  }

  getCurrentTerm(){
    return (  (date.getMonth()+1) >= 1 && ((date.getMonth()+1) <= 4 ) ? 'Spring' :
    ( ((date.getMonth()+1) >= 5 && (date.getMonth()+1) <= 8 ) ? 'Summer' : 'Fall' ) )
  }

  validate = data => {
    const errors = {};
    if (!data.name){
      errors.name = "Can't be blank";
    } else{
      for (let i = 0; i < this.props.courses.length; i++){                        // TODO: fix validation error (2nd time)
        if( (data.name.replace(/\s/g,'').toUpperCase() ) === this.props.courses[i].name
            && data.term === this.props.courses[i].term
            && data.year === this.props.courses[i].year ){
              errors.name = "Course already added";
              break;
        }
      }
    }
    return errors;
  };

  onChange = e =>
  this.setState({
    data: { ...this.state.data, [e.target.name]: e.target.value.replace(/\s/g,'').toUpperCase()  }
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
    return (
      <div>
        <Button id="add" basic color="blue" onClick={this.show('blurring')}> + Add Course</Button> <br></br>
        <Modal size='mini' dimmer={dimmer} open={open} onClose={this.close} style={inlineStyle.modal} >
          <Modal.Header>+ Add Course</Modal.Header>
          <Modal.Content>
            <Card>
              <Card.Content>
                <Image src={acad_img} size='mini' floated='left'/>
                <Card.Header>
                  {this.props.name}
                </Card.Header>
                <Form.Field error={!!errors.name}>
                  <Form.Input
                    focus
                    placeholder="Course name"
                    type="text"
                    id="name"
                    name="name"
                    className="login-form-control"
                    defaultValue={data.name}
                    onChange={this.onChange}
                  />
                  {errors.name && <InlineError text={errors.name} />}
                </Form.Field>
                <br/>
                Term:  <b> {this.getCurrentTerm()} {'  '}{  date.getFullYear()  } </b>
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

export default ModalAddCourse
