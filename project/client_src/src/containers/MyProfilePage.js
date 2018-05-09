import React from 'react';
import { Divider, Card, Image } from 'semantic-ui-react';
import ModalBasicInfo from '../components/modals/ModalBasicInfo';
import CourseList from '../components/CourseList';
import RefList from '../components/RefList';
import user_img from '../assets/user.png';
import Auth from '../lib/Auth';
import axios from 'axios';

const HeaderStyle:any = { fontSize: '22px', };

const API_URL = `http://localhost:3000/api`
var config =  { headers: { 'Content-Type' : `application/json`,
                            Authorization: `${ Auth.getToken() }`     }     }
var payload = ''

// This page holds the informatiomn about user:
//   - display name
//   - about me
//   - list of courses (with group project) that the student is taking/taken
//   - list of references (e.g. Linkedin, Git, etc.)
class MyProfilePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      basicInfo: this.props.basicInfo
    }
    //this.getBasicInfo = this.getBasicInfo.bind(this);
    this.updateBasicInfo = this.updateBasicInfo.bind(this);
  }

  componentDidMount(){
    //console.log("MP->CDM, bInfo: ", this.props.basicInfo)
    //this.getBasicInfo();
  }

  componentWillReceiveProps( nextProps ){
    if ( nextProps.basicInfo !== this.props.basicInfo ) {
      this.setState({ basicInfo: nextProps.basicInfo })
    }
  }
/*
  getBasicInfo() {
    if( Auth.isUserAuthenticated() ){
      let userId = Auth.getUserId();
      axios.get( `${API_URL}/userdetails?filter={"where":{"userId":{"like":"${userId}"}}}`, config )
        .then( (response) => {
          //console.log('APP->load userdetails, resp data: ', response.data)      //DEBUG
          this.setState({
            basicInfo:{
              udId:         response.data[0].id,                                  // works also as userdetailId
              username:     response.data[0].username,
              aboutMe:      response.data[0].aboutMe
            }
          })
      })
      .catch( (error) => console.log('Get user info err: ', error.response) );
    }
  }
*/
  updateBasicInfo( data ){
        payload = { username: data.username,                                        // TODO - generalize
                    aboutMe: data.aboutMe      };
        axios.patch( `${API_URL}/userdetails/${this.props.basicInfo.udId}`, payload, config )
            .then( (response) => { /*console.log( "App, update resp: ", response) */} ) // DEBUG
            .catch( (error) => console.log('get user info err: ', error.response) );

        this.setState({ basicInfo: data })

  }

  render () {
    const { basicInfo } = this.state;
    //TODO: Format aboutMe to wrap, so it does not leave the grid
    return (
      <main
        style={{margin: '0 2rem'}}
        >
        <br />
          <div style={HeaderStyle}>Basic Info</div>
          <Card fluid>
            <Card.Content>
              <Image src={user_img} size='mini' floated='left'/>
              <ModalBasicInfo basicInfo={ basicInfo }
                              onSave={ this.updateBasicInfo }  />
              <Card.Header>
                <h1>{ basicInfo.username }</h1>
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <span> <b>About Me:</b> { basicInfo.aboutMe } </span>
            </Card.Content>
          </Card>

          <div style={HeaderStyle}>My Courses (with group projects)</div>
           <Divider fitted />
           <br/>
           <CourseList udId={this.props.basicInfo.udId} edit={true}/>
           <br/>
           <div style={HeaderStyle}>Reference profiles</div>
            <Divider fitted /> <br />
            <RefList udId={this.props.basicInfo.udId}  edit={true}/>
        </main>
      )
  }
}
export default MyProfilePage;
