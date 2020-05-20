import { Typography } from '@material-ui/core';
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

type Props = {};

export class Header extends PureComponent<Props> {
  render() {
    return (
      <Container>
        <Link to="/">
          <Typography variant="h3" align="center">
            Springboard App
          </Typography>
        </Link>
      </Container>
    );
  }
}

const Container = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
`;
