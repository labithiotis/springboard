import {
  Button,
  CircularProgress,
  FormControl,
  FormGroup,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { PureComponent, SyntheticEvent } from 'react';
import { generatePath, Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { Routes } from '../../App';
import { login } from '../../utils/api';

type Props = RouteComponentProps & {};

type State = {
  loading: boolean;
  errorMessage?: string;
  errors: {
    username: boolean;
    password: boolean;
  };
  username: string;
  password: string;
};

export class Login extends PureComponent<Props> {
  state: State = {
    loading: false,
    errors: {
      username: false,
      password: false,
    },
    username: '',
    password: '',
  };

  login = async (e: SyntheticEvent) => {
    e.preventDefault();

    const { username, password } = this.state;
    const errors = {
      username: !username,
      password: !password,
    };
    this.setState({ errors });

    if (!errors.username && !errors.password) {
      this.setState({ loading: true, errorMessage: undefined });
      const res = await login({ username, password });
      this.setState({ loading: false });
      if (res.status === 200) {
        this.props.history.push(generatePath(Routes.users, res.data));
      } else {
        this.setState({ errorMessage: res.data.message || 'Unable to log in right now.' });
      }
    }
  };

  render() {
    const { errors, errorMessage, username, password, loading } = this.state;

    return (
      <StyledGrid container direction="column" justify="center" alignItems="center">
        <Typography variant="h4">Login</Typography>
        <br />
        <form onSubmit={this.login}>
          <FormControl required error={errors.username || errors.password || !!errorMessage} component="fieldset">
            <FormGroup>
              <TextField
                required
                id="username"
                label="Username"
                variant="outlined"
                value={username}
                error={errors.username}
                onChange={(e) => this.setState({ username: e.target.value })}
              />
              <TextField
                required
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
              />
              {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
              <Button id="submit" variant="contained" type="submit" disabled={loading} color="primary">
                {loading ? <CircularProgress /> : 'Login'}
              </Button>
            </FormGroup>
          </FormControl>
        </form>
        <Link to={Routes.register} style={{ textDecoration: 'none' }}>
          <Button variant="text">Create Account</Button>
        </Link>
      </StyledGrid>
    );
  }
}

const StyledGrid = styled(Grid)`
  margin-top: 50px;

  .MuiFormControl-root {
    margin-bottom: 10px;
  }
`;
