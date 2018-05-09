import React from "react";
import { Button, Form, Grid, Header, Message, Segment } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import Validator from "validator";
import InlineError from "./messages/InlineError";
import axios from 'axios';                                  // enable if LOOPBACK to be used
//import { Token } from '../lib/requests';                  // Enable if Rails API to be used
import Auth from '../lib/Auth';

 class LoginForm extends React.Component {
   state = {
     data: {
       email: "",
       password: ""
     },
     invalidCredsHidden: true,
     loading: false,
     errors: {}
   };

   onChange = e =>
     this.setState({
       data: { ...this.state.data, [e.target.name]: e.target.value }
     });

   onSubmit = ( event ) => {
     event.preventDefault();
     const errors = this.validate( this.state.data );
     this.setState({ errors });

     if ( Object.keys( errors ).length === 0 ) {

       // OPTION 1: API CALL to LOOPBACK / NODE.JS
       axios.post( 'http://localhost:3000/api/Users/login',                     // TODO: Move the call to dedicated file
                   { "email": this.state.data.email,
                     "password": this.state.data.password
                   }
       ).then( response => {
           if( response.status === 200 ) {
             Auth.authenticateUser( response.data )                             // set JWT Token
             this.props.onSignIn();                                             // callback to SignInPage
           }
         }
       ).catch( (error)=> {
            if (error.response && error.response.status === 401) {
              this.setState({loading: false, invalidCredsHidden: false})
              setTimeout( function() {
                this.setState({ invalidCredsHidden: true}); }.bind(this), 10000 );
            }
         }
       );

       // OPTION 2: API CALL TO RAILS API
/*
       Token
         .get({
           email: this.state.data.email,
           password: this.state.data.password
         })
         .then( data => {
           if (!data.errors) {
             Auth.authenticateUser( data.jwt )
             this.props.onSignIn()
           } else if (data.message === 'Invalid email or password!!') {
               this.setState({ loading: false, errMsgHidden: false, errMsg: 'Invalid email or password' })
               setTimeout( function() { this.setState({ errMsgHidden: true }); }.bind(this), 10000);
               // console.log("This email is already used ")                     // DEBUG
           }
         })
  */
       }
   };

   validate = data => {
     const errors = {};
     if (!Validator.isEmail(data.email)) errors.email = "Invalid email";
     if (!data.password) errors.password = "Can't be blank";
     return errors;
   };

   render() {
       const { data, errors, loading, invalidCredsHidden } = this.state;

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
                   {' '}Sign into your account
                 </Header>
                 <Form className="ui form center" onSubmit={this.onSubmit} loading={loading}>
                   <Segment stacked>
                     {<Message className = "center" compact negative hidden={ invalidCredsHidden}>
                        <Message.Header>Invalid Email or Password</Message.Header>
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
                   <Button color='teal' fluid size='large'>Sign In</Button>
                 </Segment>
                 </Form>
                 <Message>
                   Don`t have an account yet? <Link to='/'>Sign Up</Link>
                 </Message>
               </Grid.Column>
             </Grid>
           </div>
       );
     }
   }

   export default LoginForm;
