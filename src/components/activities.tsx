import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Activities extends React.Component<any> {

  render() {
    return (
      <div>pizza</div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Activities);
