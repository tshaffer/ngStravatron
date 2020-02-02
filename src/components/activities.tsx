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
import { TablePagination } from '@material-ui/core';

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
  movingTime: number;
  distance: number;
  totalElevationGain: number;
  kilojoules: number;
  normalizedPower: number;
  trainingStressScore: number;
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
  { id: 'movingTime', numeric: true, disablePadding: false, label: 'Riding Time' },
  { id: 'distance', numeric: true, disablePadding: false, label: 'Distance' },
  { id: 'totalElevationGain', numeric: true, disablePadding: false, label: 'Elevation' },
  { id: 'kilojoules', numeric: true, disablePadding: false, label: 'Kilojoules' },
  { id: 'normalizedPower', numeric: true, disablePadding: false, label: 'NP' },
  { id: 'trainingStressScore', numeric: true, disablePadding: false, label: 'TSS' },
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
  page: number;
  rowsPerPage: number;
}

// tslint:disable-next-line: max-classes-per-file
class Activities extends React.Component<ActivitiesProps, ActivitiesComponentProps> {

  constructor(props: ActivitiesProps) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'date',
      page: 0,
      rowsPerPage: 5,
    };

    this.handleRequestSort = this.handleRequestSort.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
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

  handleChangePage(event: unknown, newPage: number) {
    this.setState({ page: newPage });
  }

  handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState( { rowsPerPage: (parseInt(event.target.value, 10)) });
    this.setState( { page: 0 });
  }

  render() {

    if (Object.keys(this.props.activities).length > 0) {

      const rows = this.getActivityRows();

      const order = this.state.order;
      const orderBy = this.state.orderBy;

      return (
        <div>
          <TableContainer style={{ maxHeight: 800 }}>
            <Table 
              stickyHeader
              size={'small'}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
                {stableSort(rows, getSorting(order, orderBy))
                .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                .map((activity: StravatronActivity, index) => {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={activity.startDateLocal}
                      >
                        <TableCell align='left'>{Converters.getDateTime(activity.startDateLocal)}</TableCell>
                        <TableCell align='left'>{activity.name}</TableCell>
                        <TableCell align='right'>{Converters.getMovingTime(activity.movingTime)}</TableCell>
                        <TableCell align='right'>{Converters.metersToMiles(activity.distance).toFixed(1)} mi</TableCell>
                        <TableCell align='right'>{Converters.metersToFeet(activity.totalElevationGain).toFixed(0)} ft</TableCell>
                        <TableCell align='right'>{isNil(activity.kilojoules) ? 0 : activity.kilojoules ? activity.kilojoules.toFixed(0) : ''}</TableCell>
                        <TableCell align='right'>{isNil(activity.normalizedPower) ? '' : activity.normalizedPower.toFixed(0)}</TableCell>
                        <TableCell align='right'>{isNil(activity.trainingStressScore) ? '' : activity.trainingStressScore.toFixed(0)}</TableCell>
                        <TableCell align='right'>{isNil(activity.averageWatts) ? 0 : activity.averageWatts.toFixed(0)}</TableCell>
                        <TableCell align='right'>{isNil(activity.maxWatts) ? 0 : activity.maxWatts.toFixed(0)}</TableCell>
                        <TableCell align='right'>{isNil(activity.averageHeartrate) ? 0 : activity.averageHeartrate.toFixed(0)}</TableCell>
                        <TableCell align='right'>{isNil(activity.maxHeartrate) ? 0 : activity.maxHeartrate}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={rows.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
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
