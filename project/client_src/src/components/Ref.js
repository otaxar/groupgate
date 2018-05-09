import React, { Component} from 'react';
import { Card, Image } from 'semantic-ui-react';
import ModalDelete from './modals/ModalDelete';
import li_img from '../assets/linkedin.png';
import git_img from '../assets/git3.png';
import stackflow_img from '../assets/stackflow.png';
import hrank_img from '../assets/hrank.png';
import other_img from '../assets/other.png';

class Ref extends Component {
  constructor(props){
    super(props)
    this.selectIcon = this.selectIcon.bind(this)
  }

  selectIcon(){
    switch(this.props.provider) {
      case 'LinkedIn':
        return li_img;
      case 'Git':           return git_img;
      case 'StackOverflow': return stackflow_img;
      case 'HackerRank':    return hrank_img;
      case 'Other':         return other_img;
      default:
    }
  }

  render(){
    return(
      <Card>
        <Card.Content>
          <Image src={this.selectIcon()} size='mini' floated='left'/>
          { this.props.edit ? <ModalDelete  index={this.props.index}
                                size={'tiny'}
                                subject={'reference'}
                                icon={this.selectIcon()}
                                name={this.props.provider} item1={this.props.url}
                                recordId={this.props.recordId} delete={this.props.delete}/>
                            : <div></div>
          }                 
          <Card.Header>
            {this.props.provider}
          </Card.Header>
          <p><a target="_blank" href={'' + this.props.url}>{this.props.url} </a></p>
        </Card.Content>
      </Card>
    )
  }
}
export default Ref;
