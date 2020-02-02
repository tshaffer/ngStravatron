import { isNil } from 'lodash';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createHashHistory } from 'history';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Button from '@material-ui/core/Button';

import { ActivitiesMap, StravatronSummaryActivity, StravatronActivity } from '../types';
import { getActivities } from '../selectors';
import * as Converters from '../utilities/converters';

function getSorting<K extends keyof any>(
  order: Order,
  orderBy: K,
): (a: { [key in K]: number | string }, b: { [key in K]: number | string }) => number {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

type Order = 'asc' | 'desc';
interface ActivityData {
  date: string;
  name: string;
  ridingTime: number;
  distance: number;
  elevation: number;
  kilojoules: number;
  np: number;
  tss: number;
  averageWatts: number;
  maxWatts: number;
  averageHeartrate: number;
  maxHeartrate: number;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof ActivityData;
  label: string;
  numeric: boolean;
}

function desc<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort<T>(array: T[], cmp: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const activityColumnCells: HeadCell[] = [
  { id: 'date', numeric: false, disablePadding: true, label: 'Date' },
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'ridingTime', numeric: true, disablePadding: false, label: 'Riding Time' },
  { id: 'distance', numeric: true, disablePadding: false, label: 'Distance' },
  { id: 'elevation', numeric: true, disablePadding: false, label: 'Elevation' },
  { id: 'kilojoules', numeric: true, disablePadding: false, label: 'Kilojoules' },
  { id: 'np', numeric: true, disablePadding: false, label: 'NP' },
  { id: 'tss', numeric: true, disablePadding: false, label: 'TSS' },
  { id: 'averageWatts', numeric: true, disablePadding: false, label: 'Average Watts' },
  { id: 'maxWatts', numeric: true, disablePadding: false, label: 'Max Watts' },
  { id: 'averageHeartrate', numeric: true, disablePadding: false, label: 'Average Heartrate' },
  { id: 'maxHeartrate', numeric: true, disablePadding: false, label: 'Max Heartrate' },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ActivityData) => void;
  order: Order;
  orderBy: string;
}

class EnhancedTableHead extends React.Component<EnhancedTableProps> {

  createSortHandler = (property: keyof ActivityData) => (event: React.MouseEvent<unknown>) => {
    this.props.onRequestSort(event, property);
  }

  render() {

    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {activityColumnCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={this.createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

export interface ActivitiesProps {
  activities: ActivitiesMap;
}

export interface ActivitiesComponentProps {
  order: Order;
  orderBy: keyof ActivityData;
}

// tslint:disable-next-line: max-classes-per-file
class Activities extends React.Component<ActivitiesProps, ActivitiesComponentProps> {

  constructor(props: ActivitiesProps) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'date',
    };

    this.handleShowDetailedMap = this.handleShowDetailedMap.bind(this);
    this.handleRequestSort = this.handleRequestSort.bind(this);
  }

  handleShowDetailedMap(activityId: number) {
    console.log('handleShowDetailedActivity: ', activityId);
    const hashHistory = createHashHistory();
    hashHistory.push('/detailedActivity/' + activityId.toString());
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

  getActivityRows(): any[] {

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

    const activityRows = activities.map((activity) => {
      return activity;
    });
    return activityRows;
  }

  handleRequestSort(event: React.MouseEvent<unknown>, property: keyof ActivityData) {
    const orderBy = this.state.orderBy;
    const order = this.state.order;
    const isAsc = orderBy === property && order === 'asc';
    this.setState({
      order: isAsc ? 'desc' : 'asc'
    });
    this.setState({
      orderBy: property
    });
  }

  render() {

    if (Object.keys(this.props.activities).length > 0) {

      const rows = this.getActivityRows();

      const order = this.state.order;
      const orderBy = this.state.orderBy;

      return (
        <div>
          <TableContainer>
            <Table
              size={'small'}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
                {stableSort(rows, getSorting(order, orderBy))
                  .slice(0, 0 + 42)
                  .map((activity: StravatronActivity, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={activity.startDateLocal}
                      >
                        <TableCell component='th' scope='row' padding='none'>
                          {Converters.getDateTime(activity.startDateLocal)}
                        </TableCell>
                        <TableCell align='left'>{activity.name}</TableCell>
                        <TableCell align='right'>{Converters.getMovingTime(activity.movingTime)}</TableCell>
                        <TableCell align='right'>{Converters.metersToMiles(activity.distance).toFixed(1)} mi</TableCell>
                        <TableCell align='right'>{Converters.metersToFeet(activity.totalElevationGain).toFixed(0)} ft</TableCell>
                        <TableCell align='right'>{isNil(activity.maxWatts) ? 0 : activity.kilojoules ? activity.kilojoules.toFixed(0) : ''}</TableCell>
                        <TableCell align='right'>{isNil(activity.normalizedPower) ? '' : activity.normalizedPower.toFixed(0)}</TableCell>
                        <TableCell align='right'>{isNil(activity.trainingStressScore) ? '' : activity.trainingStressScore.toFixed(0)}</TableCell>
                        <TableCell align='right'>{isNil(activity.averageWatts) ? 0 : activity.averageWatts.toFixed(0)}</TableCell>
                        <TableCell align='right'>{isNil(activity.maxWatts) ? 0 : activity.maxWatts.toFixed(0)}</TableCell>
                        <TableCell align='right'>{isNil(activity.maxWatts) ? 0 : activity.averageHeartrate.toFixed(0)}</TableCell>
                        <TableCell align='right'>{isNil(activity.maxWatts) ? 0 : activity.maxHeartrate}</TableCell>
                      </TableRow>
                    );
                  })}
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
