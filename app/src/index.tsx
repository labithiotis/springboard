import { ThemeProvider } from '@material-ui/core/styles';
import 'preact/debug';
import React from 'react';
import ReactDOM from 'react-dom';
import 'reset-css';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import App from './App';
import { materialTheme, theme } from './theme';

ReactDOM.render(
  <StyledThemeProvider theme={theme}>
    <ThemeProvider theme={materialTheme}>
      <App />
    </ThemeProvider>
  </StyledThemeProvider>,
  document.getElementById('root')
);
