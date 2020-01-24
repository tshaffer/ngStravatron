import { isNil } from 'lodash';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';


import { ActivitiesMap, StravatronSummaryActivity, StravatronActivity } from '../types';
import { getActivities } from '../selectors';
import * as Converters from '../utilities/converters';

export interface ActivitiesProps {
  activities: ActivitiesMap;
}

class Activities extends React.Component<any> {

  constructor(props: ActivitiesProps) {
    super(props);

    this.handleShowDetailedMap = this.handleShowDetailedMap.bind(this);
  }

  handleShowDetailedMap(activityId: number) {
    console.log('handleShowDetailedMap: ', activityId);
    // hashHistory.push('/detailedActivity/' + activityId.toString());
  }


  buildSummaryActivityRow(activity: StravatronActivity): any {

    const self = this;

    let kilojoules = '';
    if (activity.kilojoules) {
      kilojoules = activity.kilojoules.toFixed(0);
    }

    const normalizedPower = isNil(activity.normalizedPower) ? '' : activity.normalizedPower.toFixed(1);
    const tss = isNil(activity.trainingStressScore) ? '' : activity.trainingStressScore.toFixed(1);
    const averageWatts = isNil(activity.averageWatts) ? 0 : activity.averageWatts;

    return (
      <tr key={activity.id}>
        <td>
          {Converters.getDateTime(activity.startDateLocal)}
        </td>
        <td>
          {activity.name}
        </td>
        <td>
          {Converters.getMovingTime(activity.movingTime)}
        </td>
        <td>
          {Converters.metersToMiles(activity.distance).toFixed(1)} mi
        </td>
        <td>
          {Converters.metersToFeet(activity.totalElevationGain).toFixed(0)} ft
        </td>
        <td>
          {kilojoules}
        </td>
        <td>
          {normalizedPower}
        </td>
        <td>
          {tss}
        </td>
        <td>
          {averageWatts}
        </td>
        <td>
          {activity.maxWatts}
        </td>
        <td>
          {activity.averageHeartrate}
        </td>
        <td>
          {activity.maxHeartrate}
        </td>
        <td>
          <Button onClick={() => self.handleShowDetailedMap(activity.id)}>Show details</Button>
        </td>
      </tr>
    );
  }

  buildSummaryRow(activity: StravatronActivity): any {

    const self = this;

    let kilojoules = '';
    if (activity.kilojoules) {
      kilojoules = activity.kilojoules.toFixed(0);
    }

    const normalizedPower = isNil(activity.normalizedPower) ? '' : activity.normalizedPower.toFixed(1);
    const tss = isNil(activity.trainingStressScore) ? '' : activity.trainingStressScore.toFixed(1);
    const averageWatts = isNil(activity.averageWatts) ? 0 : activity.averageWatts;

    return (
      <TableRow key={activity.id}>
        <TableCell style={{ width: '64px' }}>
          {Converters.getDateTime(activity.startDateLocal)}
        </TableCell>
        <TableCell style={{ width: '192px' }}>
          {activity.name}
        </TableCell>
        <TableCell style={{ width: '64px' }}>
          {Converters.getMovingTime(activity.movingTime)}
        </TableCell>
        <TableCell style={{ width: '64px' }}>
          {Converters.metersToMiles(activity.distance).toFixed(1)} mi
        </TableCell>
        <TableCell style={{ width: '64px' }}>
          {Converters.metersToFeet(activity.totalElevationGain).toFixed(0)} ft
        </TableCell>
        <TableCell style={{ width: '64px' }}>
          {kilojoules}
        </TableCell>
        <TableCell style={{ width: '64px' }}>
          {normalizedPower}
        </TableCell>
        <TableCell style={{ width: '64px' }}>
          {tss}
        </TableCell>
        <TableCell style={{ width: '64px' }}>
          {averageWatts}
        </TableCell>
        <TableCell style={{ width: '64px' }}>
          {activity.maxWatts}
        </TableCell>
        <TableCell style={{ width: '64px' }}>
          {activity.averageHeartrate}
        </TableCell>
        <TableCell style={{ width: '64px' }}>
          {activity.maxHeartrate}
        </TableCell>
        <TableCell style={{ width: '64px' }}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => self.handleShowDetailedMap(activity.id)}
          >
            Show details
          </Button>
          />
        </TableCell>
        <TableCell>
        </TableCell>
      </TableRow>
    );
  }

  buildActivityRows(): any[] {

    const activities: StravatronSummaryActivity[] = [];

    const activitiesLUT = this.props.activities;

    for (const activityId in activitiesLUT) {
      if (activitiesLUT.hasOwnProperty(activityId)) {
        const activity = activitiesLUT[activityId];
        activities.push(activity);
      }
    }

    // sort by start_date
    activities.sort((a, b) => {

      const asd = new Date(a.startDateLocal).getTime();
      const bsd = new Date(b.startDateLocal).getTime();

      if (asd > bsd) {
        return -1;
      }
      if (asd < bsd) {
        return 1;
      }
      return 0;
    });

    const self = this;
    const activityRows = activities.map((activity) => {
      const activityRow = self.buildSummaryRow(activity);
      return activityRow;
    });
    return activityRows;
  }

  render() {
    if (Object.keys(this.props.activities).length > 0) {

      const activityRows = this.buildActivityRows();

      return (
        <div id='SummaryActivities'>
          <br />

          <TableContainer>
            <Table style={{ width: '1597px' }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '64px', whiteSpace: 'normal' }}>Date</TableCell>
                  <TableCell style={{ width: '192px' }}>Name</TableCell>
                  <TableCell style={{ width: '64px', whiteSpace: 'normal' }}>Riding Time</TableCell>
                  <TableCell style={{ width: '64px', whiteSpace: 'normal' }}>Distance</TableCell>
                  <TableCell style={{ width: '64px', whiteSpace: 'normal' }}>Elevation</TableCell>
                  <TableCell style={{ width: '64px', whiteSpace: 'normal' }}>Kilojoules</TableCell>
                  <TableCell style={{ width: '64px', whiteSpace: 'normal' }}>NP</TableCell>
                  <TableCell style={{ width: '64px', whiteSpace: 'normal' }}>TSS</TableCell>
                  <TableCell style={{ width: '64px', whiteSpace: 'normal' }}>Average Watts</TableCell>
                  <TableCell style={{ width: '64px', whiteSpace: 'normal' }}>Max Watts</TableCell>
                  <TableCell style={{ width: '64px', whiteSpace: 'normal' }}>Average Heartrate</TableCell>
                  <TableCell style={{ width: '64px', whiteSpace: 'normal' }}>Max Heartrate</TableCell>
                  <TableCell style={{ width: '64px', whiteSpace: 'normal' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activityRows}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    }
    return (
      <div>
        Loading...
      </div>
    );

    // return (
    //   <div>pizza</div>
    // );
  }
}

function mapStateToProps(state: any) {
  return {
    activities: getActivities(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Activities);
