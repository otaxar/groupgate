import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Segment  } from "semantic-ui-react";
import Validator from "validator";
import InlineError from "../components/messages/InlineError";
//import { User } from '../lib/requests';     // enable for Rails API
import axios from 'axios';               // enable for Loopback API
import Auth from '../lib/Auth';

class SignUpForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        email: "",
        username: "",
        password: "",
        retypePassword: "",
      },
      loading: false,
      errors: {},
      emailAreadyUsedHidden: true,
      signUpSuccess: false
    }
    this.validate = this.validate.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    // check if user is logged in on refresh
    this.toggleAuthenticateStatus()
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }

  validate = data => {
    const errors = {};
    if (!Validator.isEmail(data.email)) errors.email = "Invalid email";
    if (!data.username) errors.username = "Can't be blank";
    if (!data.password) errors.password = "Can't be blank";
    if ( data.password.length < 3 ) errors.password = "Password must be at least 3 characters";
    if (!data.retypePassword) errors.retypePassword = "Can't be blank";
    if ( data.password !== data.retypePassword) errors.retypePassword = "Passwords do not match";
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
      this.setState({ loading: true });

// OPTION 1: API CALL to LOOPBACK / NODE.JS
//-----------------------------------------------------------------------------
      var header = { 'Content-Type': 'application/json'}

      // ---> CREATE USER
      axios.post( 'http://localhost:3000/api/Users',                            // TODO: Move the call to dedicated file
                  { email: this.state.data.email,
                    password: this.state.data.password,
                    username: this.state.data.username }, header
      ).then( (response) => {

        // --> AUTO-LOGIN
        axios.post( 'http://localhost:3000/api/Users/login',                     // TODO: Move the call to dedicated file
                    { "email": this.state.data.email,
                      "password": this.state.data.password
                    }
        ).then( response => {
            if( response.status === 200 ) {
              var config =  { headers: {  'Content-Type' : `application/json`,
                                          'Authorization': response.data.id } }
              axios.post( 'http://localhost:3000/api/userdetails',              // ---> SET BASIC USER INFO in userdetails
                                   { userId: response.data.userId,
                                     email: this.state.data.email,
                                     username: this.state.data.username,
                                     totalRating: 0.0,
                                     numOfVotes: 0.0 }, config                )
                       .then(  (response) => { /*console.log('SignUp->userdetails created: ', response) */ } )    // DEBUG
                       .catch( (error)    => { console.log('Create userdetails err: ', error.response) } );  // DEBUG
              //this.props.afterSignUp();
            }
          }
        ).catch( (error)=> {
             if (error.response && error.response.status === 401) {
               this.setState({loading: false } /*invalidCredsHidden: false} */ )
               console.log("login failed")
             }
          }
        );

        console.log('SignUp->create user response', response)                           // DEBUG
        // this.setState({loading:false  })
        this.props.afterSignUp()                                                // CALLBACK to push to login page
      })
      .catch( (error) => {
        console.log('Create user error: ', error.response)                      // DEBUG
        if ( error.response && error.response.status === 422 ){
          this.setState({loading: false, emailAreadyUsedHidden: false})
          setTimeout( function() { this.setState({ emailAreadyUsedHidden: true }); }.bind(this), 10000);
          console.log("This email is already used ")                            // DEBUG
        }
      });



// OPTION 2: API CALL to Rails
//-----------------------------------------------------------------------------
/*
      User
        .create({
          first_name: "not_used",
          last_name: "not_used",
          display_name: this.state.data.username,
          email: this.state.data.email,
          is_admin: false,
          about: '',
          password: this.state.data.password,
        })
        .then( data => {
          if (!data.errors) {
            this.setState({ loading: false })
            this.props.afterSignUp()
          } else {
            console.log('Create user error: ', data.errors)                     // DEBUG

            if ( data.errors[0].field === 'email' && data.errors[0].message === 'has already been taken' ) {
              this.setState({ loading: false, errMsgHidden: false, errMsg: 'This e-mail is already taken' })
              setTimeout( function() { this.setState({ errMsgHidden: true }); }.bind(this), 10000);
              // console.log("This email is already used ")                     // DEBUG
            }

            // TODO: Add error handling for duplicate username
          }
        }) // End of User
*/
//-----------------------------------------------------------------------------

      } // end of if (Object)
  };  // end of onSubmit

  render () {
    const { data, errors, loading, emailAreadyUsedHidden  } = this.state;
    return (
        <div className='login-form'>
            <style>{`
              body > div,
              body > div > div,
              body > div > div > div.login-form {
                height: 100%;
              }
            `}</style>
            <Grid
              textAlign='center'
              style={{ height: '100%' }}
              verticalAlign='middle'
            >
              <Grid.Column style={{ maxWidth: 350 }}>
                <Header as='h2' color='teal' textAlign='center'>
                  {' '}Sign up for your account
                </Header>

                <Form className="ui form center" onSubmit={ this.onSubmit } loading={ loading }>
                  <Segment stacked>
                  {<Message negative hidden={ emailAreadyUsedHidden }>
                    <Message.Header>This e-mail is already used.</Message.Header>
                  </Message>}
                  {/*Email Input*/}
                  <Form.Field error={!!errors.email}>
                    <Form.Input
                      type="email"
                      id="loginEmail"
                      name="email"
                      className="login-form-control"
                      fluid
                      icon='mail'
                      iconPosition='left'
                      placeholder="E-mail address"
                      value={data.email}
                      onChange={this.onChange}
                    />
                    {errors.email && <InlineError text={errors.email} />}
                  </Form.Field>
                  {/*Display Name Input*/}
                  <Form.Field error={!!errors.username}>
                    <Form.Input
                      type="text"
                      id="username"
                      name="username"
                      className="login-form-control"
                      icon='user'
                      iconPosition='left'
                      placeholder="Username"
                      value={data.username}
                      onChange={this.onChange}
                    />
                    {errors.username && <InlineError text={errors.username} />}
                  </Form.Field>
                  {/*Password Input*/}
                  <Form.Field error={!!errors.password}>

                    <Form.Input
                      type="password"
                      id="password"
                      name="password"
                      className="login-form-control"
                      icon='lock'
                      iconPosition='left'
                      placeholder="Password"
                      value={data.password}
                      onChange={this.onChange}
                    />
                    {errors.password && <InlineError text={errors.password} />}
                  </Form.Field>
                  {/*Validate Password Input*/}
                  <Form.Field error={!!errors.retypePassword}>
                    <Form.Input
                      type="password"
                      id="retypePassword"
                      name="retypePassword"
                      className="login-form-control"
                      icon='lock'
                      iconPosition='left'
                      placeholder="Re-type Password"
                      value={data.retypePassword}
                      onChange={this.onChange}
                    />
                    {errors.retypePassword && <InlineError text={errors.retypePassword} />}
                  </Form.Field>
                  <Button color='teal' fluid size='large'>Create Account</Button>
                </Segment>
                </Form>
                <Message>
                  Already have an account? <Link to='/sign_in'>Sign In</Link>
                </Message>
              </Grid.Column>
            </Grid>
          </div>
    )
  }
}

export default SignUpForm;
