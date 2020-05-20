import { shallow } from 'enzyme';
import React from 'react';

import { Account } from './Account';

jest.mock('./utils/api');
import { getAuth } from './utils/api';

describe('Account', () => {
  it('calls getAuth on mount Header & Footer ', async () => {
    await shallow(<Account />);

    expect(getAuth).toBeCalled();
  });
});
