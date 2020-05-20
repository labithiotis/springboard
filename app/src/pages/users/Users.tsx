import { Container } from '@material-ui/core';
import { User, UserRoles } from '_shared/types/types';
import MaterialTable, { MTableActions } from 'material-table';
import React, { PureComponent } from 'react';
import { generatePath, RouteComponentProps } from 'react-router-dom';

import { Routes } from '../../App';
import { Loader } from '../../components/Loader';
import { Logout } from '../../components/Logout';
import { UserRoleSelector } from '../../components/UserRoleSelector';
import { ValidationError, ValidationErrors } from '../../components/ValidationErrors';
import { createUser, deleteUser, getUsers, updateUser } from '../../utils/api';

type Props = RouteComponentProps<{ accountId: string; userId: string }> & {
  user: User;
};

type State = {
  loading: boolean;
  users: User[];
  validationErrors: ValidationError[];
};

export class Users extends PureComponent<Props, State> {
  state: State = {
    loading: false,
    users: [],
    validationErrors: [],
  };

  async componentDidMount() {
    const { accountId } = this.props.match.params;

    this.setState({ loading: true });
    const res = await getUsers(accountId);
    this.setState({ loading: false, users: res.data });
  }

  mapValidUser(user: User): User {
    return {
      ...user,
      username: user.username || '',
      password: user.password || undefined,
      workingHours: +user.workingHours,
      role: user.role || UserRoles.user,
    };
  }

  createUser = async (user: User) => {
    this.setState({ validationErrors: [] });

    const res = await createUser(this.props.match.params.accountId, this.mapValidUser(user));

    if (res.status !== 200) {
      if (!!res.data.message?.match(/duplicate/i)) {
        this.setState({ validationErrors: [{ stack: 'Username already taken' }] });
      } else {
        this.setState({ validationErrors: res.data.errors || [] });
      }
      return Promise.reject();
    }

    const users = [...(this.state.users || []), { ...res.data, password: '' }];
    this.setState({ users });
  };

  updateUser = async (user: User) => {
    this.setState({ validationErrors: [] });

    const res = await updateUser(this.mapValidUser(user));

    if (res.status !== 200) {
      this.setState({ validationErrors: res.data.errors || [] });
      return Promise.reject();
    }

    const users = this.state.users.map((o) => (o.userId === user.userId ? user : o));
    this.setState({ users });
  };

  deleteUser = async (user: User) => {
    await deleteUser(user);
    const users = this.state.users.filter((o) => o.userId !== user.userId);
    this.setState({ users });
  };

  render() {
    const { user } = this.props;
    const { loading, users, validationErrors } = this.state;

    if (loading || !users) {
      return (
        <>
          {user && <Logout />}
          <Loader />
        </>
      );
    }

    return (
      <Container maxWidth="md">
        {user && <Logout />}
        {!!validationErrors.length && <ValidationErrors errors={validationErrors} />}
        <MaterialTable
          title=""
          columns={[
            {
              title: 'Username',
              field: 'username',
            },
            {
              title: 'Password',
              field: 'password',
              render: () => '*******',
            },
            {
              title: 'Role',
              field: 'role',
              initialEditValue: UserRoles.user,
              editComponent: (props) => <UserRoleSelector value={props.rowData.role} onChange={props.onChange} />,
            },
            {
              title: 'Working Hours',
              field: 'workingHours',
              type: 'numeric',
              initialEditValue: 0,
            },
          ]}
          data={users}
          editable={{
            onRowAdd: this.createUser,
            onRowUpdate: this.updateUser,
            onRowDelete: this.deleteUser,
          }}
          onRowClick={(_event, rowUser?: User) => {
            const allowedToViewUser = rowUser && (user.role !== UserRoles.user || user.userId === rowUser.userId);
            if (rowUser && allowedToViewUser) {
              this.props.history.push(generatePath(Routes.hours, rowUser));
            }
          }}
          options={{
            sorting: true,
            actionsColumnIndex: -1,
          }}
          components={{
            Actions: (props) => {
              if (
                user.role === UserRoles.manager ||
                user.role === UserRoles.admin ||
                user.userId === props.data?.userId
              ) {
                return <MTableActions {...props} />;
              }

              return null;
            },
          }}
        />
        <br/>
        <br/>
      </Container>
    );
  }
}
