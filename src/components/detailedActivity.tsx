import { isNil } from 'lodash';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  loadDetailedActivity, 
  forceReloadEfforts, 
  getMmpData,
} from '../controllers';
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
import moment = require('moment');

export interface DetailedActivityProps {
  params: any;
  detailedActivity: StravatronActivity;
  segmentEfforts: StravatronSegmentEffort[];
  effortsForSegments: StravatronSegmentEffortsBySegment;
  segmentsMap: SegmentsMap;
  onLoadDetailedActivity: (activityId: string) => any;
  onForceReloadEfforts: (activityId: string) => any;
  onGetMmpData: (activityId: string) => any;
}


class DetailedActivity extends React.Component<any> {
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailedActivity);
