import _ from 'lodash';
import React, { Component } from 'react';
import { Table, Divider, Icon, Button } from 'semantic-ui-react';
import ModalCancelInvite from '../components/modals/ModalCancelInvite';
import ModalAnswerInvite from '../components/modals/ModalAnswerInvite';
import Auth from '../lib/Auth';
import axios from 'axios';

const HeaderStyle:any = { fontSize: '22px', };

const API_URL = `http://localhost:3000/api`
var config =  {
  headers: {  'Content-Type' : `application/json`,
              Authorization: `${ Auth.getToken() }`     }
}

class InvitationsPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sentInvites: [],
      receivedInvites: [],
    }
    this.cancel = this.cancel.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount () {
    axios.get( `${API_URL}/invites?filter={"where":{"fromUdId":{"like":"${this.props.udId}"}}}`, config )
    .then( (response) => {  /*console.log('Invites, sent, resp data: ', response.data) */               //DEBUG
                            this.setState({ sentInvites: response.data })             })
    .catch( (error) => console.log('get invites sent err: ', error.response) );    // DEBUG

    axios.get( `${API_URL}/invites?filter={"where":{"toUdId":{"like":"${this.props.udId}"}}}`, config )
    .then( (resp) => {  /*console.log('Invites, received, resp data: ', resp.data) */                //DEBUG
                            this.setState({ receivedInvites: resp.data })         })
    .catch( (error) => console.log('Get invites received err: ', error.resp) );    // DEBUG
  }

  update( groupId, toUsername, id, status  ){                                   // id = inviteId, status = invite status
    //console.log("this group id: ", groupId, 'member username:', toUsername )  // DEBUG
    //console.log("updating, invite id: ", id, " status: ", status)             //DEBUG
    let payload = {}

    if(status === 'Accepted') {
      payload = { userdetailId: this.props.udId, groupId: groupId,
                  username: toUsername, role: 'Member', rLock: false           }
      axios.post( `${API_URL}/members`, payload, config )                         // ADD USER TO GROUP
        .then( (resp) => { } )
        .catch( (error) => console.log('Err creating member: ', error.resp) );    // DEBUG
    }

    payload = { status: status }
    axios.patch(`${API_URL}/invites/${id}`, payload, config )                   // UPDATE INVITE STATUS
      .then( (resp) => { /*console.log("invite updated: ", resp.data)*/ } )        //DEBUG
      .catch( (error) => console.log('Err updating invite: ', error.resp) );

    this.setState(prevState => ({
      receivedInvites: prevState.receivedInvites.map(
        receivedInvites => (receivedInvites.id !== id) ? receivedInvites : {...receivedInvites, status: status }
      )
    }))
  }

  cancel ( id ){
    axios.delete(`${API_URL}/invites/${id}`, config )
      .then( response => console.log("Invite deleted: ", response) )            // DEBUG
      .catch( (error) => console.log('Delete error: ', error.response) );

    this.setState(
      prevState => ({ sentInvites: prevState.sentInvites.filter( sentInvite => sentInvite.id !== id ) })
    )

  }

  render () {
    const { loading, sentInvites, receivedInvites} = this.state

    if (loading) {
      return (
        <main
          style={{margin: '0 2rem'}}
        >
          <h2>Invitations Page</h2>
          <h4>Loading...</h4>
        </main>
      )
    }

    return (
      <main style={{margin: '0 2rem'}}>
        <br/>
        <br/><div style={HeaderStyle}>Invitations sent to</div>
         <Divider fitted />

         { sentInvites.length === 0
           ? <div><br/>No invitations sent yet</div>
           : <Table basic>
               <Table.Header>
                 <Table.Row>
                   <Table.HeaderCell width={3}>User</Table.HeaderCell>
                   <Table.HeaderCell width={2}>Course</Table.HeaderCell>
                   <Table.HeaderCell width={3}>Group Name</Table.HeaderCell>
                   <Table.HeaderCell width={2}>Status</Table.HeaderCell>
                   <Table.HeaderCell width={3}>Options</Table.HeaderCell>

                 </Table.Row>
               </Table.Header>
               <Table.Body>
                 {_.map( this.state.sentInvites, ({id,toName,course,groupName,status }) => (

                       <Table.Row key={id}>
                         <Table.Cell><Icon name='user circle'/>{toName}</Table.Cell>
                         <Table.Cell>{course}</Table.Cell>
                         <Table.Cell><Icon name='users' />{groupName}</Table.Cell>
                         <Table.Cell>{status}</Table.Cell>
                          <Table.Cell><ModalCancelInvite id={id}
                                                         status={status}
                                                         toUsername={toName}
                                                         groupName={groupName}
                                                         course={course}
                                                         subject={'Invitation'}
                                                         size={'tiny'}
                                                         cancel={this.cancel}/>
                          </Table.Cell>
                       </Table.Row>))     }
               </Table.Body>
             </Table>
         }

        <br/><br/>
        <div style={HeaderStyle}>Invitations received from</div>
        <Divider fitted />

        { receivedInvites.length === 0
          ?  <div><br/>No invitations received yet</div>
          : <Table basic>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={3}>User</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Course</Table.HeaderCell>
                  <Table.HeaderCell width={3}>Group Name</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Status</Table.HeaderCell>
                  <Table.HeaderCell width={3}>Options</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{_.map(receivedInvites,({ id, fromName, toName, course, groupId, groupName, status })=>(
                  <Table.Row key={id}>
                    <Table.Cell><Icon name='user circle'/>{fromName}</Table.Cell>
                    <Table.Cell>{course}</Table.Cell>
                    <Table.Cell><Icon name='users'/>{groupName}</Table.Cell>
                    <Table.Cell>{status}</Table.Cell>
                    <Table.Cell>
                       <Button.Group size='mini'>
                         <ModalAnswerInvite accept={true} id={id}
                                            fromUsername={fromName}
                                            toUsername={toName}
                                            groupId={groupId}
                                            groupName={groupName} course={course}
                                            status={status}
                                            update={this.update}/>
                         <ModalAnswerInvite accept={false} id={id}
                                            groupId={groupId}
                                            fromUsername={fromName}
                                            groupName={groupName} course={course}
                                            status={status}
                                            update={this.update}/>
                       </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
        }
           <br/><br/>
      </main>
      )
  }
}

export default InvitationsPage;
