import { User } from '_shared/types/types';
import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Routes } from './App';
import { getAuth } from './utils/api';
import { Loader } from './components/Loader';
import { Home } from './pages/home/Home';
import { Hours } from './pages/hours/Hours';
import { Users } from './pages/users/Users';

type Props = {};

type State = {
  loading: boolean;
  user?: User;
};

export class Account extends PureComponent<Props, State> {
  state: State = {
    loading: false,
    user: undefined,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const res = await getAuth();
    this.setState({ loading: false, user: res.status === 200 ? res.data : null });
  }

  render() {
    const { loading, user } = this.state;

    if (loading || user === undefined) {
      return <Loader />;
    }

    return (
      <Switch>
        <Route exact path={Routes.hours} render={(props) => <Hours {...props} user={user} />} />
        <Route exact path={Routes.users} render={(props) => <Users {...props} user={user} />} />
        <Route path={Routes.default} render={(props) => <Home {...props} user={user} />} />
      </Switch>
    );
  }
}
