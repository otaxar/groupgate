import React, { Component } from 'react'

import { Menu } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import Auth from '../lib/Auth';

class SignInPage extends Component {
  constructor(props) {
    super(props)
    this.onSignIn = this.onSignIn.bind(this)
  }

  onSignIn = () => {
      this.props.onSignIn();
      this.props.history.push('/myprofile')
  }

  render () {

    return (
      <main
        className="HomePage"
        style={{margin: '0 1rem'}}
      >

      { Auth.isUserAuthenticated() ? <div>{ this.onSignIn() }</div>
                                  :
                                  <div>
                                    <Menu pointing secondary >
                                      <Menu.Item>
                                        <h2>GroupGate</h2>
                                      </Menu.Item>
                                      <Menu.Item position='right' as={ Link } name='signup' exact to=''>
                                        Sign Up
                                      </Menu.Item>
                                    </Menu>
                                    <br/><br/>

                                    <LoginForm onSignIn={this.onSignIn}/>                                    
                                  </div>




      }


      </main>
    )
  }
}

export default SignInPage;
