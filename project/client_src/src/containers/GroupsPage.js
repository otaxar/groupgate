import React, { Component } from 'react';
import { Divider } from 'semantic-ui-react';
import GroupList from '../components/GroupList';

const HeaderStyle:any = { fontSize: '22px', };

class GroupsPage extends Component {                  // TODO: convert to stateless component
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    //console.log("GP->udId: ", this.props.udId)                                //DEBUG
    //console.log("GP->currName: ", this.props.currName)
    return (
      <main
        className="GroupIndex"
        style={{margin: '0 2rem'}}
        >
          <div style={HeaderStyle}>Groups w/ Admin rights</div>
           <Divider fitted /><br/>
           <GroupList udId={ this.props.udId  }
                      currName={this.props.currName}
                      admin={true}
                      addButton={true}
                      buttons={true}
                      rButtons={true}/>
           <br/>
           <div style={HeaderStyle}>Groups w/ Member rights only</div>
            <Divider fitted /><br/>
            <GroupList udId={ this.props.udId  }
                       currName={this.props.currName}
                       admin={false}
                       buttons={false}
                       rButtons={true}/>
        </main>
      )
  }
}

export default GroupsPage;
