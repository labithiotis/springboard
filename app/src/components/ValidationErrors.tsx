import { Snackbar, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React, { PureComponent } from 'react';

export type ValidationError = {
  stack: string;
  message?: string;
  schema?: { title?: string };
};

type Props = {
  errors: ValidationError[];
};

type State = {
  open: boolean;
};

export class ValidationErrors extends PureComponent<Props, State> {
  state = {
    open: false,
  };

  componentDidMount() {
    this.setState({ open: !!this.props.errors.length });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.errors.length !== prevProps.errors.length) {
      this.setState({ open: !!this.props.errors.length });
    }
  }

  getErrorMessage(error: ValidationError) {
    const property = error.schema?.title;
    return property ? `${property} ${error.message}` : error.stack;
  }

  render() {
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={this.state.open}
        autoHideDuration={30000}
        onClose={() => this.setState({ open: false })}
      >
        <Alert severity="error" onClose={() => this.setState({ open: false })}>
          <Typography variant="subtitle2">Whoops. We've encountered the following errors</Typography>
          {this.props.errors.map((error) => (
            <div>{this.getErrorMessage(error)}</div>
          ))}
        </Alert>
      </Snackbar>
    );
  }
}
