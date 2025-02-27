import styled from 'styled-components'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Pipe {
  spacing: number;
  top: number;
  x: number;
  width: number;
  scored: boolean;
  speed: number;
  bottom?: number;
}

const WrapperContainer = styled.div`
  min-height: 100vh;
  // padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(245, 245, 245, 0.9)),
    url('/src/assets/kite-bg.jpg') center/cover no-repeat;
  position: relative;
`

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--primary-color);
`

const GameCanvas = styled.canvas`
  border: 2px solid var(--accent-color);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  max-width: 100%;
`

const Score = styled.div`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--accent-color);
`

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
`

const Instructions = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  max-width: 600px;
  line-height: 1.4;
  color: var(--text-color);
  font-size: 0.9rem;
`

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
`

// 添加新的styled-components
const DifficultyButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
`

const GameOverlay = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: 40px;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 400px;
  background-color: rgba(0, 0, 0, 0.7);
  display: ${props => (props.visible ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 10;
  border-radius: 8px;
`

// 添加春季主题颜色
const springColors = [
  '#FFCDD2',
  '#F8BBD0',
  '#E1BEE7',
  '#C5CAE9',
  '#BBDEFB',
  '#B3E5FC',
  '#B2EBF2',
  '#B2DFDB',
  '#C8E6C9',
  '#DCEDC8',
  '#F0F4C3',
  '#FFF9C4',
  '#FFECB3',
  '#FFE0B2',
  '#FFCCBC',
]

