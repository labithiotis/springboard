import color from 'color';
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { Section } from './Typography';

export class Footer extends PureComponent {
  render() {
    return (
      <Section>
        <Contents>
          <div>
            <strong>Built by</strong> Darren Labithiotis
          </div>
          <div>
            2009-{new Date().toISOString().substr(0, 4)} ©{' '}
            <a href="mailto:darren@labithiotis.co.uk">labithiotis.co.uk</a>
          </div>
        </Contents>
      </Section>
    );
  }
}

const Contents = styled.div`
  text-align: center;
  padding: 60px 0;
  color: ${({ theme }) => theme.subtle};

  strong {
    font-weight: 500;
    color: ${({ theme }) => color(theme.subtle).darken(0.2).hex()};
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.subtle};

    :hover {
      color: ${({ theme }) => color(theme.subtle).darken(0.2).hex()};
    }
  }
`;
