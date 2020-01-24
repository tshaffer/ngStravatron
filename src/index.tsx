import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import { HashRouter, Route, Switch, Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import rootReducer from './reducers';

import App from './components/app';
import Activities from './components/activities';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunkMiddleware)
  ));

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
      <Switch>
        <Route path='/activities'>
          <Activities />
        </Route>
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('content')
);