const Kite = () => {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [showStartScreen, setShowStartScreen] = useState(true)
  const [_difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(
    'medium'
  )

  // 游戏配置
  const gameConfigRef = useRef({
    gameSpeed: 3,
    gravity: 0.5,
    gapSize: 140,
    frameCount: 0,
  })

  // 游戏元素
  const gameElementsRef = useRef({
    pipes: [] as any[],
    petals: [] as any[],
    confetti: [] as any[],
  })

  // 风筝状态
  const kiteRef = useRef({
    x: 50,
    y: 200,
    width: 36,
    height: 40,
    velocity: 0,
    lift: -8,
    angle: 0,
    speed: 2,
  })

  // 初始化游戏
  const initGame = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    const config = gameConfigRef.current
    switch (selectedDifficulty) {
      case 'easy':
        config.gameSpeed = 2
        config.gravity = 0.4
        config.gapSize = 160
        break
      case 'medium':
        config.gameSpeed = 3
        config.gravity = 0.5
        config.gapSize = 140
        break
      case 'hard':
        config.gameSpeed = 4
        config.gravity = 0.6
        config.gapSize = 120
        break
    }

    setDifficulty(selectedDifficulty)
    // 确保清空所有游戏元素
    const elements = gameElementsRef.current
    elements.pipes = []
    elements.petals = []
    elements.confetti = []

    config.frameCount = 0
    setScore(0)
    setShowStartScreen(false)
    setGameStarted(true)

    // 重置风筝的所有状态
    const kite = kiteRef.current
    kite.x = 50
    kite.y = 200
    kite.velocity = 0
    kite.angle = 0
    kite.speed = 2

    // 重新初始化花瓣
    initPetals()
  }

  // 初始化樱花花瓣
  const initPetals = () => {
    const petals = []
    for (let i = 0; i < 20; i++) {
      petals.push({
        x: Math.random() * 600,
        y: -20 - Math.random() * 30,
        size: 5 + Math.random() * 5,
        color: springColors[Math.floor(Math.random() * springColors.length)],
        speed: 0.5 + Math.random() * 1,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.02,
        horizontalSpeed: (Math.random() - 0.5) * 1,
      })
    }
    gameElementsRef.current.petals = petals
  }

  // 添加新的障碍物
  const addPipe = () => {
    const config = gameConfigRef.current
    const pipe: Pipe = {
      spacing: config.gapSize,
      top: Math.floor(Math.random() * (400 - config.gapSize - 80)) + 20,
      x: 600,
      width: 60,
      scored: false,
      speed: config.gameSpeed,
    }
    pipe.bottom = pipe.top + pipe.spacing
    gameElementsRef.current.pipes.push(pipe)
  }

  // 游戏主循环
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = 600
    canvas.height = 400
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const drawBackground = () => {
      // 渐变天空
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#81D4FA')
      gradient.addColorStop(0.6, '#B3E5FC')
      gradient.addColorStop(1, '#E1F5FE')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 远处的山脉
      ctx.fillStyle = '#C8E6C9'
      ctx.beginPath()
      ctx.moveTo(0, canvas.height - 100)
      for (let i = 0; i < canvas.width; i += 20) {
        const height = Math.sin(i * 0.01) * 20 + 30
        ctx.lineTo(i, canvas.height - 100 + height)
      }
      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()
      ctx.fill()
    }

    const drawPetals = () => {
      gameElementsRef.current.petals.forEach(petal => {
        ctx.save()
        ctx.translate(petal.x, petal.y)
        ctx.rotate(petal.angle)

        ctx.fillStyle = petal.color
        ctx.beginPath()
        ctx.ellipse(0, 0, petal.size, petal.size / 2, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()

        // 更新花瓣位置
        petal.y += petal.speed
        petal.x += petal.horizontalSpeed
        petal.angle += petal.angularVelocity

        if (petal.y > canvas.height + 20) {
          petal.y = -20
          petal.x = Math.random() * canvas.width
        }
      })
    }

    const drawWillow = (
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      // 柳树主干
      ctx.fillStyle = '#8D6E63'
      ctx.fillRect(x + width / 2 - 5, y, 10, height)

      // 柳树枝条
      ctx.strokeStyle = '#A5D6A7'
      ctx.lineWidth = 2

      const branchCount = Math.abs(height) > 150 ? 12 : 8
      const branchSpacing = Math.abs(height) / branchCount

      for (let i = 0; i < branchCount; i++) {
        const branchY =
          y + (height > 0 ? i * branchSpacing : -i * branchSpacing)
        const wiggle = Math.sin(Date.now() / 2000 + i) * 5

        // 左侧枝条
        ctx.beginPath()
        ctx.moveTo(x + width / 2, branchY)
        ctx.quadraticCurveTo(
          x + width / 4,
          branchY + (height > 0 ? 20 : -20) + wiggle,
          x - 10,
          branchY + (height > 0 ? 40 : -40) + wiggle
        )
        ctx.stroke()

        // 右侧枝条
        ctx.beginPath()
        ctx.moveTo(x + width / 2, branchY)
        ctx.quadraticCurveTo(
          x + (width * 3) / 4,
          branchY + (height > 0 ? 20 : -20) - wiggle,
          x + width + 10,
          branchY + (height > 0 ? 40 : -40) - wiggle
        )
        ctx.stroke()
      }
    }

    const drawKite = () => {
      const kite = kiteRef.current
      ctx.save()
      ctx.translate(kite.x, kite.y)
      ctx.rotate(kite.angle)

      // 风筝主体
      ctx.beginPath()
      ctx.moveTo(0, -20)
      ctx.lineTo(20, 0)
      ctx.lineTo(0, 20)
      ctx.lineTo(-20, 0)
      ctx.closePath()
      ctx.fillStyle = '#FF5252'
      ctx.fill()
      ctx.strokeStyle = '#c92a2a'
      ctx.stroke()

      // 风筝装饰
      ctx.fillStyle = '#FFEB3B'
      ctx.beginPath()
      ctx.arc(0, 0, 6, 0, Math.PI * 2)
      ctx.fill()

      // 风筝尾巴
      ctx.strokeStyle = '#FFC107'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, 20)

      const tailLength = 50
      const timeOffset = Date.now() / 200

      for (let i = 0; i < tailLength; i += 2) {
        const xOffset = Math.sin((i / 5 + timeOffset) * 0.5) * 3
        ctx.lineTo(xOffset, 20 + i)
      }
      ctx.stroke()

      ctx.restore()
    }

    const updateGame = () => {
      const kite = kiteRef.current
      const config = gameConfigRef.current
      const elements = gameElementsRef.current

      // 如果游戏已结束，不更新游戏状态
      if (!gameStarted) return

      // 更新风筝位置
      kite.velocity += config.gravity
      kite.y += kite.velocity

      // 边界检查
      if (kite.y + kite.height > canvas.height) {
        gameOver()
        return // 立即返回，防止继续更新
      }
      if (kite.y < 0) {
        kite.y = 0
        kite.velocity = 0
      }

      // 更新障碍物
      elements.pipes.forEach((pipe, index) => {
        pipe.x -= pipe.speed

        // 碰撞检测
        if (checkCollision(kite, pipe)) {
          gameOver()
        }

        // 计分
        if (!pipe.scored && pipe.x + pipe.width < kite.x) {
          pipe.scored = true
          setScore(prev => prev + 1)
        }

        // 移除屏幕外的障碍物
        if (pipe.x + pipe.width < 0) {
          elements.pipes.splice(index, 1)
        }
      })

      // 添加新障碍物
      if (config.frameCount % 100 === 0) {
        addPipe()
      }

      config.frameCount++
    }

    const checkCollision = (kite: any, pipe: any) => {
      const kiteBox = {
        left: kite.x - 20,
        right: kite.x + 20,
        top: kite.y - 20,
        bottom: kite.y + 20,
      }

      return (
        kiteBox.right > pipe.x &&
        kiteBox.left < pipe.x + pipe.width &&
        (kiteBox.top < pipe.top || kiteBox.bottom > pipe.bottom)
      )
    }

    const gameLoop = () => {
      if (!gameStarted) {
        // 游戏结束时，只绘制最后一帧
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawBackground()
        drawPetals()
        drawKite()
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawBackground()
      drawPetals()

      gameElementsRef.current.pipes.forEach(pipe => {
        drawWillow(pipe.x, pipe.top, pipe.width, -canvas.height)
        drawWillow(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom)
      })

      drawKite()
      updateGame()

      // 使用 animationFrameId 存储当前帧的 ID
      animationFrameId = requestAnimationFrame(gameLoop)
    }

    // 开始游戏循环
    gameLoop()

    // 清理函数
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [gameStarted])

  // 事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return

      const kite = kiteRef.current
      switch (e.code) {
        case 'Space':
          kite.velocity = -8
          e.preventDefault()
          break
        case 'ArrowLeft':
          kite.angle -= 0.1
          break
        case 'ArrowRight':
          kite.angle += 0.1
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted])

  const gameOver = () => {
    setGameStarted(false)
    setShowStartScreen(true)
  }

  return (
    <WrapperContainer>
      <BackButton onClick={() => navigate('/')}>返回首页</BackButton>
      <Title>春日风筝飞行</Title>

      {showStartScreen && (
        <GameOverlay visible={true}>
          <h1>{score > 0 ? '游戏结束' : '开始游戏'}</h1>
          {score > 0 && <p>得分: {score}</p>}
          <DifficultyButtons>
            <Button onClick={() => initGame('easy')}>简单模式</Button>
            <Button onClick={() => initGame('medium')}>普通模式</Button>
            <Button onClick={() => initGame('hard')}>困难模式</Button>
          </DifficultyButtons>
        </GameOverlay>
      )}

      <Instructions>
        使用空格键让风筝上升， 避开柳树枝条，尽可能飞得更远！
      </Instructions>

      <Score>得分: {score}</Score>
      <GameCanvas ref={canvasRef} />

      <Controls>
        <Button onClick={gameOver} disabled={!gameStarted}>
          结束游戏
        </Button>
      </Controls>
    </WrapperContainer>
  )
}

export default Kite
