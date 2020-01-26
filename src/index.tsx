import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import { HashRouter, Route, Switch } from 'react-router-dom';

import { rootReducer } from './models';

import App from './components/app';
import Activities from './components/activities';
import DetailedActivity from './components/detailedActivity';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunkMiddleware)
  ));

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route exact path='/' component={App} />
        <Route exact path='/detailedActivity/:id' component={DetailedActivity}/>
        <Route exact path='/activities' component={Activities} />
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('content')
);
