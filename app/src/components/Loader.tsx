import { CircularProgress } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

export function Loader() {
  return (
    <Container>
      <CircularProgress />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
