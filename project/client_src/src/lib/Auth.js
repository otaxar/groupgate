class Auth {

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  static authenticateUser(token) {
    localStorage.setItem('jwt', JSON.stringify(token))
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return localStorage.getItem('jwt') !== null;
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    localStorage.removeItem('jwt');
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */
  static getToken() {
    let jwt = JSON.parse( localStorage.getItem('jwt') );        // for LB
    if( jwt )
      return jwt.id
    // return localStorage.getItem('jwt');                      // for Rails
  }

  static getUserId() {
    let jwt = JSON.parse( localStorage.getItem('jwt') );        // for LB
    if (jwt )
    return jwt.userId
  }
}

export default Auth;
