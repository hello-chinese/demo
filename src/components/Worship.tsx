import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const WrapperContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(245, 245, 245, 0.9), rgba(245, 245, 245, 0.9)),
              url('/src/assets/temple-bg.jpg') center/cover no-repeat;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--primary-color);
`;

const Paper = styled(motion.div)`
  background: #fff9f0;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Noto Serif SC', serif;
  font-size: 1.1rem;
  line-height: 1.8;
  resize: vertical;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
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

const BurnButton = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  margin-top: 1rem;
`;

// 添加一个新的包装容器组件
const BurningContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const BurningPaper = styled(motion.div)`
  background: #fff9f0;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 2rem;
`;

// 删除这里错误放置的 JSX 代码块
// <AnimatePresence>
//   {isBurning && (
//     <BurningContainer>
//       <BurningPaper
//         initial={{ opacity: 1, scale: 1 }}
//         animate={[
//           { 
//             opacity: 1, 
//             scale: 1.1,
//             filter: 'brightness(1.2)',
//             transition: { duration: 0.5 } 
//           },
//           { 
//             opacity: 0, 
//             scale: 0.6,
//             filter: 'brightness(1.5) blur(3px)',
//             transition: { duration: 2.5 } 
//           }
//         ]}
//         exit={{ opacity: 0, scale: 0, filter: 'blur(5px)' }}
//         style={{
//           background: `linear-gradient(45deg, 
//             rgba(255, 69, 0, 0.9), 
//             rgba(255, 140, 0, 0.9),
//             rgba(255, 69, 0, 0.9))`,
//           boxShadow: '0 0 20px rgba(255, 69, 0, 0.5)',
//           animation: 'flicker 0.5s infinite alternate'
//         }}
//       >
//         <p style={{ color: 'white' }}>{message}</p>
//       </BurningPaper>
//     </BurningContainer>
//   )}
// </AnimatePresence>

const Worship = () => {
  const [message, setMessage] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const navigate = useNavigate();
  const paperRef = useRef<HTMLDivElement>(null);

  const handleBurn = () => {
    if (!message.trim()) return;
    setIsBurning(true);
    // debugger
    const paperRect = paperRef.current?.getBoundingClientRect();
    const centerX = paperRect?.left || 0;
    const centerY = paperRect?.top || 0;
    const width = paperRect?.width || 0;
    const height = paperRect?.height || 0;

    const createSparks = () => {
      const sparkCount = 8; // 增加火星数量
      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        const sparkSize = 1 + Math.random() * 2; // 减小火星尺寸
        const sparkColor = `hsl(${15 + Math.random() * 30}, 100%, ${50 + Math.random() * 20}%)`; // 更暖的火星颜色

        spark.style.cssText = `
          position: fixed;
          width: ${sparkSize}px;
          height: ${sparkSize}px;
          background: ${sparkColor};
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          box-shadow: 0 0 ${sparkSize * 3}px ${sparkColor};
          filter: blur(0.3px);
        `;
        document.body.appendChild(spark);
  
        const startX = centerX + width/2;
        const startY = centerY + height/2;
        const angle = (Math.random() * Math.PI * 2) - Math.PI; // 全方向扩散
        const distance = 50 + Math.random() * 150; // 减少距离
        const duration = 500 + Math.random() * 800; // 缩短动画时间
        
        spark.animate([
          { 
            left: `${startX}px`,
            top: `${startY}px`,
            transform: 'scale(1.2)',
            opacity: 1
          },
          { 
            left: `${startX + Math.cos(angle) * distance}px`,
            top: `${startY + Math.sin(angle) * distance - 80}px`,
            transform: 'scale(0.2)',
            opacity: 0
          }
        ], {
          duration,
          easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        }).onfinish = () => spark.remove();
      }
    };
  
    const createSmoke = () => {
      const smokeCount = 15; // 减少烟雾数量
      for (let i = 0; i < smokeCount; i++) {
        const smoke = document.createElement('div');
        const smokeSize = 10 + Math.random() * 20; // 减小烟雾范围
        const smokeOpacity = 0.1 + Math.random() * 0.2; // 降低透明度

        smoke.style.cssText = `
          position: fixed;
          width: ${smokeSize}px;
          height: ${smokeSize}px;
          background: rgba(80, 80, 80, ${smokeOpacity});
          border-radius: 50%;
          filter: blur(${3 + Math.random() * 4}px);
          pointer-events: none;
          z-index: 9999;
        `;
        document.body.appendChild(smoke);
  
        const startX = centerX + width/2;
        const startY = centerY + height/2;
        const angle = (Math.random() * Math.PI / 3) - Math.PI / 6; // 更窄的角度范围
        const distance = 150 + Math.random() * 100; // 减少上升距离
        const duration = 1500 + Math.random() * 1000; // 缩短动画时长
  
        smoke.animate([
          { 
            left: `${startX}px`,
            top: `${startY}px`,
            transform: 'scale(0.3) rotate(0deg)',
            opacity: smokeOpacity
          },
          { 
            left: `${startX + Math.cos(angle) * distance * 0.3}px`,
            top: `${startY - distance}px`,
            transform: `scale(2) rotate(${Math.random() * 180}deg)`,
            opacity: 0
          }
        ], {
          duration,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => smoke.remove();
      }
    };

    const animationInterval = setInterval(() => {
      createSparks();
      createSmoke();
    }, 80); // 缩短间隔使动画更连贯

    setTimeout(() => {
      clearInterval(animationInterval);
      setIsBurning(false);
      setMessage('');
    }, 2500); // 缩短总动画时长
  };

  return (
    <WrapperContainer>
      <BackButton onClick={() => navigate('/')}>
        返回首页
      </BackButton>
      <Title>祭祖追思</Title>
      <Paper
        ref={paperRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="在此写下您对逝去亲人的思念..."
        />
        <BurnButton onClick={handleBurn} disabled={!message.trim()}>
          点燃祭文
        </BurnButton>
      </Paper>

      <AnimatePresence>
        {isBurning && (
          <BurningContainer>
            <BurningPaper
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: [1, 1, 0],
                scale: [1, 1.1, 0.6],
                filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1.5) blur(3px)'],
                transition: { duration: 2.5 }
              }}
              exit={{ opacity: 0, scale: 0, filter: 'blur(5px)' }}
              style={{
                background: `linear-gradient(45deg, 
                  rgba(255, 69, 0, 0.9), 
                  rgba(255, 140, 0, 0.9),
                  rgba(255, 69, 0, 0.9))`,
                boxShadow: '0 0 20px rgba(255, 69, 0, 0.5)',
                animation: 'flicker 0.5s infinite alternate'
                // 移除 marginTop: '-180px'
              }}
            >
              <p style={{ color: 'white' }}>{message}</p>
            </BurningPaper>
          </BurningContainer>
        )}
      </AnimatePresence>
    </WrapperContainer>
  );
};

export default Worship;