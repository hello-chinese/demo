import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WrapperContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(rgba(245, 245, 245, 0.9), rgba(245, 245, 245, 0.9)),
              url('/src/assets/poetry-bg.jpg') center/cover no-repeat;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--primary-color);
`;

const GameContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PoemCard = styled(motion.button)<{ isSelected?: boolean; isMatched?: boolean }>`
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.isMatched ? '#e8f5e9' : props.isSelected ? '#fff8e1' : 'white'};
  border: 2px solid ${props => props.isMatched ? '#81c784' : props.isSelected ? '#ffecb3' : '#ddd'};
  cursor: ${props => props.isMatched ? 'default' : 'pointer'};
  font-size: 1.1rem;
  text-align: center;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: ${props => props.isMatched ? '#2e7d32' : props.isSelected ? '#f57f17' : 'var(--primary-color)'};

  &:hover {
    transform: ${props => props.isMatched ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.isMatched ? 'none' : '0 2px 8px rgba(0,0,0,0.1)'};
    background-color: ${props => props.isMatched ? '#e8f5e9' : props.isSelected ? '#fff8e1' : '#f5f5f5'};
  }
`;

const Score = styled.div`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: var(--accent-color);
`;

const ResetButton = styled.button`
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
`;

interface PoemPair {
  first: string;
  second: string;
}

const poemPairs: PoemPair[] = [
  { first: '清明时节雨纷纷', second: '路上行人欲断魂' },
  { first: '借问酒家何处有', second: '牧童遥指杏花村' },
  { first: '人间四月芳菲尽', second: '山寺桃花始盛开' },
  { first: '细雨湿衣看不见', second: '闲花落地听无声' },
  { first: '梨花风起正清明', second: '游子寻春半出城' },
];

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 1rem;
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

const Poetry = () => {
  const navigate = useNavigate();
  const [firstHalf, setFirstHalf] = useState<string[]>([]);
  const [secondHalf, setSecondHalf] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const initializeGame = () => {
    setFirstHalf(shuffleArray(poemPairs.map(pair => pair.first)));
    setSecondHalf(shuffleArray(poemPairs.map(pair => pair.second)));
    setSelected(null);
    setMatched(new Set());
    setScore(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleClick = (verse: string) => {
    if (matched.has(verse)) return;

    if (!selected) {
      setSelected(verse);
      return;
    }

    const currentPair = poemPairs.find(pair =>
      (pair.first === selected && pair.second === verse) ||
      (pair.second === selected && pair.first === verse)
    );

    if (currentPair) {
      setMatched(prev => new Set([...prev, currentPair.first, currentPair.second]));
      setScore(prev => prev + 1);
      
      // 播放匹配成功的动画
      const matchedElements = document.querySelectorAll(`button:contains(${verse}), button:contains(${selected})`);
      matchedElements.forEach(el => {
        el.animate([
          { transform: 'scale(1)', opacity: 1 },
          { transform: 'scale(1.1)', opacity: 0.8 },
          { transform: 'scale(1)', opacity: 1 }
        ], {
          duration: 600,
          easing: 'ease-in-out'
        });
      });

      // 如果全部匹配完成，播放礼花动画
      if (score + 1 === poemPairs.length) {
        setTimeout(() => {
          const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
          for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
              position: fixed;
              width: 10px;
              height: 10px;
              background-color: ${colors[Math.floor(Math.random() * colors.length)]};
              pointer-events: none;
              border-radius: 50%;
              z-index: 9999;
            `;
            document.body.appendChild(confetti);

            const startX = window.innerWidth / 2;
            const startY = window.innerHeight / 2;
            const angle = Math.random() * Math.PI * 2;
            const velocity = 15 + Math.random() * 10;
            const endX = startX + Math.cos(angle) * velocity * 20;
            const endY = startY + Math.sin(angle) * velocity * 20;

            confetti.animate([
              { transform: `translate(${startX}px, ${startY}px) scale(0)` },
              { transform: `translate(${endX}px, ${endY}px) scale(1)`, offset: 0.6 },
              { transform: `translate(${endX}px, ${endY + 100}px) scale(0)` }
            ], {
              duration: 1000 + Math.random() * 1000,
              easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => confetti.remove();
          }
        }, 600);
      }
    }

    setSelected(null);
  };

  return (
    <WrapperContainer>
      <BackButton onClick={() => navigate('/')}>
        返回首页
      </BackButton>
      <Title>踏青诗会</Title>
      <Score>已匹配: {score} / {poemPairs.length}</Score>
      <GameContainer>
        <Column>
          {firstHalf.map((verse, index) => (
            <PoemCard
              key={index}
              onClick={() => handleClick(verse)}
              isSelected={selected === verse}
              isMatched={matched.has(verse)}
              whileHover={{ scale: matched.has(verse) ? 1 : 1.02 }}
              whileTap={{ scale: matched.has(verse) ? 1 : 0.98 }}
            >
              {verse}
            </PoemCard>
          ))}
        </Column>
        <Column>
          {secondHalf.map((verse, index) => (
            <PoemCard
              key={index}
              onClick={() => handleClick(verse)}
              isSelected={selected === verse}
              isMatched={matched.has(verse)}
              whileHover={{ scale: matched.has(verse) ? 1 : 1.02 }}
              whileTap={{ scale: matched.has(verse) ? 1 : 0.98 }}
            >
              {verse}
            </PoemCard>
          ))}
        </Column>
      </GameContainer>
      {score === poemPairs.length && (
        <ResetButton onClick={initializeGame}>再来一局</ResetButton>
      )}
    </WrapperContainer>
  );
};

export default Poetry;