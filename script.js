// Each object is one playable community. Add another object here to create
// another question without changing the rest of the game code.
const scenarios = [
	{
		region: 'Drylands',
		title: 'A reliable source for Kijiji',
		icon: '☀️',
		image: 'img/Desert.png',
		description: 'Kijiji has very little rainfall. Families currently walk a long distance to collect water, but a groundwater source has been found under the community.',
		climate: 'Hot and very dry',
		source: 'Underground aquifer',
		population: '800 people',
		correctAnswer: 'well',
		explanation: 'A well can reach the underground aquifer and give the community a reliable local source of clean water.',
		fact: 'Reliable nearby water can reduce the time families spend walking to collect water.'
	},
	{
		region: 'Mountain Valley',
		title: 'Connecting the hillside homes',
		icon: '⛰️',
		image: 'img/Mountain.png',
		description: 'Families live across a steep valley. A clean spring sits uphill from the homes, but the community needs a way to move that water safely.',
		climate: 'Cool and mountainous',
		source: 'Clean hillside spring',
		population: '1,200 people',
		correctAnswer: 'pipeline',
		explanation: 'A pipeline can carry water from the spring to homes across the valley without requiring a long daily walk.',
		fact: 'When water is closer to home, people have more time for school, work, and family.'
	},
	{
		region: 'Coastal Plain',
		title: 'Making salty water safe',
		icon: '🌊',
			image: 'img/Desalination.png',
		description: 'The community is near the ocean and has access to a salty surface water source. The solution must make the water safe to drink.',
		climate: 'Warm and coastal',
		source: 'Salty surface water',
		population: '600 people',
		correctAnswer: 'filtration',
		explanation: 'A filtration system can remove contaminants and make the available water safer for the community to use.',
		fact: 'Clean water access supports healthier communities and helps prevent waterborne illness.'
	},
	{
		region: 'Rainforest',
		title: 'Saving the rainy season',
		icon: '🌧️',
		image: 'img/Tropical.png',
		description: 'This community receives heavy seasonal rainfall. Families need a way to save clean rainwater for the drier weeks between storms.',
		climate: 'Wet and rainy',
		source: 'Frequent rainfall',
		population: '950 people',
		correctAnswer: 'rainwater',
		explanation: 'Rainwater collection stores rainfall during storms so families have a clean water supply when the weather becomes dry.',
		fact: 'Collecting rain can help a community prepare for the dry season instead of waiting for the next storm.'
	}
];

const solutions = [
	{ id: 'well', icon: '🪣', name: 'Community well', hint: 'Reach water below the ground' },
	{ id: 'pipeline', icon: '🔧', name: 'Pipeline', hint: 'Move water from a source' },
	{ id: 'rainwater', icon: '💧', name: 'Rainwater collection', hint: 'Save water from storms' },
	{ id: 'filtration', icon: '🫗', name: 'Filtration system', hint: 'Make water safer to drink' }
];

// Keep all changing game values in a few simple variables.
let currentScenario = 0;
let score = 0;
let timeLeft = 60;
let timerId;
let answered = false;

const startScreen = document.querySelector('#start-screen');
const howToScreen = document.querySelector('#how-to-screen');
const gameScreen = document.querySelector('#game-screen');
const endScreen = document.querySelector('#end-screen');
const scoreDisplay = document.querySelector('#score');
const timerDisplay = document.querySelector('#timer');
const progressText = document.querySelector('#progress-text');
const progressBar = document.querySelector('#progress-bar');
const scenarioImage = document.querySelector('#scenario-image');
const feedback = document.querySelector('#feedback');
const choices = document.querySelector('#choices');
const nextButton = document.querySelector('#next-button');
const feedbackModal = document.querySelector('#feedback-modal');
const feedbackCard = document.querySelector('#feedback-card');
const modalIcon = document.querySelector('#modal-icon');
const modalTitle = document.querySelector('#modal-title');
const modalMessage = document.querySelector('#modal-message');
const modalFact = document.querySelector('#modal-fact');
const continueButton = document.querySelector('#continue-button');
const scorePopup = document.querySelector('#score-popup');
const confettiContainer =
  document.querySelector('#confetti-container');

document.querySelector('#start-button').addEventListener('click', startGame);
document.querySelector('#how-to-button').addEventListener('click', showHowTo);
document.querySelector('#how-to-start-button').addEventListener('click', startGame);
document.querySelector('#back-button').addEventListener('click', showStartScreen);
document.querySelector('#reset-button').addEventListener('click', startGame);
document.querySelector('#game-reset-button')
  .addEventListener('click', startGame);
nextButton.addEventListener('click', showNextScenario);
continueButton.addEventListener('click', function () {

  feedbackModal.classList.add('hidden');

  if (currentScenario === scenarios.length - 1) {
    showEndScreen();
  } else {
    showNextScenario();
    startTimer();   // <-- resumes from the time that's left
  }

});

function shuffleScenarios() {

  for (let i = scenarios.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [scenarios[i], scenarios[j]] = [scenarios[j], scenarios[i]];
  }
}


function startGame() {
	currentScenario = 0;
	score = 0;
	timeLeft = 60;
  shuffleScenarios();
  timerDisplay.style.color = '';
	answered = false;
	scoreDisplay.textContent = score;
	timerDisplay.textContent = timeLeft;
	startScreen.classList.add('hidden');
	howToScreen.classList.add('hidden');
	endScreen.classList.add('hidden');
	gameScreen.classList.remove('hidden');
	showScenario();
	startTimer();
}

function showHowTo() {
	startScreen.classList.add('hidden');
	howToScreen.classList.remove('hidden');
}

