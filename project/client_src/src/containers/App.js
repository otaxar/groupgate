import React from "react";
// import jwtDecode from "jwt-decode";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Helmet from 'react-helmet';

import HomePage from "./HomePage";
import SignInPage from "./SignInPage";
import SignOutPage from "./SignOutPage";
import NotFoundPage from "./NotFoundPage";
import NavBar2 from "../components/NavBar2";
import MyProfilePage from './MyProfilePage';
import OtherUsersPage from './OtherUsersPage';
import GroupsPage from './GroupsPage';
import InvitationsPage from './InvitationsPage';
import AuthRoute from "../components/AuthRoute";
import Auth from '../lib/Auth';
import axios from 'axios';

const API_URL = `http://localhost:3000/api`
var config =  {
  headers: {  'Content-Type' : `application/json`,
              'Authorization': `${ Auth.getToken() }`     }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      m1ActiveItem: '',

      navbarInfo: { email: '',
                    totalRating: 0,
                    numOfVotes: 0,    },
      basicInfo: {  udId: '',                                                   // udId = userdetailId
                    username: '',
                    aboutMe: '',      },
      courses: [],
      refs: [],
      groups: [],
      invitations: [],
      tUser: null,                         // user info from the jwt token (rails)
    };
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  componentDidMount() {
    this.signIn();
  }

  componentWillUnmount(){
    this.signOut();
  }

  //---------------------------------------------------------------------------
  getUserInfo(){
    let userId = Auth.getUserId();
    let tmpEmail = ''
    //console.log("APP->userid: ", userId, " token: ", Auth.getToken() )        //DEBUG
    //console.log("APP->config: ", config)

    // --- GET USER INFO ---
      axios.get( `${API_URL}/userdetails?filter={"where":{"userId":{"like":"${userId}"}}}`, config )
      .then( (response) => {
          //console.log('APP->load userdetails, resp data: ', response.data)      //DEBUG
          tmpEmail = response.data[0].email
          this.setState({
            basicInfo:{
              udId:         response.data[0].id,
              username:     response.data[0].username,
              aboutMe:      response.data[0].aboutMe
            }
          })
          //GET CURRENT USER RATINGS
          axios.get(`${API_URL}/userdetails/${response.data[0].id}/ratings`, config )                           // TODO: move to dedicated API calls file
            .then( response => {
              //console.log('App->get ratings resp: ', response.data, ' length: ', response.data.length )       //DEBUG
              let tAvg = 0
              if(response.data.length > 0){
                for( let i=0; i < response.data.length; i++ ) { tAvg += response.data[i].avg }
                tAvg /= response.data.length
              }

              this.setState({ navbarInfo: {   email:  tmpEmail,
                                              totalRating:  tAvg.toFixed(1),
                                              numOfVotes:   response.data.length } })
            })
            .catch( (error) => console.log('Get ratings error: ', error.response) );
      })
      .catch( (error) => console.log('Get user info err: ', error.response) );    // DEBUG
  }
  // --------------------------------------------------------------------------
  create( endPoint, payload ){
    // console.log("App->create, endpoint: ", endPoint, "payload: ", payload )  //DEBUG

    axios.post(`${API_URL}/${endPoint}`, payload, config )
    .then( response => {} )
    .catch( (error) => console.log('Cannot create: ', error.response) );
  }
  update( endPoint, payload ){
    const { udId } = this.state.basicInfo
    axios.patch( `${API_URL}/${endPoint}/${udId}`, payload, config )
      .then( (response) => { /*console.log( "App, update resp: ", response) */} ) // DEBUG
      .catch( (error) => console.log('get user info err: ', error.response) );
  }
  delete( endPoint, id ){
    axios.delete(`${API_URL}/${endPoint}/${id}`, config )
      .then( response => console.log("App->deleted: ", response) )                // DEBUG
      .catch( (error) => console.log('Delete error: ', error.response) );
  }
  //---------------------------------------------------------------------------
  signIn() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      // const payload = jwtDecode(jwt);
      this.setState({ authenticated: true, /*, tUser: payload, */ });
    }
    this.getUserInfo();
  }
  signOut() {
    localStorage.removeItem("jwt");
    localStorage.setItem( 'selectedMenu2', 'myprofile' )
    this.setState({
      authenticated: false,
      navbarInfo: {},
      user: null,
      tUser: null,
      m1ActiveItem: 'signin'
    });
  }

  //---------------------------------------------------------------------------
  render() {
    //console.log('APP,render, state->basicInfo: ', this.state.basicInfo)       //DEBUG
    // console.log('APP,render, state->navbarInfo: ', this.state.navbarInfo)    //DEBUG

    const { basicInfo } = this.state

    return (
      <Router >
        <div className="ui container">
          <Helmet bodyAttributes={{style: 'background-color : #fff'}}/>

          { this.state.authenticated ? <NavBar2 navbarInfo={this.state.navbarInfo}
                                                activeItem={'myprofile'}
                                                onSignOut={this.signOut}
                                                onMenuClick={this.updateActiveMenuItem}/>
                                     :   <div></div>                                        }
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route
              exact
              path="/sign_in"
              render={props => <SignInPage {...props} onSignIn={this.signIn}/>}
            />
            <AuthRoute
              isAuthenticated={ Auth.isUserAuthenticated() }
              exact path="/myprofile"
              component={ () => <MyProfilePage basicInfo={ basicInfo } /> }
            />
            <AuthRoute
              isAuthenticated={ Auth.isUserAuthenticated() }
              user={this.state.user}
              exact
              path="/groups"
              component={ () => <GroupsPage udId={ basicInfo.udId }
                                            currName={ basicInfo.username }/> }
            />
            <AuthRoute
              isAuthenticated={ Auth.isUserAuthenticated() }
              user={this.state.user}
              exact
              path="/otherusers"
                component={ () => <OtherUsersPage udId={ basicInfo.udId }
                                                  currName= { basicInfo.username} /> }
            />
            <AuthRoute
              isAuthenticated={ Auth.isUserAuthenticated() }
              user={this.state.user}
              exact
              path="/invitations"
              component={ () => <InvitationsPage udId={ basicInfo.udId }
                                                 currName={ basicInfo.username } /> }

            />
            <Route exact path="/sign_out" component={SignOutPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
