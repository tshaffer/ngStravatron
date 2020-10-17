import { isNil } from 'lodash';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { HashRouter } from 'react-router-dom';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { TablePagination } from '@material-ui/core';

import * as Converters from '../utilities/converters';

import {
  StravatronDetailedSegment,
  StravatronSegmentEffort,
} from '../types';

import { loadSegmentEffortResults } from '../controllers';
import { getSegment, getSegmentEffortResults } from '../selectors';

type Order = 'asc' | 'desc';
interface SegmentEffortData {
  date: string;
  movingTime: number;
  averageHeartrate: number;
  maxHeartrate: number;

}

interface HeadCell {
  id: keyof SegmentEffortData;
  label: string;
  numeric: boolean;
  width: string;
}
const segmentEffortColumnCells: HeadCell[] = [
  { id: 'date', numeric: false, label: 'Date', width: '64px' },
  { id: 'movingTime', numeric: true, label: 'Time', width: '64px' },
  { id: 'averageHeartrate', numeric: true, label: 'Average Heartrate', width: '64px' },
  { id: 'maxHeartrate', numeric: true, label: 'Maximum Heartrate', width: '64px' },
];

function desc<T>(a: T, b: T, orderBy: keyof T) {
  const x = a[orderBy];
  const y = b[orderBy];
  if (isNil(x) && isNil(y)) {
    return 0;
  } else if (isNil(x)) {
    return 1;
  } else if (isNil(y)) {
    return -1;
  }
  if (y < x) {
    return -1;
  }
  if (y > x) {
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

interface SegmentEffortResultsTableHeaderProps {
  classes: ReturnType<typeof useStyles>;
  order: Order;
  orderBy: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof SegmentEffortData) => void;
}

const SegmentEffortResultsTableHeader = (props: SegmentEffortResultsTableHeaderProps) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof SegmentEffortData) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {segmentEffortColumnCells.map((headCell) => (
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
    tableColumnNarrowWidth: {
      width: '32px',
    },
    tableColumnMediumWidth: {
      width: '64px',
    },
    tableColumnWideWidth: {
      width: '192px',
    },
    tableButtonColumnWidth: {
      width: '48px',
    },
    summaryContainer: {
      backgroundColor: 'lightGray',
      paddingBottom: '16px'
    },
    boldParagraph: {
      fontWeight: 'bold',
      marginTop: '4px',
      marginBottom: '4px'
    }
  }),
);


export interface SegmentEffortResultsProps {
  activityId: number;
  segmentId: number;
  segment: StravatronDetailedSegment;
  segmentEffortResults: StravatronSegmentEffort[];
  onLoadSegmentEfforts: (segmentId: number) => any;
}

const SegmentEffortResults = (props: SegmentEffortResultsProps) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof SegmentEffortData>('date');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [initialized, setInitialized] = React.useState(false);

  const { onLoadSegmentEfforts, activityId, segmentId } = props;

  if (!initialized) {
    console.log('invoke onLoadSegmentEfforts');
    onLoadSegmentEfforts(segmentId);
    setInitialized(true);
  }

  console.log('segmentEffortResults');
  console.log(props.segmentEffortResults);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof SegmentEffortData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const buildSegmentEffortRows = (): StravatronSegmentEffort[] => {

    const segmentEfforts: StravatronSegmentEffort[] = props.segmentEffortResults;

    // sort by start_date
    segmentEfforts.sort((a, b) => {

      const asd = new Date(a.startDate).getTime();
      const bsd = new Date(b.startDate).getTime();

      if (asd > bsd) {
        return -1;
      }
      if (asd < bsd) {
        return 1;
      }
      return 0;
    });

    const segmentEffortRows = segmentEfforts.map((segmentEffort) => {
      return segmentEffort;
    });
    return segmentEffortRows;
  };

  const buildSegmentEffortsTable = (): any => {

    // const rows: StravatronSegmentEffort[] = getSegmentEffortRows();
    const rows = buildSegmentEffortRows() as any;

    return (
      <div>
        <TableContainer style={{ maxHeight: 800 }}>
          <Table
            stickyHeader
            size={'small'}
          >
            <SegmentEffortResultsTableHeader
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((segmentEffort: any, index: number) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={segmentEffort.startDateLocal}
                    >
                      <TableCell align='left' className={classes.tableColumnMediumWidth}>{Converters.getDateTime(segmentEffort.startDateLocal)}</TableCell>
                      <TableCell align='right' className={classes.tableColumnMediumWidth}>{Converters.getMovingTime(segmentEffort.movingTime)}</TableCell>
                      <TableCell align='right' className={classes.tableColumnMediumWidth}>{isNil(segmentEffort.averageHeartrate) ? 0 : segmentEffort.averageHeartrate.toFixed(0)}</TableCell>
                      <TableCell align='right' className={classes.tableColumnMediumWidth}>{isNil(segmentEffort.maxHeartrate) ? 0 : segmentEffort.maxHeartrate}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 25]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    );
  };

  const getSummaryContainer = () => {

    const segment: StravatronDetailedSegment = props.segment;

    let averageGrade = '';
    if (segment && segment.averageGrade) {
      averageGrade = segment.averageGrade.toFixed(1) + '%';
    }

    let totalElevationGain = '';
    if (segment && segment.totalElevationGain) {
      totalElevationGain = Converters.metersToFeet(segment.totalElevationGain).toFixed(0) + 'ft';
    }

    return (
      <div className={classes.summaryContainer}>
        <h1>{segment.name}</h1>
        <p className={classes.boldParagraph}>Distance: {Converters.metersToMiles(segment.distance).toFixed(1)} mi</p>
        <p className={classes.boldParagraph}>Average grade: {averageGrade}</p>
        <p className={classes.boldParagraph}>Elevation gain: {totalElevationGain}</p>
      </div >
    );
  };

  if (Object.keys(props.segmentEffortResults).length === 0) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const summaryContainer = getSummaryContainer();
  const segmentEffortsTable = buildSegmentEffortsTable();

  const backRoute = '/detailedActivity/' + activityId.toString();
  return (
    <HashRouter>
      <div className={classes.root}>
        <Link to='/' style={{ marginRight: '12px' }}>Home</Link>
        <Link to={backRoute} style={{ marginRight: '12px' }}>Back</Link>
        <Paper className={classes.paper}>
          {summaryContainer}
          {segmentEffortsTable}
        </Paper>
      </div>
    </HashRouter>
  );
};


function mapStateToProps(state: any, ownProps: any) {

  const _segmentId = parseInt(ownProps.match.params.id, 10);

  return {
    activityId: ownProps.match.params.activityId,
    segmentId: _segmentId,
    segment: getSegment(state, _segmentId),
    segmentEffortResults: getSegmentEffortResults(state, _segmentId),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onLoadSegmentEfforts: loadSegmentEffortResults,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SegmentEffortResults);

