import React, { useState, useEffect, useRef } from 'react';
import { Scenario, SolutionId, ScreenType } from './types';
import { initialScenarios, solutions } from './data';

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  delay: string;
}

export const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('start');
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<SolutionId | null>(null);
  const [answered, setAnswered] = useState(false);
  
  // Modal feedback state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    isCorrect: boolean;
    title: string;
    message: string;
    fact: string;
  } | null>(null);

  // Score penalty popup state
  const [showPenalty, setShowPenalty] = useState(false);

  // End screen message
  const [endMessage, setEndMessage] = useState<string | null>(null);

  // Confetti pieces
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  const timerRef = useRef<number | null>(null);

  const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const startGame = () => {
    const shuffled = shuffleArray(initialScenarios);
    setScenarios(shuffled);
    setCurrentScenarioIndex(0);
    setScore(0);
    setTimeLeft(60);
    setSelectedSolution(null);
    setAnswered(false);
    setIsModalOpen(false);
    setShowPenalty(false);
    setEndMessage(null);
    setConfetti([]);
    setScreen('game');
    setIsTimerRunning(true);
  };

  const showHowTo = () => {
    setScreen('how-to');
  };

  const showStartScreen = () => {
    setScreen('start');
  };

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && screen === 'game') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsTimerRunning(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, screen]);

  const handleTimeUp = () => {
    finishGame('Time is up, but every decision is part of learning.');
  };

  const launchConfetti = () => {
    const colors = ['#ffc907', '#2e9df7', '#159a48', '#d94335', '#ffffff'];
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 100; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100 + 'vw',
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1 + 's',
      });
    }
    setConfetti(pieces);
    setTimeout(() => {
      setConfetti([]);
    }, 3000);
  };

  const finishGame = (customMessage?: string) => {
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setEndMessage(customMessage || null);
    setScreen('end');

    // Confetti on 40 or more
    if (score >= 40 || (!customMessage && score >= 40)) {
      launchConfetti();
    }
  };

  const checkAnswer = (solutionId: SolutionId) => {
    if (answered) return;

    setAnswered(true);
    setIsTimerRunning(false); // Pauses timer while modal is open
    setSelectedSolution(solutionId);

    const scenario = scenarios[currentScenarioIndex];
    const isCorrect = solutionId === scenario.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setModalData({
        isCorrect: true,
        title: 'Correct! +10 Points',
        message: scenario.explanation,
        fact: 'Did you know? ' + scenario.fact,
      });
      setIsModalOpen(true);
    } else {
      setScore((prev) => Math.max(0, prev - 5));
      setShowPenalty(true);
      setTimeout(() => {
        setShowPenalty(false);
      }, 1500);

      const correctSolution = solutions.find((s) => s.id === scenario.correctAnswer);
      const correctName = correctSolution ? correctSolution.name : scenario.correctAnswer;

      setModalData({
        isCorrect: false,
        title: 'Incorrect! -5 Points',
        message: `The best solution is ${correctName}. ${scenario.explanation}`,
        fact: 'Did you know? ' + scenario.fact,
      });
      setIsModalOpen(true);
    }
  };

  const handleModalContinue = () => {
    setIsModalOpen(false);

    if (currentScenarioIndex === scenarios.length - 1) {
      finishGame();
    } else {
      setCurrentScenarioIndex((prev) => prev + 1);
      setSelectedSolution(null);
      setAnswered(false);
      setIsTimerRunning(true); // Resumes timer
    }
  };

  const currentScenario = scenarios[currentScenarioIndex] || scenarios[0];
  const communitiesHelped = Math.floor(score / 10);

  const getEndMessage = () => {
    if (endMessage) return endMessage;
    if (communitiesHelped === 4) {
      return 'Excellent work! Every community received the ideal water solution.';
    }
    if (communitiesHelped >= 2) {
      return 'Great job. Several communities now have better access to clean water.';
    }
    return 'Every project starts with learning. Try again to help more communities.';
  };

  return (
    <main className="app-shell">
      {/* Start screen */}
      {screen === 'start' && (
        <section id="start-screen" className="screen start-screen">
          <div className="start-copy">
            <img className="logo" src="/img/cw_logo_horizontal.png" alt="charity: water" />
            <p className="eyebrow">H2gO: CLEAN WATER CHALLENGE</p>
            <h1>
              Small choices.<br />
              <span>Big impact.</span>
            </h1>
            <p className="intro">
              Step into the role of a clean water planner. Read each community's story and choose the solution that fits best.
            </p>
            <div className="start-actions">
              <button id="start-button" className="button button-primary" onClick={startGame}>
                Start the challenge
              </button>
              <button id="how-to-button" className="button button-secondary" onClick={showHowTo}>
                How to play
              </button>
            </div>
            <p className="mission-note">
              Inspired by charity: water's mission to bring clean water to people around the world.
            </p>
          </div>
          <div className="start-art" aria-hidden="true">
            <div className="sun" />
            <div className="hill hill-back" />
            <div className="hill hill-front" />
            <img src="/img/water-can-transparent.png" alt="" />
          </div>
        </section>
      )}

      {/* How to play screen */}
      {screen === 'how-to' && (
        <section id="how-to-screen" className="screen how-to-screen">
          <div className="how-to-panel">
            <img className="logo" src="/img/cw_logo_horizontal.png" alt="charity: water" />
            <p className="eyebrow">H2gO: CLEAN WATER CHALLENGE</p>
            <h1>
              How to <span>play.</span>
            </h1>
            <p className="intro">
              You are a clean water project planner. Every community has different needs, so your job is to choose the best solution.
            </p>
            <ol className="instructions-list">
              <li>
                <span>01</span>
                <strong>Read the region information.</strong>
                <small>Look at the climate, water source, and community size.</small>
              </li>
              <li>
                <span>02</span>
                <strong>Choose one water solution.</strong>
                <small>Pick the option that best matches the community's needs.</small>
              </li>
              <li>
                <span>03</span>
                <strong>Learn from the result.</strong>
                <small>Correct choices earn 10 points and every choice gives feedback.</small>
              </li>
              <li>
                <span>04</span>
                <strong>Complete all communities.</strong>
                <small>Work quickly: you have 60 seconds to finish the challenge.</small>
              </li>
            </ol>
            <div className="how-to-actions">
              <button id="how-to-start-button" className="button button-primary" onClick={startGame}>
                Start the challenge
              </button>
              <button id="back-button" className="button button-secondary" onClick={showStartScreen}>
                Back to menu
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Game screen */}
      {screen === 'game' && (
        <section id="game-screen" className="screen game-screen">
          <header className="game-header">
            <a className="brand-mark" href="https://www.charitywater.org/" target="_blank" rel="noreferrer">
              <img src="/img/cw_logo.png" alt="charity: water" />
            </a>
            <div className="game-stats">
              <div>
                <span className="stat-label">SCORE</span>
                <strong id="score">{score}</strong>
              </div>
              <div>
                <span className="stat-label">TIME</span>
                <strong id="timer" style={{ color: timeLeft <= 10 ? '#ff4444' : undefined }}>
                  {timeLeft}
                </strong>
              </div>
            </div>
          </header>

          <div className="progress-row">
            <span id="progress-text">
              COMMUNITY {currentScenarioIndex + 1} OF {scenarios.length}
            </span>
            <div className="progress-track" aria-label="Game progress">
              <div
                id="progress-bar"
                className="progress-bar"
                style={{ width: `${((currentScenarioIndex + 1) / scenarios.length) * 100}%` }}
              />
            </div>
          </div>

          <article className="scenario-card">
            <img
              id="scenario-image"
              className="scenario-image"
              src={currentScenario.image}
              alt={`${currentScenario.region} community landscape`}
            />
            <div className="scenario-heading">
              <div>
                <p id="scenario-region" className="eyebrow">
                  {currentScenario.region}
                </p>
                <h2 id="scenario-title">{currentScenario.title}</h2>
              </div>
              <span id="scenario-icon" className="scenario-icon" aria-hidden="true">
                {currentScenario.icon}
              </span>
            </div>
            <p id="scenario-description" className="scenario-description">
              {currentScenario.description}
            </p>
            <div className="details-grid">
              <div>
                <span className="detail-label">CLIMATE</span>
                <strong id="scenario-climate">{currentScenario.climate}</strong>
              </div>
              <div>
                <span className="detail-label">WATER SOURCE</span>
                <strong id="scenario-source">{currentScenario.source}</strong>
              </div>
              <div>
                <span className="detail-label">COMMUNITY</span>
                <strong id="scenario-population">{currentScenario.population}</strong>
              </div>
            </div>
            <div className="reset-row">
              <button id="game-reset-button" className="button button-secondary" onClick={startGame}>
                Reset Game
              </button>
            </div>
          </article>

          <section className="choice-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">MAKE A DECISION</p>
                <h2>Which solution fits this community?</h2>
              </div>
              <span className="points-note">+10 points</span>
            </div>

            <div id="choices" className="choices-grid">
              {solutions.map((solution) => {
                const isSelected = selectedSolution === solution.id;
                return (
                  <button
                    key={solution.id}
                    className={`choice-button ${isSelected ? 'selected' : ''}`}
                    type="button"
                    disabled={answered}
                    onClick={() => checkAnswer(solution.id)}
                  >
                    <span className="choice-icon" aria-hidden="true">
                      {solution.icon}
                    </span>
                    <strong>{solution.name}</strong>
                    <small>{solution.hint}</small>
                  </button>
                );
              })}
            </div>

            {/* Score penalty popup on wrong answer */}
            <div id="score-popup" className={`score-popup ${showPenalty ? 'show' : 'hidden'}`}>
              ❌ -5
            </div>

            {/* Feedback Modal */}
            {isModalOpen && modalData && (
              <div id="feedback-modal" className="feedback-modal">
                <div id="feedback-card" className={`feedback-card ${modalData.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div id="modal-icon" className="modal-icon">
                    {modalData.isCorrect ? '✅' : '❌'}
                  </div>
                  <h2 id="modal-title" className="modal-title">
                    {modalData.title}
                  </h2>
                  <p id="modal-message" className="modal-message">
                    {modalData.message}
                  </p>
                  <p id="modal-fact" className="modal-fact">
                    {modalData.fact}
                  </p>
                  <button id="continue-button" className="button button-primary" onClick={handleModalContinue}>
                    Continue →
                  </button>
                </div>
              </div>
            )}
          </section>
        </section>
      )}

      {/* End screen */}
      {screen === 'end' && (
        <section id="end-screen" className="screen end-screen">
          <img className="logo" src="/img/cw_logo_horizontal.png" alt="charity: water" />
          <div className="end-icon" aria-hidden="true">
            ✦
          </div>
          <p className="eyebrow">CHALLENGE COMPLETE</p>
          <h1>
            Mission <span>complete.</span>
          </h1>
          <p id="end-message" className="intro">
            {getEndMessage()}
          </p>
          <div className="result-grid">
            <div>
              <span className="detail-label">FINAL SCORE</span>
              <strong id="final-score">{score}</strong>
            </div>
            <div>
              <span className="detail-label">COMMUNITIES HELPED</span>
              <strong id="final-communities">{communitiesHelped}</strong>
            </div>
          </div>
          <button id="reset-button" className="button button-primary" onClick={startGame}>
            Play again
          </button>
          <a className="learn-link" href="https://www.charitywater.org/" target="_blank" rel="noreferrer">
            Learn more about charity: water ↗
          </a>
        </section>
      )}

      {/* Confetti container */}
      <div id="confetti-container">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="confetti"
            style={{
              left: piece.left,
              backgroundColor: piece.color,
              animationDelay: piece.delay,
            }}
          />
        ))}
      </div>
    </main>
  );
};
