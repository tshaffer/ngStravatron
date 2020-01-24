// import * as React from "react";
// import TodoContainer from "../containers/TodoContainer";

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

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Button from '@material-ui/core/Button';

class App extends React.Component</*AppProps*/any> {

  constructor(props: any) {

    super(props);

    console.log('pizza69');

    this.handleShowActivities = this.handleShowActivities.bind(this);
  }

  handleShowActivities() {
    console.log('handleShowActivities');
    // this.props.onShowActivities();
    // hashHistory.push('/activities');
  }

  /*
        <Button
          variant="contained" color="primary"
          onClick={this.handleShowActivities}
        />
  */

  render() {
    return (
      <div>
        <h2>StravaTed</h2>
        Eat more pizza and burgers!
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleShowActivities}
        >
          Show athlete activities
        </Button>
      </div>
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
