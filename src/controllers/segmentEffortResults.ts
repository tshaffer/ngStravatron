import axios from 'axios';
import { serverUrl } from '../index';

import { addSegmentEffortResults } from '../models';
import {
  StravatronSegmentEffort
} from '../types';

const apiUrlFragment = 'api/v1';

// response.data is an array of StravatronSegmentEffort
export const loadSegmentEffortResults = (segmentId: number): any => {
  return (dispatch: any, getState: any): any => {
    const path = serverUrl + apiUrlFragment + '/allEfforts/' + segmentId.toString();
    console.log('loadDetailedActivity, path = ' + path);
    axios.get(path)
      .then((response) => {
        const segmentEfforts: StravatronSegmentEffort[] = response.data as StravatronSegmentEffort[];
        console.log('segmentEffortResults for segmentId: ', segmentId.toString());
        console.log(segmentEfforts);
        dispatch(addSegmentEffortResults(segmentId, segmentEfforts)); // athleteId
      }).catch((err: Error) => {
        console.log(err);
      });
  };
};
