import { isNil } from 'lodash';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  StravatronSegmentEffort,
} from '../types';

import { loadSegmentEffortResults } from '../controllers';
import { getSegmentEffortResults } from '../selectors';

export interface SegmentEffortResultsProps {
  segmentId: number;
  segmentEffortResults: StravatronSegmentEffort[];
  onLoadSegmentEfforts: (segmentId: number) => any;
}

const SegmentEffortResults = (props: SegmentEffortResultsProps) => {

  const { onLoadSegmentEfforts, segmentId } = props;

  const [initialized, setInitialized] = React.useState(false);

  if (!initialized) {
    console.log('invoke onLoadSegmentEfforts');
    onLoadSegmentEfforts(segmentId);
    setInitialized(true);
  }

  console.log('segmentEffortResults');
  console.log(props.segmentEffortResults);

  return (
    <div>
      Flibbet
    </div >
  );

};

function mapStateToProps(state: any, ownProps: any) {

  console.log('segmentEffortResults');
  console.log(state);
  console.log(ownProps);

  const segmentId = parseInt(ownProps.match.params.id, 10);
  return {
    segmentId,
    segmentEffortResults: getSegmentEffortResults(state, segmentId),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onLoadSegmentEfforts: loadSegmentEffortResults,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SegmentEffortResults);

