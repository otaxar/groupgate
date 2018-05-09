
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon } from "semantic-ui-react";

class NavBar2 extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      activeItem: localStorage.getItem( 'selectedMenu2' ) || 'myprofile',
      navbarInfo: this.props.navbarInfo,
    }
    this.handleItemClick = this.handleItemClick.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
  }

  componentWillMount() {
    // console.log('Navbar, onmount, info:', this.state.navbarInfo )            //DEBUG
  }

  componentWillReceiveProps(nextProps){

    if(nextProps.activeItem !== this.props.activeItem){
        this.setState({ activeItem: nextProps.activeItem} );
    }

    if(nextProps.navbarInfo !== this.props.navbarInfo){
        this.setState({ navbarInfo: nextProps.navbarInfo} );
    }
  }

  handleItemClick = (e, { name }) => {
      this.setState({ activeItem: name })
      localStorage.setItem( 'selectedMenu2', name )
  }

  handleSignOut = event => {
    event.preventDefault();
    this.props.onSignOut();
  }

  render(){
    const { activeItem } = this.state
    const { email, totalRating, numOfVotes } = this.state.navbarInfo
    // console.log('Navbar,render, data: ', this.state.navbarInfo )             //DEBUG
    return(

          <Menu pointing secondary color='blue'>
                    <Menu.Item>
                      <h2>GroupGate</h2>
                    </Menu.Item>
                    <Menu.Item position='right' name='otherusers' as={ Link }
                              exact to='otherusers'
                              active={activeItem === 'otherusers'}
                              onClick={this.handleItemClick}>
                        <Icon name='user circle' size='large' /> Other Users
                    </Menu.Item>
                    <Menu.Item as={ Link } name='groups' exact to='groups'
                              active={activeItem === 'groups'}
                              onClick={this.handleItemClick}>
                      <Icon name='users' size='large' /> Groups
                    </Menu.Item>
                    <Menu.Item as={ Link } name='myprofile' exact to='myprofile'
                              active={activeItem === 'myprofile'}
                              user={this.props.user}
                              onClick={this.handleItemClick}>
                      <Icon name='id card outline' size='large' /> My Profile
                    </Menu.Item>
                    <Menu.Item as={ Link } name='invitations'
                              exact to='invitations'
                              active={activeItem === 'invitations'}
                              onClick={this.handleItemClick}>
                      <Icon name='mail outline' size='large' />Invitations
                    </Menu.Item>
                    <Menu.Item>

                    </Menu.Item>

                    <Menu.Menu position='right'>
                      <Menu.Item color='blue'>
                          <Icon name='user' fitted color='blue' /> {email} ( {totalRating} % | {numOfVotes} ratings)
                      </Menu.Item>

                      <Menu.Item name='logout' icon='power' active={activeItem === 'logout'}
                              onClick={this.handleSignOut} />
                    </Menu.Menu>
            </Menu>
    )
  }
}

export default withRouter(NavBar2);
