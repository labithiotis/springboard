import { Button, CircularProgress, FormControl, FormGroup, Grid, TextField, Typography } from '@material-ui/core';
import React, { PureComponent, SyntheticEvent } from 'react';
import { generatePath, Link, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { Routes } from '../../App';
import { ValidationError, ValidationErrors } from '../../components/ValidationErrors';
import { register } from '../../utils/api';

type Props = RouteComponentProps & {};

type State = {
  loading: boolean;
  inputErrors: {
    username: boolean;
    password: boolean;
  };
  validationErrors: ValidationError[];
  username: string;
  password1: string;
  password2: string;
};

export class Register extends PureComponent<Props, State> {
  state: State = {
    loading: false,
    inputErrors: {
      username: false,
      password: false,
    },
    validationErrors: [],
    username: '',
    password1: '',
    password2: '',
  };

  createAccount = async (e: SyntheticEvent) => {
    e.preventDefault();

    const { username, password1, password2 } = this.state;
    const errors = {
      username: !username,
      password: !password1 || password1 !== password2,
    };
    this.setState({ inputErrors: errors });

    if (!errors.username && !errors.password) {
      this.setState({ loading: true, validationErrors: [] });
      const res = await register({ username, password: password1 });
      this.setState({ loading: false });
      if (res.status === 200) {
        this.props.history.push(generatePath(Routes.users, res.data));
      } else {
        this.setState({ validationErrors: res.data.errors });
      }
    }
  };

  render() {
    const { inputErrors, validationErrors, username, password1, password2, loading } = this.state;

    return (
      <StyledGrid container direction="column" justify="center" alignItems="center">
        {!!validationErrors.length && <ValidationErrors errors={validationErrors} />}
        <Typography variant="h4">Create Account</Typography>
        <br />
        <form onSubmit={this.createAccount}>
          <FormControl
            required
            error={inputErrors.username || inputErrors.password || !!validationErrors.length}
            component="fieldset"
          >
            <FormGroup>
              <TextField
                required
                id="username"
                label="Username"
                variant="outlined"
                value={username}
                error={inputErrors.username}
                onChange={(e) => this.setState({ username: e.target.value })}
              />
              <TextField
                required
                id="password1"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                value={password1}
                onChange={(e) => this.setState({ password1: e.target.value })}
              />
              <TextField
                required
                id="password2"
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={password2}
                error={inputErrors.password}
                onChange={(e) => this.setState({ password2: e.target.value })}
              />
              <Button id="submit" variant="contained" type="submit" disabled={loading} color="primary">
                {loading ? <CircularProgress /> : 'Create'}
              </Button>
            </FormGroup>
          </FormControl>
        </form>
        <Link to={Routes.login} style={{ textDecoration: 'none' }}>
          <Button variant="text">Login with existing</Button>
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
