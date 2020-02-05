import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { HashRouter } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import { createHashHistory } from 'history';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import { loadSummaryActivities } from '../controllers';

export interface AppProps {
  onShowActivities: () => any;
}

class App extends React.Component<AppProps> {

  constructor(props: any) {

    super(props);

    console.log('pizza69');

    this.handleShowActivities = this.handleShowActivities.bind(this);
  }

  handleShowActivities() {
    // console.log('handleShowActivities');
    // this.props.onShowActivities();
    const hashHistory = createHashHistory();
    hashHistory.push('/activities');
  }

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
          <Button color='primary' component={RouterLink} to='/activities'>
            Button Test
          </Button>
          <Link component={RouterLink} to='/activities'>
            Link Test
          </Link>
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
    onShowActivities: loadSummaryActivities,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
