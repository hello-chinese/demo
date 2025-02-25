import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WrapperContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(rgba(245, 245, 245, 0.9), rgba(245, 245, 245, 0.9)),
              url('/src/assets/kite-bg.jpg') center/cover no-repeat;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--primary-color);
`;

const GameCanvas = styled.canvas`
  border: 2px solid var(--accent-color);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  max-width: 100%;
`;

const Score = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--accent-color);
`;

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
`;

const Instructions = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  max-width: 600px;
  line-height: 1.4;
  color: var(--text-color);
  font-size: 0.9rem;
`;

const DirectionControls = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  width: 120px;

  button {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.9);
    border: 2px solid var(--accent-color);
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--accent-color);
      color: white;
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;

const ArrowButton = styled(Button)`
  padding: 0.5rem;
  min-width: 40px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--accent-color);
    transform: translateY(-2px);
  }
`;

const Kite = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [windSpeed, setWindSpeed] = useState(0);
  const kiteRef = useRef({
    x: 0,
    y: 0,
    angle: 0,
    speed: 2,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const kite = kiteRef.current;
    kite.x = canvas.width / 2;
    kite.y = canvas.height / 2;

    const drawKite = () => {
      if (!ctx) return;
      ctx.save();
      ctx.translate(kite.x, kite.y);
      ctx.rotate(kite.angle);

      // 绘制风筝主体
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.lineTo(20, 0);
      ctx.lineTo(0, 20);
      ctx.lineTo(-20, 0);
      ctx.closePath();
      ctx.fillStyle = '#ff6b6b';
      ctx.fill();
      ctx.strokeStyle = '#c92a2a';
      ctx.stroke();

      // 绘制风筝尾巴
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(-10, 40);
      ctx.lineTo(10, 40);
      ctx.closePath();
      ctx.fillStyle = '#4dabf7';
      ctx.fill();

      ctx.restore();
    };

    const updateKite = () => {
      // 更新风筝位置
      kite.x += Math.cos(kite.angle) * kite.speed + windSpeed;
      kite.y += Math.sin(kite.angle) * kite.speed;

      // 边界检查
      if (kite.x < 0) kite.x = canvas.width;
      if (kite.x > canvas.width) kite.x = 0;
      if (kite.y < 0) kite.y = canvas.height;
      if (kite.y > canvas.height) kite.y = 0;

      // 随机更新风速
      if (Math.random() < 0.02) {
        setWindSpeed(Math.random() * 4 - 2);
      }

      // 增加分数
      setScore(prev => prev + 1);
    };

    const gameLoop = () => {
      if (!gameStarted) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawKite();
      updateKite();
      requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      switch (e.key) {
        case 'ArrowLeft':
          kite.angle -= 0.1;
          break;
        case 'ArrowRight':
          kite.angle += 0.1;
          break;
        case 'ArrowUp':
          kite.speed = Math.min(kite.speed + 0.5, 5);
          break;
        case 'ArrowDown':
          kite.speed = Math.max(kite.speed - 0.5, 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    if (gameStarted) {
      gameLoop();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
  };

  const stopGame = () => {
    setGameStarted(false);
  };

  const handleDirectionClick = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (!gameStarted) return;
    const kite = kiteRef.current;

    switch (direction) {
      case 'left':
        kite.angle -= 0.1;
        break;
      case 'right':
        kite.angle += 0.1;
        break;
      case 'up':
        kite.speed = Math.min(kite.speed + 0.5, 5);
        break;
      case 'down':
        kite.speed = Math.max(kite.speed - 0.5, 1);
        break;
    }
  };

  return (
    <WrapperContainer>
      <BackButton onClick={() => navigate('/')}>
        返回首页
      </BackButton>
      <Title>放飞风筝</Title>
      <Instructions>
        使用键盘方向键或下方按钮控制风筝：
        ↑ 加速，↓ 减速，← 向左转，→ 向右转。
        注意随机的风向变化，尽可能长时间地保持风筝在空中飞行！
      </Instructions>
      <Score>得分: {score}</Score>
      <GameCanvas ref={canvasRef} />
      <DirectionControls>
        <div />
        <ArrowButton onClick={() => handleDirectionClick('up')}>↑</ArrowButton>
        <div />
        <ArrowButton onClick={() => handleDirectionClick('left')}>←</ArrowButton>
        <ArrowButton onClick={() => handleDirectionClick('down')}>↓</ArrowButton>
        <ArrowButton onClick={() => handleDirectionClick('right')}>→</ArrowButton>
      </DirectionControls>
      <Controls>
        <Button onClick={startGame} disabled={gameStarted}>
          开始游戏
        </Button>
        <Button onClick={stopGame} disabled={!gameStarted}>
          结束游戏
        </Button>
      </Controls>
    </WrapperContainer>
  );
};

export default Kite;