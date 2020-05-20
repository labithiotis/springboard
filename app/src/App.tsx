import React, { PureComponent } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { Account } from './Account';
import { FadeIn } from './components/FadeIn';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Login } from './pages/login/Login';
import { Register } from './pages/login/Register';

export enum Routes {
  login = '/login',
  register = '/register',
  users = '/account/:accountId/users',
  hours = '/account/:accountId/users/:userId/hours',
  default = '/',
  report = '/account/accountId/users/:userId/hours/report'
}

export default class App extends PureComponent {
  render() {
    return (
      <BrowserRouter>
        <FadeIn />
        <Page>
          <Header />
          <Body>
            <Switch>
              <Route exact path={Routes.login} render={(props) => <Login {...props} />} />
              <Route exact path={Routes.register} render={(props) => <Register {...props} />} />
              <Account />
            </Switch>
          </Body>
          <Footer />
        </Page>
      </BrowserRouter>
    );
  }
}

const Page = styled.div`
  display: flex;
  flex-direction: column;

  a {
    text-decoration: none !important;
    color: inherit;
  }
`;

const Body = styled.div`
  flex: 1;
  min-height: 400px;
`;
