import React from 'react';
import ReactDOM from 'react-dom';
import {SHOPIFY_TOKEN} from './KEYS';

import App from './App';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

window.shopifyToken = SHOPIFY_TOKEN;
