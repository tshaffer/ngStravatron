import axios from 'axios';

const serverUrl = 'http://localhost:8000';
const apiUrlFragment = '/api/v1/';

export const loadSummaryActivities = (): any => {
  console.log('loadSummaryActivities invoked');
  return (dispatch: any, getState: any): any => {
    console.log('loadSummaryActivities dispatched');
    const path = serverUrl + apiUrlFragment + '/activities';
    axios.get(path)
      .then((response) => {
        const summaryActivities: any[] = response.data as any[];
        console.log(summaryActivities);

        // for (const activity of summaryActivities) {
        //   dispatch(addActivity(activity.id.toString(), activity));
        // }
      }).catch((err: Error) => {
        console.log(err);
      });
  };
};