function showStartScreen() {
	howToScreen.classList.add('hidden');
	startScreen.classList.remove('hidden');
}

function startTimer() {
	clearInterval(timerId);
	timerId = setInterval(function () {
		timeLeft -= 1;
		timerDisplay.textContent = timeLeft;
    if (timeLeft <= 10) {
      timerDisplay.style.color = '#ff4444';
    }

		if (timeLeft <= 0) {
			clearInterval(timerId);
			showEndScreen('Time is up, but every decision is part of learning.');
		}
	}, 1000);
}

function showScenario() {
	const scenario = scenarios[currentScenario];
	answered = false;
	progressText.textContent = `COMMUNITY ${currentScenario + 1} OF ${scenarios.length}`;
	progressBar.style.width = `${((currentScenario + 1) / scenarios.length) * 100}%`;
	document.querySelector('#scenario-region').textContent = scenario.region;
	document.querySelector('#scenario-title').textContent = scenario.title;
	document.querySelector('#scenario-icon').textContent = scenario.icon;
	scenarioImage.src = scenario.image;
	scenarioImage.alt = `${scenario.region} community landscape`;
	document.querySelector('#scenario-description').textContent = scenario.description;
	document.querySelector('#scenario-climate').textContent = scenario.climate;
	document.querySelector('#scenario-source').textContent = scenario.source;
	document.querySelector('#scenario-population').textContent = scenario.population;
	feedback.className = 'feedback hidden';
  feedbackModal.classList.add('hidden');
  feedback.innerHTML = '';
	nextButton.classList.add('hidden');
	renderChoices();
}

function renderChoices() {
	choices.innerHTML = '';

	solutions.forEach(function (solution) {
		const button = document.createElement('button');
		button.className = 'choice-button';
		button.type = 'button';
		button.innerHTML = `<span class="choice-icon" aria-hidden="true">${solution.icon}</span><strong>${solution.name}</strong><small>${solution.hint}</small>`;
		button.addEventListener('click', function () {
			checkAnswer(solution.id, button);
		});
		choices.appendChild(button);
	});
}

function checkAnswer(selectedAnswer, selectedButton) {
	if (answered) return;

    answered = true;
    clearInterval(timerId);   // <-- add this line: pauses the timer
    const scenario = scenarios[currentScenario];
	
	const isCorrect = selectedAnswer === scenario.correctAnswer;
	selectedButton.classList.add('selected');

	if (isCorrect) {
		score += 10;
		scoreDisplay.textContent = score;
		feedbackCard.className = 'feedback-card correct';

    modalIcon.textContent = '✅';

    modalTitle.textContent = 'Correct! +10 Points';

    modalMessage.textContent = scenario.explanation;

    modalFact.textContent =
      'Did you know? ' + scenario.fact;

    feedbackModal.classList.remove('hidden');
	} else {
    score = Math.max(0, score - 5);
    scoreDisplay.textContent = score;

    showPenaltyPopup();

    feedbackCard.className = 'feedback-card incorrect';

    modalIcon.textContent = '❌';

    modalTitle.textContent = 'Incorrect! -5 Points';

    modalMessage.textContent =
      `The best solution is ${getSolutionName(scenario.correctAnswer)}. ${scenario.explanation}`;

    modalFact.textContent =
      'Did you know? ' + scenario.fact;

    feedbackModal.classList.remove('hidden');
  }

	document.querySelectorAll('.choice-button').forEach(function (button) {
		button.disabled = true;
	});
}

function getSolutionName(solutionId) {
	const solution = solutions.find(function (item) {
		return item.id === solutionId;
	});
	return solution.name;
}

function showNextScenario() {
	currentScenario += 1;

	if (currentScenario >= scenarios.length) {
		showEndScreen();
		return;
	}

	showScenario();
}

function showPenaltyPopup() {
  scorePopup.classList.remove('hidden');
  scorePopup.classList.remove('show');

  void scorePopup.offsetWidth;

  scorePopup.classList.add('show');

  setTimeout(function () {
    scorePopup.classList.add('hidden');
    scorePopup.classList.remove('show');
  }, 1500);
}

function launchConfetti() {

  const colors = [
    '#ffc907',
    '#2e9df7',
    '#159a48',
    '#d94335',
    '#ffffff'
  ];

  for (let i = 0; i < 100; i++) {

    const piece = document.createElement('div');

    piece.classList.add('confetti');

    piece.style.left =
      Math.random() * 100 + 'vw';

    piece.style.backgroundColor =
      colors[Math.floor(
        Math.random() * colors.length
      )];

    piece.style.animationDelay =
      Math.random() * 1 + 's';


    confettiContainer.appendChild(piece);

    setTimeout(function () {
      piece.remove();
    }, 3000);
  }
}

function showEndScreen(message) {
	clearInterval(timerId);
	gameScreen.classList.add('hidden');
	endScreen.classList.remove('hidden');
	document.querySelector('#final-score').textContent = score;
	document.querySelector('#final-communities').textContent = Math.floor(score / 10);
	const communitiesHelped = Math.floor(score / 10);
  if (score >= 40) {
    launchConfetti();
  }

  if (message) {
    document.querySelector('#end-message').textContent = message;
  } else if (communitiesHelped === 4) {
    document.querySelector('#end-message').textContent =
      'Excellent work! Every community received the ideal water solution.';
  } else if (communitiesHelped >= 2) {
    document.querySelector('#end-message').textContent =
      'Great job. Several communities now have better access to clean water.';
  } else {
    document.querySelector('#end-message').textContent =
      'Every project starts with learning. Try again to help more communities.';
  }
}
