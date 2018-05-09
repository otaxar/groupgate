import React, { Component } from 'react'
import { Modal, Grid, Button, Card, Image, Icon, Popup, Divider, Statistic  } from 'semantic-ui-react'
import GroupList from '../GroupList';
import CourseList from '../CourseList';
import RefList from '../RefList';
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

const statSize='tiny'

class ModalUserDetails extends Component {
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


  render() {
    const { open, dimmer } = this.state

    return (
      <div>
        <Popup trigger={ <Button size='mini' basic color='blue'
                                 floated='right' onClick={this.show('blurring')} ><Icon name='address book'/>Details</Button> }
               content='View user details' size='tiny'
        />
        <Modal size='large' dimmer={dimmer} open={open} onClose={this.close} style={inlineStyle.modal} >
          <Modal.Header>User Details</Modal.Header>
          <Modal.Content>


          <Card.Group itemsPerRow='1'>
            <Card>
              <Card.Content>

                <Grid>
                  <Grid.Row>
                    <Grid.Column width={16}>
                      <Card fluid>
                        <Card.Content>
                          <Image src={user_img} size='mini' floated='left'/>

                          <Card.Header>
                            { this.props.username } {"  "}
                          </Card.Header>
                          Total Average rating( { this.props.totalRating } % | { this.props.numOfVotes } ratings )
                        </Card.Content>
                        <Card.Content>
                          { this.props.aboutMe }
                        </Card.Content>
                      </Card>
                    </Grid.Column>

                    <Grid.Column width={8}>
                    </Grid.Column>
                  </Grid.Row>
                  </Grid>

                  <br/>
                  <div className='header'><Icon name='bar chart' color='blue'/>Rating category averages</div>
                   <Divider fitted /><br/>
                    <Card.Group itemsPerRow='4'>
                      <Card>
                        <Card.Content>
                          <Card.Header>
                            <Icon name='configure' color='green'/>Skills
                          </Card.Header>
                            <Statistic size={statSize}>
                              <Statistic.Value>{ this.props.skillsAvg } %</Statistic.Value>
                            </Statistic>
                        </Card.Content>
                      </Card>
                      <Card>
                        <Card.Content>
                          <Card.Header>
                            <Icon name='talk outline' color='green'/>Communication
                          </Card.Header>
                          <Statistic size={statSize}>
                            <Statistic.Value>{ this.props.commAvg } %</Statistic.Value>
                          </Statistic>
                        </Card.Content>
                      </Card>
                      <Card>
                        <Card.Content>
                          <Card.Header>
                            <Icon name='clock' color='green'/>Time management
                          </Card.Header>
                          <Statistic size={statSize}>
                            <Statistic.Value>{ this.props.timeAvg } %</Statistic.Value>
                          </Statistic>
                        </Card.Content>
                      </Card>
                      <Card>
                        <Card.Content>
                          <Card.Header>
                            <Icon name='child' color='green'/>Activity
                          </Card.Header>
                          <Statistic size={statSize}>
                            <Statistic.Value>{ this.props.activeAvg } %</Statistic.Value>
                          </Statistic>
                        </Card.Content>
                      </Card>
                    </Card.Group>

                    <br/><br/>
                    <div className='header'><Icon name='users' color='blue'/>Groups</div>
                     <Divider fitted />
                     <GroupList udId={ this.props.udId  }
                                currName={this.props.userame}
                                admin={true}
                                buttons={false}
                                rButtons={false}/>
                     <GroupList udId={ this.props.udId  }
                                currName={this.props.userame}
                                admin={false}
                                buttons={false}
                                rButtons={false}/>

                    <br/><br/>
                    <div className='header'><Icon name='student' color='blue'/>Courses</div>
                     <Divider fitted />
                     <CourseList udId={this.props.udId} edit={false} />

                    <br/><br/>
                    <div className='header'><Icon name='file text outline' color='blue'/>Reference profiles</div>
                     <Divider fitted />
                     <RefList udId={this.props.udId} edit={false} />
                <br/>

              </Card.Content>
            </Card>
          </Card.Group>

          </Modal.Content>
          <Modal.Actions>
            <Button positive icon='checkmark' labelPosition='right' content="Close" onClick={this.close} />
          </Modal.Actions>
        </Modal>

      </div>
    )
  }
}

export default ModalUserDetails
