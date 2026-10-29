import React, { useState, useEffect, useRef } from 'react';
import { Scenario, SolutionId, ScreenType, DifficultyId, Obstacle, Milestone } from './types';
import { initialScenarios, solutions, difficulties, milestones } from './data';
import { soundManager } from './audio';

interface ConfettiPiece {
  id: number;
  left: string;
  color: string;
  delay: string;
}

interface BonusFloat {
  id: number;
  text: string;
  x: number;
  y: number;
  isPenalty?: boolean;
}

export const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('start');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyId>('planner');
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyId>('planner');
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [livesLeft, setLivesLeft] = useState<number | null>(3);
  const [selectedSolution, setSelectedSolution] = useState<SolutionId | null>(null);
  const [answered, setAnswered] = useState(false);

  // Feature 1: Clean Water Surge Transformation State
  const [isWaterSurging, setIsWaterSurging] = useState(false);

  // Feature 2: Tangible Human Impact Metrics & Jerry Can Water Meter
  const [totalPeopleHelped, setTotalPeopleHelped] = useState(0);
  const [totalHoursSaved, setTotalHoursSaved] = useState(0);
  const [communitiesSuccessCount, setCommunitiesSuccessCount] = useState(0);

  // Feature 3: Audio State
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Environmental obstacles & beneficial assets state
  const [activeObstacles, setActiveObstacles] = useState<Obstacle[]>([]);
  const [removingObstacleId, setRemovingObstacleId] = useState<string | null>(null);
  const [shakingObstacleId, setShakingObstacleId] = useState<string | null>(null);
  const [allObstaclesCleared, setAllObstaclesCleared] = useState(false);
  const [bonusFloats, setBonusFloats] = useState<BonusFloat[]>([]);

  // Score Milestone Messages State
  const [triggeredMilestones, setTriggeredMilestones] = useState<number[]>([]);
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
  
  // Modal feedback state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    isCorrect: boolean;
    title: string;
    message: string;
    fact: string;
    isGameOver?: boolean;
  } | null>(null);

  // Score penalty popup state
  const [penaltyText, setPenaltyText] = useState('❌ -5');
  const [showPenalty, setShowPenalty] = useState(false);

  // End screen outcome
  const [endState, setEndState] = useState<{
    passed: boolean;
    reason: string;
  }>({ passed: false, reason: '' });

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

  const toggleAudio = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    if (next) {
      soundManager.playPop();
    }
  };

  // Evaluate milestone conditionals when score updates during gameplay
  const evaluateMilestones = (newScore: number, alreadyTriggered: number[]) => {
    for (const m of milestones) {
      if (newScore >= m.scoreThreshold && !alreadyTriggered.includes(m.scoreThreshold)) {
        setTriggeredMilestones((prev) => [...prev, m.scoreThreshold]);
        setActiveMilestone(m);
        soundManager.playPop();

        setTimeout(() => {
          setActiveMilestone((current) => (current?.scoreThreshold === m.scoreThreshold ? null : current));
        }, 4000);
        break;
      }
    }
  };

  // Randomly selects 2 hazards and 2 beneficial assets from the 3+3 pool for each community
  const selectRandomObstacles = (allObstacles: Obstacle[]): Obstacle[] => {
    const hazards = allObstacles.filter((o) => o.type === 'hazard');
    const benefits = allObstacles.filter((o) => o.type === 'benefit');

    const shuffledHazards = shuffleArray(hazards);
    const shuffledBenefits = shuffleArray(benefits);

    const selected = [
      ...shuffledHazards.slice(0, 2),
      ...shuffledBenefits.slice(0, 2),
    ];

    return shuffleArray(selected);
  };

  const currentConfig = difficulties[activeDifficulty];
  const currentScenario = scenarios[currentScenarioIndex] || scenarios[0];

  // Sync obstacles whenever scenario index or scenarios array changes
  useEffect(() => {
    if (currentScenario && currentScenario.obstacles) {
      setActiveObstacles(selectRandomObstacles(currentScenario.obstacles));
      setRemovingObstacleId(null);
      setShakingObstacleId(null);
      setAllObstaclesCleared(false);
      setIsWaterSurging(false);
    }
  }, [currentScenarioIndex, scenarios]);

  const startGameWithDifficulty = (diffId: DifficultyId = selectedDifficulty) => {
    setActiveDifficulty(diffId);
    const config = difficulties[diffId];
    const shuffled = shuffleArray(initialScenarios);
    setScenarios(shuffled);
    setCurrentScenarioIndex(0);
    setScore(0);
    setTimeLeft(config.initialTime);
    setLivesLeft(config.lives);
    setSelectedSolution(null);
    setAnswered(false);
    setIsModalOpen(false);
    setShowPenalty(false);
    setBonusFloats([]);
    setConfetti([]);

    // Reset impact metrics
    setTotalPeopleHelped(0);
    setTotalHoursSaved(0);
    setCommunitiesSuccessCount(0);
    setIsWaterSurging(false);

    // Reset score milestones
    setTriggeredMilestones([]);
    setActiveMilestone(null);

    if (shuffled[0] && shuffled[0].obstacles) {
      setActiveObstacles(selectRandomObstacles(shuffled[0].obstacles));
      setRemovingObstacleId(null);
      setShakingObstacleId(null);
      setAllObstaclesCleared(false);
    }

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
            handleTimeExpiry();
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
  }, [isTimerRunning, screen, currentScenarioIndex, activeDifficulty, livesLeft]);

  const handleTimeExpiry = () => {
    const config = difficulties[activeDifficulty];
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    soundManager.playWarning();

    if (config.timerMode === 'per-community') {
      // Expert mode: timeout for this individual community
      const scenario = scenarios[currentScenarioIndex];
      const newLives = livesLeft !== null ? livesLeft - 1 : null;
      setLivesLeft(newLives);

      setPenaltyText(`⏰ -${config.penaltyPoints}`);
      setShowPenalty(true);
      setTimeout(() => setShowPenalty(false), 1500);

      setScore((prev) => Math.max(0, prev - config.penaltyPoints));

      const correctSolution = solutions.find((s) => s.id === scenario.correctAnswer);
      const correctName = correctSolution ? correctSolution.name : scenario.correctAnswer;

      const isGameOver = newLives !== null && newLives <= 0;

      setModalData({
        isCorrect: false,
        title: 'Time Expired! -10 Points',
        message: `Crisis window closed for this community! The ideal solution was ${correctName}. ${scenario.explanation}`,
        fact: 'Did you know? ' + scenario.fact,
        isGameOver,
      });
      setIsModalOpen(true);
      setAnswered(true);
    } else {
      // Global clock expired
      finishGame(false, 'Time has run out before all water systems could be planned.');
    }
  };

  // Interactive chip click handler with audio
  const handleObstacleClick = (obstacle: Obstacle, event: React.MouseEvent<HTMLButtonElement>) => {
    if (answered) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const parent = event.currentTarget.parentElement?.getBoundingClientRect();
    const x = parent ? rect.left - parent.left + rect.width / 2 : 100;
    const y = parent ? rect.top - parent.top : 30;

    if (obstacle.type === 'benefit') {
      // MISTAKE: User clicked a beneficial natural asset!
      soundManager.playWarning();
      setShakingObstacleId(obstacle.id);
      setTimeout(() => setShakingObstacleId(null), 500);

      setScore((prev) => Math.max(0, prev - 5));

      const floatId = Date.now();
      setBonusFloats((prev) => [
        ...prev,
        { id: floatId, text: '⚠️ Damaged Natural Asset! -5 pts', x, y, isPenalty: true },
      ]);
      setTimeout(() => {
        setBonusFloats((prev) => prev.filter((f) => f.id !== floatId));
      }, 1400);
      return;
    }

    // SUCCESS: User clicked a harmful hazard! Remove it from DOM.
    soundManager.playPop();
    if (removingObstacleId) return;
    setRemovingObstacleId(obstacle.id);

    // Reward: +2 seconds bonus on timer
    setTimeLeft((prev) => prev + 2);

    const floatId = Date.now();
    setBonusFloats((prev) => [
      ...prev,
      { id: floatId, text: '+2s Hazard Cleared! 💧', x, y, isPenalty: false },
    ]);
    setTimeout(() => {
      setBonusFloats((prev) => prev.filter((f) => f.id !== floatId));
    }, 1100);

    // Remove the hazard from the DOM after exit animation
    setTimeout(() => {
      setActiveObstacles((prev) => {
        const remaining = prev.filter((o) => o.id !== obstacle.id);
        const remainingHazards = remaining.filter((o) => o.type === 'hazard');
        if (remainingHazards.length === 0) {
          setAllObstaclesCleared(true);
          setScore((s) => {
            const nextScore = s + 5;
            evaluateMilestones(nextScore, triggeredMilestones);
            return nextScore;
          });
          soundManager.playWaterSurge();
        }
        return remaining;
      });
      setRemovingObstacleId(null);
    }, 280);
  };

  const launchConfetti = () => {
    const colors = ['#ffc907', '#2e9df7', '#159a48', '#d94335', '#ffffff'];
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 110; i++) {
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
    }, 3200);
  };

  const finishGame = (forcedPass?: boolean, customReason?: string) => {
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const config = difficulties[activeDifficulty];
    const communitiesHelped = Math.floor(score / 10);
    const passed = forcedPass !== undefined ? forcedPass : communitiesHelped >= config.minPassCommunities;

    let reason = customReason || '';
    if (!reason) {
      if (passed) {
        if (communitiesHelped === 4) {
          reason = `Outstanding achievement! You brought clean water to every community under ${config.name} conditions.`;
        } else {
          reason = `Great work! You reached the qualification goal for ${config.name}.`;
        }
      } else {
        reason = `Mission incomplete. ${config.name} requires helping at least ${config.minPassCommunities} communities.`;
      }
    }

    setEndState({ passed, reason });
    setScreen('end');

    if (passed) {
      soundManager.playVictory();
      launchConfetti();
    } else {
      soundManager.playWarning();
    }
  };

  const checkAnswer = (solutionId: SolutionId) => {
    if (answered) return;

    setAnswered(true);
    setIsTimerRunning(false); // Pauses timer while modal is open
    setSelectedSolution(solutionId);

    const scenario = scenarios[currentScenarioIndex];
    const isCorrect = solutionId === scenario.correctAnswer;
    const config = difficulties[activeDifficulty];

    if (isCorrect) {
      setScore((prev) => {
        const nextScore = prev + 10;
        evaluateMilestones(nextScore, triggeredMilestones);
        return nextScore;
      });
      setTotalPeopleHelped((prev) => prev + scenario.peopleCount);
      setTotalHoursSaved((prev) => prev + scenario.dailyHoursSaved);
      setCommunitiesSuccessCount((prev) => prev + 1);

      // Feature 1: Trigger the Transformation Clean Water Surge!
      setIsWaterSurging(true);
      soundManager.playWaterSurge();

      setTimeout(() => {
        setIsWaterSurging(false);
        setModalData({
          isCorrect: true,
          title: 'Correct! +10 Points',
          message: scenario.explanation,
          fact: 'Did you know? ' + scenario.fact,
        });
        setIsModalOpen(true);
      }, 1200);
    } else {
      soundManager.playWarning();
      const newScore = Math.max(0, score - config.penaltyPoints);
      setScore(newScore);

      setPenaltyText(`❌ -${config.penaltyPoints}`);
      setShowPenalty(true);
      setTimeout(() => {
        setShowPenalty(false);
      }, 1500);

      const newLives = livesLeft !== null ? livesLeft - 1 : null;
      setLivesLeft(newLives);

      const correctSolution = solutions.find((s) => s.id === scenario.correctAnswer);
      const correctName = correctSolution ? correctSolution.name : scenario.correctAnswer;
      const isGameOver = newLives !== null && newLives <= 0;

      setModalData({
        isCorrect: false,
        title: `Incorrect! -${config.penaltyPoints} Points`,
        message: `The best solution is ${correctName}. ${scenario.explanation}`,
        fact: 'Did you know? ' + scenario.fact,
        isGameOver,
      });
      setIsModalOpen(true);
    }
  };

  const handleModalContinue = () => {
    setIsModalOpen(false);

    // If out of lives, end the game immediately with failure
    if (modalData?.isGameOver || (livesLeft !== null && livesLeft <= 0)) {
      finishGame(false, 'All emergency water reserves (Jerry Cans) were depleted.');
      return;
    }

    // Last scenario reached
    if (currentScenarioIndex === scenarios.length - 1) {
      finishGame();
      return;
    }

    // Advance to next community
    const config = difficulties[activeDifficulty];
    setCurrentScenarioIndex((prev) => prev + 1);
    setSelectedSolution(null);
    setAnswered(false);

    // Reset timer if per-community mode
    if (config.timerMode === 'per-community') {
      setTimeLeft(config.initialTime);
    }

    setIsTimerRunning(true);
  };

  const communitiesHelped = Math.floor(score / 10);

  const renderJerryCans = () => {
    const config = difficulties[activeDifficulty];
    if (config.lives === null || livesLeft === null) return null;

    const tokens = [];
    for (let i = 0; i < config.lives; i++) {
      const isActive = i < livesLeft;
      tokens.push(
        <img
          key={i}
          src={import.meta.env.BASE_URL + "img/water-can-transparent.png"}
          alt={isActive ? 'Active Jerry Can' : 'Depleted Jerry Can'}
          className={`jerry-can-token ${isActive ? 'active' : 'lost'}`}
          title={isActive ? 'Water reserve intact' : 'Water reserve depleted'}
        />
      );
    }

    return (
      <div className="lives-stat">
        <span className="stat-label">RESERVES</span>
        <div className="lives-wrapper" aria-label={`${livesLeft} of ${config.lives} water cans remaining`}>
          {tokens}
        </div>
      </div>
    );
  };

  const getTagClass = (id: DifficultyId) => {
    switch (id) {
      case 'apprentice':
        return 'tag-casual';
      case 'planner':
        return 'tag-standard';
      case 'expert':
        return 'tag-expert';
    }
  };

  return (
    <main className="app-shell">
      {/* Milestone Celebratory Toast Notification */}
      {activeMilestone && (
        <div className="milestone-toast-container" role="status" aria-live="polite">
          <div className="milestone-toast">
            <span style={{ fontSize: '1.6rem', flexShrink: 0 }} aria-hidden="true">✦</span>
            <div style={{ flex: 1 }}>
              <span className="milestone-badge-tag">{activeMilestone.badge}</span>
              <h4 className="milestone-toast-title">{activeMilestone.title}</h4>
              <p className="milestone-toast-msg">{activeMilestone.message}</p>
            </div>
            <button
              type="button"
              className="milestone-close-btn"
              onClick={() => setActiveMilestone(null)}
              title="Dismiss milestone"
              aria-label="Dismiss milestone"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Start screen */}
      {screen === 'start' && (
        <section id="start-screen" className="screen start-screen">
          <div className="start-copy">
            <img className="logo" src={import.meta.env.BASE_URL + "img/cw_logo_horizontal.png"} alt="charity: water" />
            <p className="eyebrow">H2gO: CLEAN WATER CHALLENGE</p>
            <h1>
              Small choices.<br />
              <span>Big impact.</span>
            </h1>
            <p className="intro">
              Step into the role of a clean water planner. Clear environmental hazards while protecting natural assets, then deploy the best engineering solution.
            </p>

            {/* Difficulty selector */}
            <div className="difficulty-section">
              <span className="section-label">Select Difficulty Mode</span>
              <div className="difficulty-options">
                {(Object.keys(difficulties) as DifficultyId[]).map((diffId) => {
                  const diff = difficulties[diffId];
                  const isSelected = selectedDifficulty === diffId;
                  return (
                    <div
                      key={diffId}
                      className={`difficulty-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedDifficulty(diffId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedDifficulty(diffId);
                        }
                      }}
                      aria-pressed={isSelected}
                    >
                      <div className="difficulty-header">
                        <span className="difficulty-title">{diff.name}</span>
                        <span className={`difficulty-tag ${getTagClass(diffId)}`}>{diff.badge}</span>
                      </div>
                      <p className="difficulty-desc">{diff.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="start-actions">
              <button
                id="start-button"
                className="button button-primary"
                onClick={() => startGameWithDifficulty(selectedDifficulty)}
              >
                Start the challenge ({difficulties[selectedDifficulty].name})
              </button>
              <button id="how-to-button" className="button button-secondary" onClick={showHowTo}>
                How to play
              </button>
              <button id="about-button" className="button button-secondary" onClick={() => setScreen('links')}>
                About & Donate ↗
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
            <img src={import.meta.env.BASE_URL + "img/water-can-transparent.png"} alt="" />
          </div>
        </section>
      )}

      {/* How to play screen */}
      {screen === 'how-to' && (
        <section id="how-to-screen" className="screen how-to-screen">
          <div className="how-to-panel">
            <img className="logo" src={import.meta.env.BASE_URL + "img/cw_logo_horizontal.png"} alt="charity: water" />
            <p className="eyebrow">H2gO: CLEAN WATER CHALLENGE</p>
            <h1>
              How to <span>play.</span>
            </h1>
            <p className="intro">
              You are a clean water project planner. Every community has different needs, so your job is to assess the water site, clear hazards without harming nature, and choose the best solution.
            </p>

            <ol className="instructions-list">
              <li>
                <span>01</span>
                <strong>Read the region information.</strong>
                <small>Look at the climate, water source, and community size.</small>
              </li>
              <li>
                <span>02</span>
                <strong>Clear hazards & protect natural assets.</strong>
                <small>
                  Each photo displays a random mix of harmful hazards and beneficial ecosystem assets:
                  <br />• <strong>Click Hazards (⚠️)</strong> (e.g. bacteria, silt, debris) to remove them for <strong>+2s bonus time</strong>.
                  <br />• <strong>Avoid Beneficial Assets (🌿)</strong> (e.g. aquifer veins, mangrove roots, alpine moss). Clicking them damages nature and incurs a <strong>-5 point penalty</strong>!
                  <br />• Clearing all active hazards while leaving natural assets intact earns a <strong>+5 bonus points</strong> site purification reward!
                </small>
              </li>
              <li>
                <span>03</span>
                <strong>Choose one water solution.</strong>
                <small>Pick the option that best matches the community's environmental conditions and see clean water surge into the village!</small>
              </li>
              <li>
                <span>04</span>
                <strong>Fill the Yellow Jerry Can.</strong>
                <small>Track live human impact (people empowered and daily walking time returned to families) as your reservoir fills.</small>
              </li>
              <li>
                <span>05</span>
                <strong>Complete all communities.</strong>
                <small>Monitor your timer carefully and help as many communities as possible.</small>
              </li>
            </ol>

            <h3 style={{ margin: '20px 0 10px', fontSize: '1.15rem' }}>Difficulty Modes Comparison</h3>
            <div className="modes-table-container">
              <table className="modes-table">
                <thead>
                  <tr>
                    <th>Mode</th>
                    <th>Pace & Timer</th>
                    <th>Clues & Hints</th>
                    <th>Jerry Cans (Lives)</th>
                    <th>Pass Goal</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(difficulties) as DifficultyId[]).map((diffId) => {
                    const diff = difficulties[diffId];
                    return (
                      <tr key={diffId} style={{ background: selectedDifficulty === diffId ? '#fffbe6' : undefined }}>
                        <td>
                          <strong>{diff.name}</strong> <small>({diff.badge})</small>
                        </td>
                        <td>{diff.timerMode === 'per-community' ? `${diff.initialTime}s per community` : `${diff.initialTime}s overall`}</td>
                        <td>{diff.showHints ? 'Full hints visible' : 'No hints (read clues)'}</td>
                        <td>{diff.lives === null ? 'Unlimited' : `${diff.lives} Cans`}</td>
                        <td>{diff.minPassCommunities} of 4 communities</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="how-to-actions">
              <button
                id="how-to-start-button"
                className="button button-primary"
                onClick={() => startGameWithDifficulty(selectedDifficulty)}
              >
                Start the challenge ({difficulties[selectedDifficulty].name})
              </button>
              <button id="back-button" className="button button-secondary" onClick={showStartScreen}>
                Back to menu
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Dedicated About charity: water & Donation Screen */}
      {screen === 'links' && (
        <section id="links-screen" className="screen links-screen">
          <div className="links-panel">
            <div>
              <img className="logo" src={import.meta.env.BASE_URL + "img/cw_logo_horizontal.png"} alt="charity: water" />
              <p className="eyebrow">REAL-WORLD IMPACT</p>
              <h1>Turn choices into <span>clean water.</span></h1>
              <div className="model-badge">
                <span>✓</span>
                <span>100% of public donations directly fund water projects in the field</span>
              </div>
              <p className="links-intro">
                In this game, you roleplayed a project planner. In the real world, charity: water works with experienced local partners to build sustainable wells, pipelines, filters, and rainwater systems.
              </p>
            </div>

            <div className="impact-cards-list">
              <a
                href="https://www.charitywater.org/donate"
                target="_blank"
                rel="noreferrer"
                className="impact-card featured"
              >
                <div className="impact-card-left">
                  <span className="impact-card-icon" aria-hidden="true">💛</span>
                  <div className="impact-card-content">
                    <strong>Donate Clean Water</strong>
                    <small>Every $40 provides one person with reliable, life-changing clean water.</small>
                  </div>
                </div>
                <span className="impact-card-arrow" aria-hidden="true">↗</span>
              </a>

              <a
                href="https://www.charitywater.org/the-spring"
                target="_blank"
                rel="noreferrer"
                className="impact-card"
              >
                <div className="impact-card-left">
                  <span className="impact-card-icon" aria-hidden="true">💧</span>
                  <div className="impact-card-content">
                    <strong>Join The Spring (Monthly Giving)</strong>
                    <small>A passionate global community bringing clean water to people every single month.</small>
                  </div>
                </div>
                <span className="impact-card-arrow" aria-hidden="true">↗</span>
              </a>

              <a
                href="https://www.charitywater.org/our-approach"
                target="_blank"
                rel="noreferrer"
                className="impact-card"
              >
                <div className="impact-card-left">
                  <span className="impact-card-icon" aria-hidden="true">🌍</span>
                  <div className="impact-card-content">
                    <strong>Explore Water Projects & Proof</strong>
                    <small>Every single project is tracked with exact GPS coordinates and photos.</small>
                  </div>
                </div>
                <span className="impact-card-arrow" aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="links-actions">
              <button
                className="button button-primary"
                onClick={() => startGameWithDifficulty(selectedDifficulty)}
              >
                Start the challenge ({difficulties[selectedDifficulty].name})
              </button>
              <button className="button button-secondary" onClick={showStartScreen}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <a className="brand-mark" href="https://www.charitywater.org/" target="_blank" rel="noreferrer">
                <img
                  src={import.meta.env.BASE_URL + "img/cw_logo.png"}
                  alt="charity: water"
                />
              </a>

              {/* Feature 3: Audio Toggle */}
              <button
                type="button"
                className="audio-toggle-btn"
                onClick={toggleAudio}
                title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              >
                <span>{soundEnabled ? '🔊 Sound' : '🔇 Muted'}</span>
              </button>

              <span className="mode-badge-indicator">
                <span className={`difficulty-tag ${getTagClass(activeDifficulty)}`}>
                  {currentConfig.badge}
                </span>
                {currentConfig.name}
              </span>
            </div>

            <div className="game-stats">
              {renderJerryCans()}

              <div>
                <span className="stat-label">SCORE</span>
                <strong id="score">{score}</strong>
              </div>

              <div>
                <span className="stat-label">
                  {currentConfig.timerMode === 'per-community' ? 'ROUND TIME' : 'TIME'}
                </span>
                <strong
                  id="timer"
                  style={{ color: timeLeft <= (currentConfig.timerMode === 'per-community' ? 4 : 10) ? '#ff4444' : undefined }}
                >
                  {timeLeft}s
                </strong>
                {currentConfig.timerMode === 'per-community' && (
                  <span className="per-round-indicator">per community</span>
                )}
              </div>
            </div>
          </header>

          {/* Progress row with Feature 2: Animated Jerry Can Water Meter */}
          <div className="progress-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                className="meter-can-wrapper"
                title={`Jerry Can filled ${Math.round((communitiesSuccessCount / scenarios.length) * 100)}% with clean water`}
              >
                <div
                  className="meter-can-fill"
                  style={{ height: `${(communitiesSuccessCount / scenarios.length) * 100}%` }}
                />
              </div>
              <span id="progress-text">
                COMMUNITY {currentScenarioIndex + 1} OF {scenarios.length}
              </span>
            </div>

            <div className="progress-track" aria-label="Game progress">
              <div
                id="progress-bar"
                className="progress-bar"
                style={{ width: `${((currentScenarioIndex + 1) / scenarios.length) * 100}%` }}
              />
            </div>
          </div>

          <article className="scenario-card">
            {/* Interactive Image Container with Removable Obstacles & Transformation Surge */}
            <div className="scenario-image-container">
              <img
                id="scenario-image"
                className="scenario-image"
                src={currentScenario.image}
                alt={`${currentScenario.region} community landscape`}
              />

              {/* Feature 1: Clean Water Transformation Surge Animation */}
              <div className={`water-surge-overlay ${isWaterSurging ? 'active' : ''}`}>
                <div className="water-wave-effect" />
                <div className="water-surge-badge">
                  <span className="surge-icon" aria-hidden="true">💧</span>
                  <h3 className="surge-title">Clean Water is Flowing!</h3>
                  <span className="surge-sub">
                    +{currentScenario.peopleCount} People Reached • {currentScenario.dailyHoursSaved}h Daily Time Saved
                  </span>
                </div>
              </div>

              {/* Removable Obstacle Layer */}
              <div className={`obstacles-layer ${allObstaclesCleared ? 'all-cleared' : ''}`}>
                {activeObstacles.some((o) => o.type === 'hazard') && (
                  <span className="obstacles-hint">
                    ⚠️ Clear hazards (+2s) | 🌿 Protect assets (-5 pts)
                  </span>
                )}

                {activeObstacles.map((obstacle) => {
                  const isRemoving = removingObstacleId === obstacle.id;
                  const isShaking = shakingObstacleId === obstacle.id;
                  return (
                    <button
                      key={obstacle.id}
                      type="button"
                      className={`obstacle-chip ${obstacle.type} ${isRemoving ? 'removing' : ''} ${isShaking ? 'shaking' : ''}`}
                      onClick={(e) => handleObstacleClick(obstacle, e)}
                      title={
                        obstacle.type === 'hazard'
                          ? `Tap to clear harmful ${obstacle.label}`
                          : `Protected natural asset: ${obstacle.label} (Do not tap!)`
                      }
                    >
                      <span className="obstacle-icon" aria-hidden="true">
                        {obstacle.icon}
                      </span>
                      <span className="obstacle-label">{obstacle.label}</span>
                    </button>
                  );
                })}

                {allObstaclesCleared && (
                  <div className="cleared-badge">
                    <span>🌿</span>
                    <span>Site Purified & Ecosystem Preserved! +5 Bonus Pts</span>
                  </div>
                )}

                {bonusFloats.map((float) => (
                  <div
                    key={float.id}
                    className="obstacle-bonus-float"
                    style={{
                      left: `${float.x}px`,
                      top: `${float.y}px`,
                      color: float.isPenalty ? '#ff4d4d' : undefined,
                    }}
                  >
                    {float.text}
                  </div>
                ))}
              </div>
            </div>

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
              <button
                id="game-reset-button"
                className="button button-secondary"
                onClick={() => startGameWithDifficulty(activeDifficulty)}
              >
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
                    {currentConfig.showHints && <small>{solution.hint}</small>}
                  </button>
                );
              })}
            </div>

            {/* Score penalty popup on wrong answer */}
            <div id="score-popup" className={`score-popup ${showPenalty ? 'show' : 'hidden'}`}>
              {penaltyText}
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

                  {currentConfig.lives !== null && (
                    <p style={{ margin: '10px 0 16px', fontSize: '0.85rem', color: livesLeft && livesLeft > 0 ? '#12334b' : '#d94335', fontWeight: 'bold' }}>
                      {modalData.isGameOver
                        ? '⚠️ All emergency water reserves have been depleted!'
                        : `Jerry Can reserves remaining: ${livesLeft} of ${currentConfig.lives}`}
                    </p>
                  )}

                  <button id="continue-button" className="button button-primary" onClick={handleModalContinue}>
                    {modalData.isGameOver ? 'View Mission Debrief →' : 'Continue →'}
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
          <img className="logo" src={import.meta.env.BASE_URL + "img/cw_logo_horizontal.png"} alt="charity: water" />
          <div className="end-icon" aria-hidden="true">
            {endState.passed ? '✦' : '⚠️'}
          </div>
          <p className="eyebrow">
            {endState.passed ? 'MISSION SUCCESSFUL' : 'MISSION REPORT'}
          </p>
          <h1>
            {endState.passed ? (
              <>Mission <span>complete.</span></>
            ) : (
              <>Mission <span>debrief.</span></>
            )}
          </h1>
          <p id="end-message" className="intro">
            {endState.reason}
          </p>

          {/* Feature 2: Real Human Impact Showcase */}
          <div className="human-impact-section">
            <h3 className="human-impact-title">
              <span>💧</span>
              <span>Real-World Impact Created</span>
            </h3>
            <div className="human-impact-grid">
              <div className="human-impact-card">
                <span className="impact-num">{totalPeopleHelped.toLocaleString()}</span>
                <span className="impact-label">People Empowered</span>
              </div>
              <div className="human-impact-card">
                <span className="impact-num">{totalHoursSaved.toFixed(1)} hrs</span>
                <span className="impact-label">Daily Walking Saved</span>
              </div>
              <div className="human-impact-card">
                <span className="impact-num">{Math.round((communitiesSuccessCount / scenarios.length) * 100)}%</span>
                <span className="impact-label">Reservoir Filled</span>
              </div>
            </div>
          </div>

          {/* Certification Card */}
          <div className="certification-card">
            <div className="certification-badge">
              <span>{endState.passed ? '🏅' : '📋'}</span>
              <span>
                {endState.passed
                  ? activeDifficulty === 'expert'
                    ? 'Certified Rapid Response Specialist'
                    : activeDifficulty === 'planner'
                    ? 'Certified Clean Water Project Planner'
                    : 'Field Apprentice Qualification'
                  : `${currentConfig.name} Attempted`}
              </span>
            </div>
            <p className="certification-desc">
              {endState.passed
                ? `Passed ${currentConfig.name} standards by providing sustainable water solutions to ${communitiesHelped} communities.`
                : `Goal was ${currentConfig.minPassCommunities} communities. Re-evaluate local aquifers, springs, and rainfall patterns to try again.`}
            </p>
          </div>

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

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              id="reset-button"
              className="button button-primary"
              onClick={() => startGameWithDifficulty(activeDifficulty)}
            >
              Play again ({currentConfig.name})
            </button>
            <button
              className="button button-secondary"
              onClick={() => setScreen('links')}
            >
              💛 About & Donate ↗
            </button>
            <button
              className="button button-secondary"
              onClick={showStartScreen}
            >
              Change Difficulty
            </button>
          </div>

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
