import React, { Component } from 'react'
import { Modal, Dropdown, Button, Form, Card, Grid, TextArea, Popup  } from 'semantic-ui-react'
import InlineError from "../messages/InlineError";
import Auth from '../../lib/Auth';
import axios from 'axios';

const API_URL = `http://localhost:3000/api`                                     //TODO: Move to dedicated API calls file
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

const statOptions = [
  { key: '1', text: 'Open', value: 'Open' },
  { key: '2', text: 'Closed', value: 'Closed' },
]

//-----------------------------------------------------------------------------
class ModalAddGroup extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: this.props.name,
      status: this.props.status,
      course: this.props.course,
      descr: this.props.descr,
      owner: this.props.currName,
      url: this.props.url,
      git: this.props.git,
      open: false,
      errors: {},
      nameOK: false,
      statusOK: false,
    }
  }

  componentDidMount(){
    if(this.props.udId){
      let tmp = []
      axios.get(`${API_URL}/userdetails/${this.props.udId}/coursesTaken`, config ) // -- GET COURSES TAKEN
      .then(response => {
        response.data.map( (course) => { tmp.push({ key: course.name, text: course.name, value: course.name }) })
        this.setState({courseOptions: tmp })
      })
      .catch( (error) => console.log('Cannot get courses: ', error.response) );  // DEBUG
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
      courseOptions: [],
      nameOK: false,
      statusOK: false,
      open: false,
      errors: {},
    })
  }

  validate = () => {
    const errors = {};
    if (!this.state.name) { errors.name = "Can't be blank"; }
    if (!this.state.status) { errors.status = "Status must be selected"; }
    return errors;
  };

  onSubmit = () => {
    const errors = this.validate();
    this.setState({ errors });

    if (Object.keys(errors).length === 0) {
      this.setState({ open: false })
      if (this.props.editMode){
        let payload = { name: this.state.name, status: this.state.status,
                        course: this.state.course,
                        descr: ( this.state.descr ? this.state.descr : '' ) ,
                        url: this.state.url, git: this.state.git }
        this.props.update( payload, this.props.index );
      }
      else{
        let payload = { name: this.state.name, status: this.state.status,
                        course: this.state.course, owner: this.props.currName,
                        descr: ( this.state.descr ? this.state.descr : '' ) ,
                        url: this.state.url, git: this.state.git, rLock: false }

        this.props.add( payload, this.state.course );
      }
    }
  }

  render() {
    const { open, dimmer, errors, courseOptions, nameOK, statusOK } = this.state

    //console.log("addRef, prov:", data.provider, " url: ", data.url)

    return (
      <div>
        {this.props.editMode ?
            <Popup trigger={ <Button icon='pencil' size='mini' basic floated='right'
                                     onClick={this.show('blurring')} />}
                   content='Edit' size='tiny'/>
          : <Button id="add" basic color="blue"
                    onClick={this.show('blurring')}> + Add Group</Button>
        }
        <Modal size='tiny' dimmer={dimmer} open={open} onClose={this.close} style={inlineStyle.modal} >
          <Modal.Header>+ Add Group</Modal.Header>
          <Modal.Content>
            <Card.Group itemsPerRow='1'>
              <Card>
                <Card.Content>
                  <Card.Description>

                      <Form>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column width={16}>
                              <Form.Field > {errors.name && <InlineError text={errors.name} />}
                                <Form.Input
                                  fluid
                                  placeholder="Group name (required)"
                                  type="text"
                                  id="name"
                                  name="name"
                                  className="login-form-control"
                                  defaultValue={this.props.name}
                                  onChange={ (e) => {
                                    this.setState({ name: e.target.value })
                                    if(e.target.value)
                                         this.setState({ nameOK: true })
                                    else this.setState({ nameOK: false })

                                  } }
                                />
                              </Form.Field>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={7}>
                              <Dropdown  selection options={statOptions}
                                         placeholder='Select Status (required)'
                                         value={this.props.status}

                                         onChange={ (e,{value}) => {
                                           console.log("changing status: ", value)
                                             this.setState({ status: value, statusOK: true })

                                             } }
                                                 />
                              {errors.status && <InlineError text={errors.status} />}
                            </Grid.Column>
                            <Grid.Column width={1}>
                            </Grid.Column>

                            <Grid.Column width={7}>
                              <Dropdown  selection options={courseOptions}
                                         placeholder='Select Course'
                                         value={this.props.course}
                                         onChange={ (e,{value}) => {
                                                       console.log("changing course: ", value )
                                                       this.setState({ course: value })
                                                     }
                                                   }
                                                 />
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={16}>
                              <Form.Input id='descr' name='descr' control={TextArea}
                                          autoHeight placeholder='Description'
                                          defaultValue={this.props.descr}
                                          onChange={ (e) => this.setState({ descr: e.target.value }) }/>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column>
                              <Form.Input id='url' name='url' width={16}
                                          placeholder='Project website (Paste the HTTP address here) '
                                          defaultValue={this.props.url}
                                          onChange={ (e) => this.setState({ url: e.target.value }) } />

                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Column width={16}>
                              <Form.Input id='git' name='git'
                                          placeholder='Git repository (Paste the HTTP address here) '
                                          defaultValue={this.props.git} width={16}
                                          onChange={ (e) => this.setState({ git: e.target.value }) } />
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      </Form>
                  </Card.Description><br/>
                  <Card.Description>
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
            <Button disabled={ !(nameOK && statusOK)} positive icon='checkmark' labelPosition='right' content="Save" onClick={this.onSubmit} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default ModalAddGroup




















/*

import React, { Component } from 'react'
import { Modal, Button, Select, Form, TextArea, Card, Popup  } from 'semantic-ui-react'
import InlineError from "../messages/InlineError";
import Auth from '../../lib/Auth';
import axios from 'axios';

const API_URL = `http://localhost:3000/api`                                     //TODO: Move to dedicated API calls file
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

const statOptions = [
  { key: '1', text: 'Open', value: 'Open' },
  { key: '2', text: 'Closed', value: 'Closed' },
]

class ModalAddGroup extends Component {
  constructor(props){
    super(props)
    this.state = {
      data: {
        name: this.props.name ,
        status: this.props.status,
        course: this.props.course,
        descr: this.props.descr,
        owner: this.props.currName,
        url: this.props.url,
        git: this.props.git,
        members: []
      },
      coursesAvail: [],
      selStatus: '',
      open: false,
      errors: {},
    }
    this.getButton = this.getButton.bind(this);
  }

  componentDidMount(){
    if(this.props.udId){
      let tmp = []
      axios.get(`${API_URL}/userdetails/${this.props.udId}/coursesTaken`, config ) // -- GET COURSES TAKEN
      .then(response => {
        response.data.map( (course) => { tmp.push({ key: course.name, text: course.name, value: course.name }); })
        this.setState({coursesAvail: tmp })
      })
      .catch( (error) => console.log('Cannot get courses: ', error.response) );  // DEBUG
    }
    this.setState({ data: {status: 'Open' }})
  }

  show = dimmer => () => {
    this.setState({
      errors: {},
      dimmer, open: true,
    })
  }

  close = () => {
    this.reset()
  }

  reset = () => {
    this.setState({
      data: {},
      errors: {},
      open: false,
    })
  }

  validate = data => {
    const errors = {};
    if (!data.name) { errors.name = "Can't be blank"; }
    return errors;
  };

  onChange = e => {
    this.setState({ data: { ...this.state.data, [e.target.name]: e.target.value } },
                    () => this.props.valName( this.state.data ) );

    console.log("MAG->state, name: ", this.state.data.name)

  }

  onSubmit = () => {
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    //console.log('Submit, state: ', this.state )

    if (Object.keys(errors).length === 0) {
      this.setState({ open: false })
      //console.log('MAG->editMode: ', this.props.editMode)                       //DEBUG
      if (this.props.editMode)
        this.props.update( this.state.data, this.state.selStatus, this.props.index );
      else
        this.props.add( this.state.data, this.state.selStatus );
    }
  }

  getButton(){
    return this.props.editMode ?
        <Popup trigger={ <Button icon='pencil' size='mini' basic floated='right'
                                 onClick={this.show('blurring')} />}
               content='Edit' size='tiny'/>
      : <Button id="add" basic color="blue"
                onClick={this.show('blurring')}> + Add Group</Button>
  }

  render() {
    const { open, dimmer, errors, coursesAvail } = this.state
    //console.log('coursesAvail: ', this.state.coursesAvail)                      //DEBUG
    return (
      <div>
        { this.getButton() } <br></br>
        <Modal size='small' dimmer={dimmer} open={open} onClose={this.close} style={inlineStyle.modal} >
          <Modal.Header> { this.props.editMode ? <div> Edit Group </div> : <div> + Add Group </div> }</Modal.Header>
          <Modal.Content>

          <Card.Group itemsPerRow='1'>
            <Card>
              <Card.Content>

                <Form>
                  <Form.Group>
                    <Form.Input id='name' name='name' label='Group Name (*)' width={8}
                      defaultValue={this.props.name} onChange={this.onChange} error={!!errors.name} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Field width={8} disabled> {errors.name && <InlineError text={errors.name} />} </Form.Field>
                  </Form.Group>

                  <Form.Group>

                    <Form.Field id='status' name='status' label='Status (*)'
                                control={Select}
                                options={statOptions}
                                defaultValue={this.props.status}
                                placeholder='Select Status'
                                onChange={ (e,{value}) => {
                                  console.log("changing status: ", value)
                                    this.setState({ selStatus: value,
                                      data: {status: value} })
                                    } }
                    />
                    <Form.Field width={10} disabled />
                    <Form.Field id='course' name='course' label='Course'
                                control={Select}
                                options={coursesAvail}
                                defaultValue={this.props.course}
                                onChange={ (e,{value}) => {
                                    console.log("changing course: ", value )
                                    this.setState({ data: {course: value} })
                                    } }
                  />
                  </Form.Group>
                  <Form.Group>
                    <Form.Input id='descr' name='descr' control={TextArea}
                                autoHeight label='Description' width={16}
                                defaultValue={this.props.descr} onChange={this.onChange}/>
                  </Form.Group>
                  <Form.Group>
                    <Form.Input id='url' name='url' label='Website' width={16}
                                placeholder='Paste the HTTP address here '
                                defaultValue={this.props.url} onChange={this.onChange} />
                  </Form.Group>
                  <Form.Group>
                    <Form.Input id='git' name='git' label='Git repository'
                                placeholder='Paste the HTTP address here '
                                defaultValue={this.props.git} width={16} onChange={this.onChange} />
                  </Form.Group>
                </Form>
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

export default ModalAddGroup


*/
