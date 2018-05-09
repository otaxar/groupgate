const DOMAIN = 'localhost:3000';
const API_PREFIX = '/api/v1';                           // rails: /api/v1    looopback: /api
const BASE_URL = `http://${DOMAIN}${API_PREFIX}`;

function getJWT () {
  return localStorage.getItem('jwt');
}

// HTTP REQUESTS

const User = {
  create (params) {                                     // CREATE USER
      return fetch(
        `${BASE_URL}/users`,                            // LB - Users, Rails - users
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        }
      ).then(res => res.json() );
  },
  all () {                                              // GET ALL USERS
    return fetch(
      `${BASE_URL}/users`,
      {
        headers: {
          'Authorization': getJWT()
        }
      }
    ).then(res => res.json() );
  },
  one (id) {                                           // GET USER
    return fetch(
      `${BASE_URL}/users/${id}`,
      {
        headers: {
          'Authorization': getJWT()
        }
      }
    )
      .then(res => res.json() );
  },
}


const Token = {
  get (params) {                                    // LOGIN (get token)
    return fetch(
      `${BASE_URL}/tokens`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      }
    )
      .then(res => res.json() );
  }
}

const Course = {
  all () {
    return fetch(
      `${BASE_URL}/courses`,
      {
        headers: {
          'Authorization': getJWT()
        }
      }
    )
      .then(res => res.json() );
  },
  one (id) {
    return fetch(
      `${BASE_URL}/courses/${id}`,
      {
        headers: {
          'Authorization': getJWT()
        }
      }
    )
      .then(res => res.json() );
  },
  create (params) {
    return fetch(
      `${BASE_URL}/courses`,
      {
        headers: {
          'Authorization': getJWT(),
          'Content-Type':'application/json'
        },
        method: 'POST',
        body: JSON.stringify(params)
      }
    )
      .then(res => res.json() )
  }
}

export { User, Course, Token };
