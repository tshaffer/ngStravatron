import axios from 'axios';
import { addActivity } from '../models/activity';
import { serverUrl } from '../index';

const apiUrlFragment = 'api/v1';

export const loadSummaryActivities = (): any => {
  console.log('loadSummaryActivities invoked');
  return (dispatch: any, getState: any): any => {
    console.log('loadSummaryActivities dispatched');
    const path = serverUrl + apiUrlFragment + '/activities';
    axios.get(path)
      .then((response) => {
        const summaryActivities: any[] = response.data as any[];
        console.log(summaryActivities);

        for (const activity of summaryActivities) {
          dispatch(addActivity(activity.id.toString(), activity));
        }
      }).catch((err: Error) => {
        console.log(err);
      });
  };
};
