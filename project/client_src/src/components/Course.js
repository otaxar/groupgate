import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import ModalDelete from './modals/ModalDelete';
import acad_img from '../assets/academia.png';

const Course = (props) => (

  <Card>
    <Card.Content>
      <Image src={acad_img} size='mini' floated='left'/>

      {props.edit ? <ModalDelete  index={props.index}
                            size={'mini'}
                            subject={'course'}
                            icon={acad_img}
                            name={props.name}
                            label1={'Term: '}
                            item1={props.term} item2={props.year}
                            recordId={props.recordId} delete={props.delete}/>
                       : <div></div>
       }

      <Card.Header>
        {props.name}
      </Card.Header>
        Term: {props.term} {'   '}{props.year}
    </Card.Content>
  </Card>
)

export default Course;


//TODO: Add condition at Modal component, only courses in current term can be deleted
