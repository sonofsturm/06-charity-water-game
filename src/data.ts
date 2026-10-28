import { Scenario, Solution } from './types';

export const initialScenarios: Scenario[] = [
  {
    region: 'Drylands',
    title: 'A reliable source for Kijiji',
    icon: '☀️',
    image: '/img/Desert.png',
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
    image: '/img/Mountain.png',
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
    image: '/img/Desalination.png',
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
    image: '/img/Tropical.png',
    description: 'This community receives heavy seasonal rainfall. Families need a way to save clean rainwater for the drier weeks between storms.',
    climate: 'Wet and rainy',
    source: 'Frequent rainfall',
    population: '950 people',
    correctAnswer: 'rainwater',
    explanation: 'Rainwater collection stores rainfall during storms so families have a clean water supply when the weather becomes dry.',
    fact: 'Collecting rain can help a community prepare for the dry season instead of waiting for the next storm.'
  }
];

export const solutions: Solution[] = [
  { id: 'well', icon: '🪣', name: 'Community well', hint: 'Reach water below the ground' },
  { id: 'pipeline', icon: '🔧', name: 'Pipeline', hint: 'Move water from a source' },
  { id: 'rainwater', icon: '💧', name: 'Rainwater collection', hint: 'Save water from storms' },
  { id: 'filtration', icon: '🫗', name: 'Filtration system', hint: 'Make water safer to drink' }
];
