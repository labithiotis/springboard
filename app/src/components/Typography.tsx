import styled from 'styled-components';

export const H1 = styled.h1`
  font-size: 40px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.primary};
`;

export const H2 = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

export const Body = styled.p`
  font-size: 16px;
  margin-bottom: 10px;
  color: ${({ color, theme }) => color || theme.black};

  strong {
    color: #000000;
  }
`;

export const Section = styled.div<{ color?: string; backgroundColor?: string; minHeight?: string }>`
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: center;
  background-color: ${({ backgroundColor = 'white' }) => backgroundColor};
  color: ${({ color, theme }) => color || theme.black};
  min-height: ${({ minHeight = '0px' }) => minHeight};
  pointer-events: auto;
`;

export const MainContainer = styled.div`
  position: relative;
  padding: 40px;
  width: 100%;
  max-width: 800px;
  pointer-events: auto;
`;
