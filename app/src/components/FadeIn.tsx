import React, { useState } from 'react';
import styled from 'styled-components';

const TIME = 4000;

export function FadeIn() {
  const [visible, setVisible] = useState(true);
  setTimeout(() => setVisible(false), TIME);
  return visible ? <Overlay /> : null;
}

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  opacity: 1;
  background-color: #ffffff;
  animation: fadein ${TIME}ms;
  animation-fill-mode: forwards;
  pointer-events: none;

  @keyframes fadein {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;
