// Import css before everything to make sure it is applied correctly
import React from 'react';
import ReactDOM from 'react-dom';

import { initUserSnap } from 'services/initUsersnap';

import App from './App';

import 'style/themes/ucsf/dist/antd.css';
import 'style/themes/ucsf/main.scss';
import './index.css';

initUserSnap();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
