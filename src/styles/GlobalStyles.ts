import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @keyframes rainDrop {
    0% {
      transform: translateY(-100vh);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0.3;
    }
  }

  :root {
    --primary-color: #2c3e50;
    --text-color: #333;
    --background-color: #f5f5f5;
    --accent-color: #8b4513;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Serif SC', serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 1rem;
  }

  a {
    color: var(--accent-color);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--primary-color);
    }
  }

  button {
    font-family: 'Noto Serif SC', serif;
    cursor: pointer;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background-color: var(--accent-color);
    color: white;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: var(--primary-color);
    }
  }
`;