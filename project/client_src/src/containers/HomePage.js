import React, { Component } from 'react';
import { Menu } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.afterSignUp = this.afterSignUp.bind(this)
  }

  afterSignUp = () => {
    this.props.history.push( '/sign_in' )
  }

  render () {
    return (
      <main
        className="HomePage"
        style={{margin: '0 1rem'}}
      >
        <Menu pointing secondary >
          <Menu.Item>
            <h2>GroupGate</h2>
          </Menu.Item>
          <Menu.Item position='right' as={ Link } name='signin' exact to='sign_in'>
            Sign In
          </Menu.Item>
        </Menu>
        <h2 className="text-center notBold">Starting new class or personal group project? </h2>
        <h2 className="text-center notBold">Find the right people. Fast.</h2><br/>
        <h5 className="text-center notBold">Create Group. Find People. Finish Project. Provide Feedback.</h5><br/><br/>
        <SignUpForm afterSignUp={ this.afterSignUp } />
      </main>
    )
  }
}

export default HomePage;
