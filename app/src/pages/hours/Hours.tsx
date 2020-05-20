import DateFns from '@date-io/date-fns';
import { Button, Container, Grid, Icon } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Hour, User } from '_shared/types/types';
import MaterialTable from 'material-table';
import React, { PureComponent } from 'react';
import { generatePath, Link, RouteComponentProps } from 'react-router-dom';

import { Routes } from '../../App';
import { Logout } from '../../components/Logout';
import { ValidationError, ValidationErrors } from '../../components/ValidationErrors';
import { createHour, deleteHour, getHours, getUser, updateHour } from '../../utils/api';

const dateFns = new DateFns();

type HourRowData = {
  date?: Date;
  hours?: string;
  notes?: string;
};

type Props = RouteComponentProps<{ accountId: string; userId: string }> & {
  user: User;
};

type State = {
  loading: boolean;
  hours: Hour[];
  user?: User;
  validationErrors: ValidationError[];
  fromDate: Date | null;
  toDate: Date | null;
};

export class Hours extends PureComponent<Props, State> {
  state: State = {
    loading: false,
    hours: [],
    user: undefined,
    validationErrors: [],
    fromDate: null,
    toDate: null,
  };

  async componentDidMount() {
    const { accountId, userId } = this.props.match.params;

    this.setState({ loading: true });
    const [resHours, resUser] = await Promise.all([getHours(accountId, userId), getUser(accountId, userId)]);
    this.setState({ loading: false, hours: resHours.data, user: resUser.data });
  }

  async componentDidUpdate(_prevProps: Props, prevState: State) {
    const { accountId, userId } = this.props.match.params;
    const { fromDate, toDate } = this.state;

    if (prevState.fromDate !== fromDate || prevState.toDate !== toDate) {
      this.setState({ loading: true });
      const resHours = await getHours(accountId, userId, { fromDate, toDate });
      this.setState({ loading: false, hours: resHours.data });
    }
  }

  mapValidHour(hour: Hour | HourRowData): Hour {
    return {
      ...hour,
      date: hour.date,
      hours: +(hour.hours || ''),
      notes: hour.notes || '',
    } as Hour;
  }

  createHour = async (data: HourRowData) => {
    const { accountId, userId } = this.props.match.params;
    this.setState({ validationErrors: [] });

    const res = await createHour(accountId, userId, this.mapValidHour(data));

    if (res.status !== 200) {
      this.setState({ validationErrors: res.data.errors || [] });
      return Promise.reject();
    }

    const hours = [...(this.state.hours || []), res.data];
    this.setState({ hours });
  };

  updateHour = async (hour: Hour) => {
    this.setState({ validationErrors: [] });

    const res = await updateHour(this.mapValidHour(hour));

    if (res.status !== 200) {
      this.setState({ validationErrors: res.data.errors || [] });
      return Promise.reject();
    }

    const hours = this.state.hours.map((o) => (o.hourId === hour.hourId ? hour : o));
    this.setState({ hours });
  };

  deleteHour = async (hour: Hour) => {
    await deleteHour(hour);
    const hours = this.state.hours.filter((o) => o.hourId !== hour.hourId);
    this.setState({ hours });
  };

  render() {
    const { loading, hours, user, validationErrors, fromDate, toDate } = this.state;

    return (
      <MuiPickersUtilsProvider utils={DateFns}>
        <Container maxWidth="md">
          {this.props.user && <Logout />}
          {!!validationErrors.length && <ValidationErrors errors={validationErrors} />}
          <Grid container direction="column">
            <Grid container direction="row" alignItems="flex-end" justify="space-between">
              <Grid item>
                <Link to={generatePath(Routes.users, this.props.match.params)}>
                  <Button variant="contained" color="primary" size="small">
                    <Icon>arrow_back_ios</Icon> Back to team
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Grid container direction="row" spacing={2} alignItems="flex-end" justify="flex-end">
                  <Grid item>
                    <DatePicker
                      clearable
                      disableFuture
                      label="From Date"
                      variant="dialog"
                      margin="none"
                      value={fromDate}
                      maxDate={new Date(Date.now() - 1000 * 60 * 60 * 24)}
                      onChange={(fromDate) => this.setState({ fromDate })}
                    />
                  </Grid>
                  <Grid item>
                    <DatePicker
                      clearable
                      disableFuture
                      label="To Date"
                      variant="dialog"
                      margin="none"
                      value={toDate}
                      onChange={(toDate) => this.setState({ toDate })}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <br />
            <MaterialTable
              isLoading={loading}
              title={`Hours for ${user ? user.username : '....'}`}
              columns={[
                {
                  defaultSort: 'asc',
                  title: 'Date',
                  field: 'date',
                  type: 'date',
                  initialEditValue: new Date().toISOString(),
                  render: (rowData) => (rowData.date ? dateFns.format(new Date(rowData.date), 'MMMM do yyyy') : ''),
                },
                {
                  title: 'Hours',
                  field: 'hours',
                  type: 'numeric',
                },
                {
                  title: 'Notes',
                  field: 'notes',
                  sorting: false,
                },
              ]}
              data={hours}
              editable={{
                onRowAdd: this.createHour as any,
                onRowUpdate: this.updateHour,
                onRowDelete: this.deleteHour,
              }}
              options={{
                search: false,
                sorting: true,
                actionsColumnIndex: -1
              }}
            />
          </Grid>
          <br/>
          <br/>
        </Container>
      </MuiPickersUtilsProvider>
    );
  }
}
