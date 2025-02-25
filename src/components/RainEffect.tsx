import { useEffect } from 'react';
import styled from 'styled-components';

const RainContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const RainDrop = styled.div`
  position: absolute;
  width: 2px;
  height: 10px;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.5));
  animation: rainDrop 1s linear infinite;
`;

const RainEffect = () => {
  useEffect(() => {
    const container = document.querySelector('.rain-container');
    if (!container) return;

    const createRainDrop = () => {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.opacity = `${0.3 + Math.random() * 0.7}`;
      drop.style.animationDuration = `${0.8 + Math.random() * 0.5}s`;
      container.appendChild(drop);

      setTimeout(() => {
        drop.remove();
      }, 2000);
    };

    const rainInterval = setInterval(() => {
      for (let i = 0; i < 10; i++) {
        createRainDrop();
      }
    }, 100);

    return () => {
      clearInterval(rainInterval);
    };
  }, []);

  return (
    <RainContainer className="rain-container">
      <style>
        {`
          .rain-drop {
            position: absolute;
            width: 2px;
            height: 10px;
            background: linear-gradient(transparent, rgba(255, 255, 255, 0.5));
            animation: rainDrop 1s linear infinite;
          }
        `}
      </style>
    </RainContainer>
  );
};

export default RainEffect;