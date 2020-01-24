// import * as React from 'react';
// import TodoContainer from '../containers/TodoContainer';

// export const App: React.FC<{}> = () => {
//   return (
//     <>
//       <h1>React Redux Typescript</h1>
//       <TodoContainer />
//     </>
//   );
// };

// export interface AppProps {
//   onShowActivities: () => any;
// }

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { HashRouter, Route, Switch, Link } from 'react-router-dom';
import { createHashHistory } from 'history';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Button from '@material-ui/core/Button';

import Activities from './activities';

class App extends React.Component</*AppProps*/any> {

  constructor(props: any) {

    super(props);

    console.log('pizza69');

    this.handleShowActivities = this.handleShowActivities.bind(this);
  }

  handleShowActivities() {
    console.log('handleShowActivities');
    // this.props.onShowActivities();
    const hashHistory = createHashHistory();
    hashHistory.push('/activities');
  }

  /*
        <Switch>
          <Route path='/activities'>
            <Activities />
          </Route>
        </Switch>
        <Link to='/activities'>Show Activities</Link>
  */

  render() {
    return (
      <HashRouter>
        <div>
          <h2>StravaTed</h2>
          Eat more pizza and burgers!
          <br />
          <br />
          <Button
            variant='contained'
            color='primary'
            onClick={this.handleShowActivities}
          >
            Show athlete activities
          </Button>
        </div>
      </HashRouter>
    );
  }
}

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    // onShowActivities: loadSummaryActivities,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
