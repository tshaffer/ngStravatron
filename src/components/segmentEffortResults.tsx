import { isNil } from 'lodash';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import * as Converters from '../utilities/converters';

import {
  SegmentsMap,
  StravatronDetailedSegment,
  StravatronSegmentEffortsBySegment,
  StravatronSegmentEffort,
  StravatronActivity,
} from '../types';

import {
  getStravatronDetailedActivityAttributes,
  getSegmentEffortsForActivity,
  getSegments,
  getEffortsForActivitySegments
} from '../selectors/detailedActivity';

export interface SegmentEffortResultsProps {
  activityId: number;
  effortsForSegments: StravatronSegmentEffortsBySegment;
  segmentEffortId: number;
  segmentEfforts: StravatronSegmentEffort[];
}

const SegmentEffortResults = (props: SegmentEffortResultsProps) => {

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
  console.log(getEffortsForActivitySegments(state, parseInt(ownProps.match.params.id, 10)));

  return {
    activityId: parseInt(ownProps.match.params.id, 10),
    effortsForSegments: getEffortsForActivitySegments(state, parseInt(ownProps.match.params.id, 10)),

    // segmentEffortId: parseInt(ownProps.match.params.id, 10),
    // segmentEfforts: getEffortsForSegment(state, parseInt(ownProps.match.params.id, 10)),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    // onLoadSegmentEffortResults: loadSegmentEffortResults,
    // onForceReloadEfforts: forceReloadEfforts,
    // onGetMmpData: getMmpData,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SegmentEffortResults);

