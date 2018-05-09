import Auth from '../lib/Auth';
import axios from 'axios';

const API_URL = `http://localhost:3000/api`
var config =  {
  headers: {  'Content-Type' : `application/json`,
              Authorization: `JWT ${ Auth.getToken() }`     }
}


const Api = {


  create( endPoint, payload ){
    // console.log("App->create, endpoint: ", endPoint, "payload: ", payload )   //DEBUG

  axios.post(`${API_URL}/${endPoint}`, payload, config )
    .then( response => {} )
    .catch( (error) => console.log('Cannot create: ', error.response) );
  }

  update( endPoint, payload ){
    const { udId } = this.state.basicInfo
    axios.patch( `${API_URL}/${endPoint}/${udId}`, payload, config )
      .then( (response) => { /*console.log( "App, update resp: ", response) */} ) // DEBUG
      .catch( (error) => console.log('Err while getting: ', error.response) );
  }

  delete( endPoint, id ){
    axios.delete(`${API_URL}/${endPoint}/${id}`, config )
      .then( response => console.log("App->deleted: ", response) )                // DEBUG
      .catch( (error) => console.log('Delete error: ', error.response) );
  }




}
