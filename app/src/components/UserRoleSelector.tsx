import { FormControl, MenuItem, Select } from '@material-ui/core';
import { UserRoles } from '_shared/types/types';
import React, { PureComponent } from 'react';

type Props = {
  value: UserRoles;
  onChange: (role: UserRoles) => void;
};

export class UserRoleSelector extends PureComponent<Props> {
  render() {
    return (
      <FormControl>
        <Select
          id="role"
          label="Role"
          value={this.props.value}
          onChange={(e) => this.props.onChange(e.target.value as UserRoles)}
        >
          {Object.values(UserRoles).map((role) => (
            <MenuItem value={role}>{role}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}
