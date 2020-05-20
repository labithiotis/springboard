import { Button, Grid } from '@material-ui/core';
import { User } from '_shared/types/types';
import React, { PureComponent } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

type Props = RouteComponentProps & {
  user: User;
};

export class Home extends PureComponent<Props> {
  render() {
    const { user } = this.props;

    return (
      <Container>
        <Grid>
          {user ? (
            <Link to={`/account/${user.accountId}/users`}>
              <Button variant="contained" color="primary">
                Goto Account
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="contained" color="primary">
                Login
              </Button>
            </Link>
          )}
        </Grid>
      </Container>
    );
  }
}

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
