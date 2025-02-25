import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomeContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(245, 245, 245, 0.5)),
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--primary-color);
`;

const Description = styled.p`
  max-width: 800px;
  margin-bottom: 3rem;
  text-align: center;
  line-height: 1.8;
  font-size: 1.1rem;
`;

const CustomsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const CustomCard = styled(motion(Link))`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  color: var(--text-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  h2 {
    color: var(--accent-color);
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const Home = () => {
  return (
    <HomeContainer>
      <Title>清明文化传承</Title>
      <Description>
        清明节是中华民族重要的传统节日，寄托着人们对先人的追思和对生命的敬畏。
        在这个特殊的日子里，我们通过各种习俗活动，传承文化，寄托哀思，感受春天的气息。
      </Description>
      <CustomsGrid>
        <CustomCard
          to="/worship"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h2>祭祖追思</h2>
          <p>写下对逝去亲人的思念，通过虚拟祭祀寄托哀思</p>
        </CustomCard>
        <CustomCard
          to="/poetry"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h2>踏青诗会</h2>
          <p>体验诗句连连看游戏，重温清明诗词之美</p>
        </CustomCard>
        <CustomCard
          to="/kite"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h2>放飞风筝</h2>
          <p>体验虚拟放风筝游戏，感受春日清明的美好</p>
        </CustomCard>
      </CustomsGrid>
    </HomeContainer>
  );
};

export default Home;