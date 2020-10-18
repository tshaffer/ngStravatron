import axios from 'axios';
import { addActivities } from '../models/activity';
import { serverUrl } from '../index';

const apiUrlFragment = 'api/v1';

export const loadSummaryActivities = (): any => {
  console.log('loadSummaryActivities invoked');
  return (dispatch: any, getState: any): any => {
    console.log('loadSummaryActivities dispatched');
    const path = serverUrl + apiUrlFragment + '/activities';
    console.log('fetch activities');
    axios.get(path)
      .then((response) => {
        const summaryActivities: any[] = response.data as any[];
        console.log(summaryActivities);

        console.log('add activities');
        dispatch(addActivities(summaryActivities));
        console.log('add activities complete');
      }).catch((err: Error) => {
        console.log(err);
      });
  };
};
