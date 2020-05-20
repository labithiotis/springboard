import { Icon, Tooltip } from '@material-ui/core';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { logout } from '../utils/api';

type Props = {};

export class Logout extends PureComponent<Props> {
  logout = async () => {
    await logout();
    location.pathname = '/';
  };

  render() {
    return (
      <Tooltip title="Log out">
        <Container onClick={this.logout}>
          <Icon color="secondary">exit_to_app</Icon>
        </Container>
      </Tooltip>
    );
  }
}

const Container = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 5px;
  cursor: pointer;
`;
