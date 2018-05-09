import React from 'react';
import ReactDOM from 'react-dom';
//import './css/style.scss';
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import App from './containers/App';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
registerServiceWorker();
