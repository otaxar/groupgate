import React, { Component } from 'react';
import { Card } from "semantic-ui-react";
import Course from './Course';
import ModalAddCourse from './modals/ModalAddCourse';
import Auth from '../lib/Auth';
import axios from 'axios';


const API_URL = `http://localhost:3000/api`
var config =  {
  headers: {  'Content-Type' : `application/json`,
              Authorization: `${ Auth.getToken() }`     }
}

class CourseList extends Component{
  constructor(props){
    super(props)
    this.state ={
      udId: this.props.udId,
      courses: []
    }
    this.add = this.add.bind(this);
    this.delete = this.delete.bind(this);
    this.eachCourse = this.eachCourse.bind(this);
  }

  componentDidMount(){
    if(this.props.udId)
      axios.get(`${API_URL}/userdetails/${this.props.udId}/coursesTaken`, config ) // -- GET COURSES
        .then( response => this.setState({ courses: response.data }) )
        .catch( (error) => console.log('Cannot get courses: ', error.response) );  // DEBUG
  }

  add( data) {
    let payload = { name: data.name, term: data.term, year: data.year,
                userdetailId: this.state.udId }

    axios.post(`${API_URL}/userdetails/${this.props.udId}/coursesTaken`, payload, config )
    .then( response => {} )
    .catch( (error) => console.log('Cannot create: ', error.response) );

    this.setState({ courses: [...this.state.courses, data] });
  }

  delete( id ) {
      //this.props.delete( 'courses', id )
      axios.delete(`${API_URL}/userdetails/${this.props.udId}/coursesTaken/${id}`, config )
        .then( response => console.log("App->deleted: ", response) )                // DEBUG
        .catch( (error) => console.log('Delete error: ', error.response) );
      this.setState(
        prevState => ({ courses: prevState.courses.filter( course => course.id !== id ) })
      )
  }

  eachCourse(course, i) {
    // console.log('CL->each, i: ', i, ' course: ', course )                     //DEBUG
    return (
      <Course key={i}
        index={course.id}
        name={course.name}
        term={course.term}
        year={course.year}
        recordId={course.id}
        edit={this.props.edit}
        delete={this.delete}                                                    // recId in courses table
      />
    )
  }

  // TODO: sort list of courses by term/year in DESC order
  render() {
    const { courses } = this.state
    return(
      <div>
        {this.props.edit ? <ModalAddCourse courses={this.state.courses} add={this.add} />
                         : <div></div>

      }

        <br/>

        <Card.Group itemsPerRow='4'>
          { courses.map(this.eachCourse) }
        </Card.Group>
      </div>
    )
  }
}

export default CourseList;
