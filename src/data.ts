import { Scenario, Solution, DifficultyConfig, Milestone } from './types';

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
    peopleCount: 800,
    dailyHoursSaved: 4.5,
    correctAnswer: 'well',
    explanation: 'A well can reach the underground aquifer and give the community a reliable local source of clean water.',
    fact: 'Reliable nearby water can reduce the time families spend walking to collect water.',
    obstacles: [
      // 3 Bad (Hazards to clear)
      { id: 'sediment', icon: '🪨', label: 'Deep Sediment', type: 'hazard' },
      { id: 'sand', icon: '🏜️', label: 'Surface Sand', type: 'hazard' },
      { id: 'evaporation', icon: '☀️', label: 'Evaporation Loss', type: 'hazard' },
      // 3 Good (Beneficial assets to protect)
      { id: 'aquifer', icon: '💧', label: 'Aquifer Vein', type: 'benefit' },
      { id: 'sandstone', icon: '🧱', label: 'Sandstone Bed', type: 'benefit' },
      { id: 'acacia', icon: '🌱', label: 'Acacia Roots', type: 'benefit' }
    ]
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
    peopleCount: 1200,
    dailyHoursSaved: 3.8,
    correctAnswer: 'pipeline',
    explanation: 'A pipeline can carry water from the spring to homes across the valley without requiring a long daily walk.',
    fact: 'When water is closer to home, people have more time for school, work, and family.',
    obstacles: [
      // 3 Bad (Hazards to clear)
      { id: 'boulders', icon: '🪨', label: 'Valley Rocks', type: 'hazard' },
      { id: 'silt', icon: '🍂', label: 'Mountain Silt', type: 'hazard' },
      { id: 'incline', icon: '⚠️', label: 'Steep Incline', type: 'hazard' },
      // 3 Good (Beneficial assets to protect)
      { id: 'spring', icon: '🏔️', label: 'Fresh Spring', type: 'benefit' },
      { id: 'moss', icon: '🌿', label: 'Alpine Moss', type: 'benefit' },
      { id: 'trout', icon: '🐟', label: 'Native Trout', type: 'benefit' }
    ]
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
    peopleCount: 600,
    dailyHoursSaved: 3.0,
    correctAnswer: 'filtration',
    explanation: 'A filtration system can remove contaminants and make the available water safer for the community to use.',
    fact: 'Clean water access supports healthier communities and helps prevent waterborne illness.',
    obstacles: [
      // 3 Bad (Hazards to clear)
      { id: 'salinity', icon: '🧂', label: 'High Salinity', type: 'hazard' },
      { id: 'microbes', icon: '🦠', label: 'Brackish Bacteria', type: 'hazard' },
      { id: 'algae', icon: '🧪', label: 'Toxic Algae', type: 'hazard' },
      // 3 Good (Beneficial assets to protect)
      { id: 'mangrove', icon: '🌿', label: 'Mangrove Buffer', type: 'benefit' },
      { id: 'oyster', icon: '🦪', label: 'Oyster Reef', type: 'benefit' },
      { id: 'estuary', icon: '🌊', label: 'Fresh Estuary', type: 'benefit' }
    ]
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
    peopleCount: 950,
    dailyHoursSaved: 2.5,
    correctAnswer: 'rainwater',
    explanation: 'Rainwater collection stores rainfall during storms so families have a clean water supply when the weather becomes dry.',
    fact: 'Collecting rain can help a community prepare for the dry season instead of waiting for the next storm.',
    obstacles: [
      // 3 Bad (Hazards to clear)
      { id: 'debris', icon: '🪵', label: 'Rotting Debris', type: 'hazard' },
      { id: 'mud', icon: '🌧️', label: 'Muddy Runoff', type: 'hazard' },
      { id: 'larvae', icon: '🦟', label: 'Mosquito Larvae', type: 'hazard' },
      // 3 Good (Beneficial assets to protect)
      { id: 'canopy', icon: '🌴', label: 'Canopy Filter', type: 'benefit' },
      { id: 'reeds', icon: '🌾', label: 'Wetland Reeds', type: 'benefit' },
      { id: 'brook', icon: '💧', label: 'Clean Brook', type: 'benefit' }
    ]
  }
];

export const solutions: Solution[] = [
  { id: 'well', icon: '🪣', name: 'Community well', hint: 'Reach water below the ground' },
  { id: 'pipeline', icon: '🔧', name: 'Pipeline', hint: 'Move water from a source' },
  { id: 'rainwater', icon: '💧', name: 'Rainwater collection', hint: 'Save water from storms' },
  { id: 'filtration', icon: '🫗', name: 'Filtration system', hint: 'Make water safer to drink' }
];

export const difficulties: Record<'apprentice' | 'planner' | 'expert', DifficultyConfig> = {
  apprentice: {
    id: 'apprentice',
    name: 'Field Apprentice',
    badge: 'Casual',
    tagline: 'Learn the fundamentals with full guidance',
    description: '60s overall clock • Helpful hints visible • Unlimited Jerry Cans',
    timerMode: 'global',
    initialTime: 60,
    showHints: true,
    lives: null,
    penaltyPoints: 5,
    minPassCommunities: 1
  },
  planner: {
    id: 'planner',
    name: 'Project Planner',
    badge: 'Standard',
    tagline: 'Balanced challenge for strategic thinkers',
    description: '45s overall clock • No hints • 3 Jerry Can lives • Goal: 3+ communities',
    timerMode: 'global',
    initialTime: 45,
    showHints: false,
    lives: 3,
    penaltyPoints: 5,
    minPassCommunities: 3
  },
  expert: {
    id: 'expert',
    name: 'Rapid Response',
    badge: 'Crisis Mode',
    tagline: 'High-stakes emergency disaster relief',
    description: '15s per community • No hints • 2 Jerry Can lives • -10 penalty • Goal: 4/4',
    timerMode: 'per-community',
    initialTime: 15,
    showHints: false,
    lives: 2,
    penaltyPoints: 10,
    minPassCommunities: 4
  }
};

export const milestones: Milestone[] = [
  {
    scoreThreshold: 10,
    badge: '🌟 First Breakthrough',
    title: 'First Community Transformed!',
    message: 'Clean water is now flowing. You’ve taken your first step toward ending the water crisis!'
  },
  {
    scoreThreshold: 20,
    badge: '⚡ Momentum Builder',
    title: 'Halfway Mark Reached!',
    message: 'Two communities now have sustainable clean water sources. Thousands of hours saved!'
  },
  {
    scoreThreshold: 35,
    badge: '🌊 Clean Water Champion',
    title: 'Major Watershed Milestone!',
    message: 'Your thoughtful planning has empowered over 2,000 community members with clean water!'
  },
  {
    scoreThreshold: 50,
    badge: '🏆 Master Water Strategist',
    title: 'Exceptional Impact!',
    message: 'Unbelievable field execution! You’ve balanced natural ecosystems and solved community challenges!'
  }
];

