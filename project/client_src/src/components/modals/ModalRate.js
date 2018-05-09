import React, { Component } from 'react'
import { Modal, Table, Button, Dropdown, Card, Image, Icon  } from 'semantic-ui-react'
//import InlineError from "../messages/InlineError";
import team_img from '../../assets/team.png';

// Correction of the default Modal formatting bug
const inlineStyle = {
  modal : {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
};

const options = [
  { key: '10', text: '100', value: '100' },
  { key: '9', text: '90', value: '90' },
  { key: '8', text: '80', value: '80' },
  { key: '7', text: '70', value: '70' },
  { key: '6', text: '60', value: '60' },
  { key: '5', text: '50', value: '50' },
  { key: '4', text: '40', value: '40' },
  { key: '3', text: '30', value: '30' },
  { key: '2', text: '20', value: '20' },
  { key: '1', text: '10', value: '10' },
  { key: '0', text: '0', value: '0' },
]

class ModalRate extends Component {
  constructor(props){
    super(props)
    this.state = {
      ratings: this.props.ratings,
      saveDisabled: true,
      openConfModal: false,
      open: false,
    }
    this.eachMember = this.eachMember.bind(this);
  }

  componentWillReceiveProps( nextProps ){
    if ( nextProps.ratings !== this.props.ratings ) {
      this.setState({ ratings: nextProps.ratings })
    }
    //console.log('CL->componentWillReceiveProps executed: ', this.state.courses)     // DEBUG
  }

  show = dimmer => () => { this.setState({ dimmer, open: true }) }
  close = () => { // console.log('MR->close, ratings L: ', this.state.ratings)
                  this.props.resetOKs( this.state.ratings )
                  this.setState({ ratings: [],
                                  //saveDisabled: true,
                                  openConfModal: false,
                                  open: false,
                               })
  }

  handleSkillsChange = (idx) => (evt, {value}) => {
    const newRatings = this.state.ratings.map((rating, sidx) => {
      if (idx !== sidx) return rating;
      return { ...rating, skills: value*1 };
    });
    console.log("MR->handle, length: ", this.state.ratings.length )             //DEBUG
    this.setState( {ratings: newRatings },
                   () => this.props.valSkills(this.state.ratings, this.state.ratings.length) );
  }

  handleCommChange = (idx) => (evt, {value}) => {
    const newRatings = this.state.ratings.map((rating, sidx) => {
      if (idx !== sidx) return rating;
      return { ...rating, comm: value*1 };
    });
    this.setState({ ratings: newRatings },
                    () => this.props.valComm(this.state.ratings) );
  }

  handleTimeChange = (idx) => (evt, {value}) => {
    const newRatings = this.state.ratings.map((rating, sidx) => {
      if (idx !== sidx) return rating;
      return { ...rating, time: value*1 };
    });
    this.setState({ ratings: newRatings },
                    () => this.props.valTime(this.state.ratings) );
  }

  handleActiveChange = (idx) => (evt, {value}) => {
    const newRatings = this.state.ratings.map((rating, sidx) => {
      if (idx !== sidx) return rating;
      return { ...rating, active: value*1 };
    });
    this.setState({ ratings: newRatings },
                          () => this.props.valActive(this.state.ratings) );
  }

  onSubmit = () => {
      console.log("State on submit: ", this.state );                            //DEBUG
      this.setState( { open: false, openConfModal: true })
      this.props.rate( this.state.ratings );
  }

  eachMember( member, i){
    // console.log("eachrating: ", i, 'udId: ', member.udId )
    //console.log("each, state, r: ", this.state.ratings)
    return (
      <Table.Row key={i}>
        <Table.Cell><Icon name='user circle'/>{member.username}</Table.Cell>
        <Table.Cell><Dropdown fluid placeholder='0-100%'
                         options={options}
                         selection
                         value={this.state.ratings.skills}
                         onChange={this.handleSkillsChange(i)} /></Table.Cell>
        <Table.Cell><Dropdown  fluid placeholder='0 - 100 %'
                         options={options}
                         selection
                         value={this.state.ratings.comm}
                         onChange={this.handleCommChange(i)} /></Table.Cell>
        <Table.Cell><Dropdown  fluid placeholder='0-100%'
                         options={options}
                         selection
                         value={this.state.ratings.time}
                         onChange={this.handleTimeChange(i)} /></Table.Cell>
        <Table.Cell><Dropdown  fluid placeholder='0-100%'
                         options={options}
                         selection
                         value={this.state.ratings.active}
                         onChange={this.handleActiveChange(i)} /></Table.Cell>
      </Table.Row>
    )
  }

  render() {
    const { open, dimmer } = this.state
    const { skillsOK, commOK, timeOK, activeOK } = this.props
    // console.log("MRate: st->ratings: ", this.state)                          //DEBUG
    return (
      <div>
        <Button icon='bar chart' label='Rate Members' size='mini' basic
                                 floated='right' onClick={this.show('blurring')} />

        <Modal dimmer={dimmer} open={open} onClose={this.close} style={inlineStyle.modal} >
          <Modal.Header>Rate the members of group:</Modal.Header>
          <Modal.Content>

          <Card.Group itemsPerRow='1'>
            <Card>
              <Card.Content>

                <Card>
                  <Card.Content>
                      <Image src={team_img} size='mini' floated='left'/>
                    <Card.Header>
                      {this.props.groupName}
                    </Card.Header>
                      {this.props.course}
                  </Card.Content>
                </Card>

                <Table basic>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell width={2}>User</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Skills</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Communication</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Time management</Table.HeaderCell>
                      <Table.HeaderCell width={2}>Activity</Table.HeaderCell>

                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { this.props.ratings.map(this.eachMember) }
                  </Table.Body>
                </Table>

              </Card.Content>
            </Card>
          </Card.Group>

          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.close}>
              Cancel
            </Button>
            <Button disabled={!(skillsOK && commOK && timeOK && activeOK)}
                    positive icon='checkmark' labelPosition='right'
                    content="Submit" onClick={this.onSubmit} />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default ModalRate
