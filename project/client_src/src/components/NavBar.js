
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu } from "semantic-ui-react";

class NavBar extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      activeItem: localStorage.getItem( 'selectedMenu' ) || '',
      user: null,
      otherGroups: null,
      otherusers: null
    }
    this.handleItemClick = this.handleItemClick.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
  }


  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
    localStorage.setItem( 'selectedMenu', name )
  }

  handleSignOut = event => {
    event.preventDefault();
    this.setState({
      activeItem: 'myprofile'
    })
    this.props.onSignOut();
  }

  render(){
    const { activeItem } = this.state
    return(
          <Menu pointing secondary >

            <Menu.Item as={ Link } name='home' exact to=''
                      active={activeItem === 'home'} onClick={this.handleItemClick}>
              <h2>GroupGate</h2>
            </Menu.Item>
            <Menu.Item position='right' as={ Link } name='signin' exact to='sign_in'
                      active={activeItem === 'signin'} onClick={this.handleItemClick}>
              Sign In
            </Menu.Item>
            <Menu.Item as={ Link } name='signup' exact to='sign_up'
                      active={activeItem === 'signup'} onClick={this.handleItemClick}>
              Sign Up
            </Menu.Item>
          </Menu>
    )
  }
}

export default withRouter(NavBar);

/*

import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar (props) {

  const { user, onSignOut = () => {} } = props;

  const handleSignOut = event => {
    event.preventDefault();
    onSignOut();
  }

  return (

    <nav className="NavBar">

      {
        user ? (
            <nav>
              <NavLink exact to="/otherusers">OtherUsers</NavLink>
              <NavLink exact to="/groups">Groups</NavLink>
              <NavLink exact to="/myprofile">My Profile</NavLink>
              <NavLink exact to="/invitations">Invitations</NavLink>

              <span key="1">Hello, {user.full_name}</span>
              <a key="2" href="/sign_out" onClick={handleSignOut}>Sign Out</a>
            </nav>
        ) : (
          <NavLink exact to="/sign_in">Sign In</NavLink>
        )
      }
    </nav>

  )

}

export default NavBar;
*/
