import axios from 'axios';
import { isArray } from 'lodash';

import { addDetailedActivityAttributes, addSegment, addSegmentEffort, addStreams } from '../models';
import {
  StravatronDetailedActivityData, StravatronSegmentEffort
} from '../types';

const serverUrl = 'http://localhost:8000';
const apiUrlFragment = '/api/v1/';

export const loadDetailedActivity = (activityId: number): any => {
  return (dispatch: any, getState: any): any => {
    const path = serverUrl + apiUrlFragment + 'activity/' + activityId.toString();
    axios.get(path)
      .then((response) => {

        const detailedActivityData: StravatronDetailedActivityData = response.data as StravatronDetailedActivityData;

        const { detailedActivityAttributes, segments, allSegmentEffortsForSegmentsInActivity, streams } = detailedActivityData;

        dispatch(addDetailedActivityAttributes(activityId, detailedActivityAttributes));

        if (isArray(segments)) {
          for (const detailedSegment of segments) {
            dispatch(addSegment(detailedSegment.id, detailedSegment));
          }  
        }

        for (const segmentEffortInActivity of allSegmentEffortsForSegmentsInActivity) {
          dispatch(addSegmentEffort(segmentEffortInActivity.id, segmentEffortInActivity));
        }

        dispatch(addStreams(streams));

        console.log('done');
        return;
      }).catch((err: Error) => {
        console.log(err);
      });
  };
};

export const forceReloadEfforts = (activityId: number): any => {
  return (dispatch: any, getState: any): any => {
    const path = serverUrl + apiUrlFragment + 'reloadEfforts/' + activityId.toString();
    axios.get(path)
      .then((response) => {
        const allSegmentEffortsForSegmentsInActivity: StravatronSegmentEffort[] = response.data;
        for (const segmentEffortInActivity of allSegmentEffortsForSegmentsInActivity) {
          dispatch(addSegmentEffort(segmentEffortInActivity.id, segmentEffortInActivity));
        }
        console.log('done');
        return;
      }).catch((err: Error) => {
        console.log(err);
      });
  };
};

export const getMmpData = (activityId: number): any => {
  return (dispatch: any, getState: any): any => {
    const path = serverUrl + apiUrlFragment + 'meanMaximalPowerData/' + activityId.toString();
    axios.get(path)
      .then((response) => {
        console.log('getMmpData - ok');
        return;
      }).catch((err: Error) => {
        console.log(err);
      });
  };
};


