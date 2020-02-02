import { isNil } from 'lodash';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createHashHistory } from 'history';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { TablePagination } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import { ActivitiesMap, StravatronSummaryActivity, StravatronActivity } from '../types';
import { getActivities } from '../selectors';
import * as Converters from '../utilities/converters';

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
  id: keyof ActivityData;
  label: string;
  numeric: boolean;
  width: string;
}

const activityColumnCells: HeadCell[] = [
  { id: 'date', numeric: false, label: 'Date', width: '64px' },
  { id: 'name', numeric: false, label: 'Name', width: '192px' },
  { id: 'movingTime', numeric: true, label: 'Riding Time', width: '64px' },
  { id: 'distance', numeric: true, label: 'Distance', width: '64px' },
  { id: 'totalElevationGain', numeric: true, label: 'Elevation', width: '64px' },
  { id: 'kilojoules', numeric: true, label: 'Kilojoules', width: '64px' },
  { id: 'normalizedPower', numeric: true, label: 'NP', width: '64px' },
  { id: 'trainingStressScore', numeric: true, label: 'TSS', width: '64px' },
  { id: 'averageWatts', numeric: true, label: 'Average Watts', width: '64px' },
  { id: 'maxWatts', numeric: true, label: 'Max Watts', width: '64px' },
  { id: 'averageHeartrate', numeric: true, label: 'Average Heartrate', width: '64px' },
  { id: 'maxHeartrate', numeric: true, label: 'Max Heartrate', width: '64px' },
];

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
  const stabilized = array.map((el, index) => [el, index] as [T, number]);
  stabilized.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

function getSorting<K extends keyof any>(
  order: Order,
  orderBy: K,
): (a: { [key in K]: number | string }, b: { [key in K]: number | string }) => number {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

interface ActivitiesTableHeaderProps {
  classes: ReturnType<typeof useStyles>;
  order: Order;
  orderBy: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ActivityData) => void;
}

const ActivitiesTableHeader = (props: ActivitiesTableHeaderProps) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof ActivityData) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {activityColumnCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.width }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead >
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    tableColumnMediumWidth: {
      width: '64px',
    },
    tableColumnWideWidth: {
      width: '192px',
    }
  }),
);

export interface ActivitiesProps {
  activities: ActivitiesMap;
}

const Activities = (props: ActivitiesProps) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof ActivityData>('date');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const getActivityRows = (): any[] => {

    const activities: StravatronSummaryActivity[] = [];

    const activitiesLUT = props.activities;

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
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ActivityData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  if (Object.keys(props.activities).length > 0) {

    const rows = getActivityRows();

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableContainer style={{ maxHeight: 800 }}>
            <Table
              stickyHeader
              size={'small'}
            >
              <ActivitiesTableHeader
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {stableSort(rows, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  // .map((activity: StravatronActivity) => {
                  .map((activity: any) => {
                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={activity.startDateLocal}
                      >
                        <TableCell align='left' className={classes.tableColumnMediumWidth}>{Converters.getDateTime(activity.startDateLocal)}</TableCell>
                        <TableCell align='left' className={classes.tableColumnWideWidth}>{activity.name}</TableCell>
                        <TableCell align='right' className={classes.tableColumnMediumWidth}>{Converters.getMovingTime(activity.movingTime)}</TableCell>
                        <TableCell align='right' className={classes.tableColumnMediumWidth}>{Converters.metersToMiles(activity.distance).toFixed(1)} mi</TableCell>
                        <TableCell align='right' className={classes.tableColumnMediumWidth}>{Converters.metersToFeet(activity.totalElevationGain).toFixed(0)} ft</TableCell>
                        <TableCell align='right' className={classes.tableColumnMediumWidth}>{isNil(activity.kilojoules) ? 0 : activity.kilojoules ? activity.kilojoules.toFixed(0) : ''}</TableCell>
                        <TableCell align='right' className={classes.tableColumnMediumWidth}>{isNil(activity.normalizedPower) ? '' : activity.normalizedPower.toFixed(0)}</TableCell>
                        <TableCell align='right' className={classes.tableColumnMediumWidth}>{isNil(activity.trainingStressScore) ? '' : activity.trainingStressScore.toFixed(0)}</TableCell>
                        <TableCell align='right' className={classes.tableColumnMediumWidth}>{isNil(activity.averageWatts) ? 0 : activity.averageWatts.toFixed(0)}</TableCell>
                        <TableCell align='right' className={classes.tableColumnMediumWidth}>{isNil(activity.maxWatts) ? 0 : activity.maxWatts.toFixed(0)}</TableCell>
                        <TableCell align='right' className={classes.tableColumnMediumWidth}>{isNil(activity.averageHeartrate) ? 0 : activity.averageHeartrate.toFixed(0)}</TableCell>
                        <TableCell align='right' className={classes.tableColumnMediumWidth}>{isNil(activity.maxHeartrate) ? 0 : activity.maxHeartrate}</TableCell>
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
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    );
  }
  return (
    <div>
      Loading...
      </div>
  );
};

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
