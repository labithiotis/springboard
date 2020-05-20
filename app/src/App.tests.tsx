import { shallow } from 'enzyme';
import React from 'react';
import App from './App';

import { Footer } from './components/Footer';
import { Header } from './components/Header';

describe('App', () => {
  it('renders Header & Footer ', async () => {
    const component = await shallow(<App />);

    expect(component.find(Header).exists()).toBe(true);
    expect(component.find(Footer).exists()).toBe(true);
  });
});
