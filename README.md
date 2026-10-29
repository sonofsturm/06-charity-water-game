# H2gO: Clean Water Challenge (React)

An interactive educational clean water planner game built with React, TypeScript, and Vite, inspired by charity: water's global clean water mission.

## Key Features & Brand Experience

### 1. Score Milestone Celebratory Notifications
- **Array of Milestones**: Configured in an array (`milestones` in `src/data.ts`) with specific score thresholds, badges, titles, and educational affirmations:
  - **10 Points** (`🌟 First Breakthrough`): *"First Community Transformed! Clean water is now flowing. You’ve taken your first step toward ending the water crisis!"*
  - **20 Points** (`⚡ Momentum Builder`): *"Halfway Mark Reached! Two communities now have sustainable clean water sources. Thousands of hours saved!"*
  - **35 Points** (`🌊 Clean Water Champion`): *"Major Watershed Milestone! Your thoughtful planning has empowered over 2,000 community members with clean water!"*
  - **50 Points** (`🏆 Master Water Strategist`): *"Exceptional Impact! Unbelievable field execution! You’ve balanced natural ecosystems and solved community challenges!"*
- **Conditional Triggering**: Evaluated dynamically whenever a player earns points from site purifications (+5 pts) or successful community solutions (+10 pts).
- **Celebratory Toast Banner**: Slides smoothly from the top without obstructing buttons or violating the mobile single-screen constraint, equipped with an optional manual dismiss button and automatic 4-second timeout.

### 2. The Clean Water Transformation Surge
- **Instant Visual Reward**: When the correct engineering solution is selected, a 1.2s dynamic blue water surge sweeps across the community landscape photo.
- **Celebratory Status**: Displays `"💧 Clean Water is Flowing!"` along with live counters of people reached and daily hours saved before the educational debrief modal opens.

### 3. Tangible Human Impact Metrics & Animated Jerry Can Meter
- **Real-World Impact Tracking**: Translates abstract score numbers into tangible human outcomes based on real charity: water field metrics:
  - 👥 **People Empowered**: Accumulates the exact population of each community helped (up to 3,550 people).
  - ⏱️ **Daily Walking Time Saved**: Calculates daily hours returned to mothers and children (up to ~13.8 hours/day).
- **Animated Jerry Can Water Meter**: A signature yellow Jerry Can in the HUD fills with clean water (0% $\rightarrow$ 100%) as each community's water system comes online.
- **End Screen Impact Showcase**: A dedicated impact board breaking down total people empowered, daily walking time saved, and water reservoir filled.

### 4. Tactile Web Audio Synthesizer (Zero-Latency)
- Native Web Audio API synthesizer:
  - 🫧 **Water Droplet Pop**: Crisp audio cue when removing hazardous contaminants.
  - ⚠️ **Warning Tone**: Subtle low-frequency acoustic cue when tapping protected natural assets or incorrect solutions.
  - 🌊 **Clean Water Melodic Chime**: Celebratory arpeggio and splash sound during the clean water surge.
  - 🎺 **Victory Fanfare**: Harmonious chord sequence when completing the challenge.
- **Audio Toggle**: Persistent `[ 🔊 Sound / 🔇 Muted ]` header button.

### 5. Brand Typography & Aesthetics
- Direct adherence to charity: water's official Brand Usage Guide typography (**Proxima Nova** / Google Font **Montserrat**).
- Classic brand palette: Jerry Can Yellow (`#ffc907`), Deep Ocean Blue (`#12334b`), Sky Blue (`#2e9df7`), and Warm Cream (`#fffdf4`).

### 6. Dedicated Real-World Impact & Donation Screen
- Accessible from both Start and End screens with zero scrolling required on mobile (`100dvh`).
- Links directly to charity: water’s donation page (`/donate`), monthly giving (`/the-spring`), and project mapping (`/our-approach`).

### 7. 3 Calibrated Difficulty Modes
- **Field Apprentice (Casual)**: 60s overall clock, full solution hints visible, unlimited Jerry Cans.
- **Project Planner (Standard)**: 45s clock, hints hidden, 3 Jerry Can lives.
- **Rapid Response (Crisis Mode)**: High-stakes 15s per-community countdown, 2 Jerry Can lives, -10 penalty.

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Tooling**: Vite
- **Audio**: Web Audio API (native, zero assets needed)
- **Styling**: Responsive custom CSS preserving the charity: water brand aesthetic
