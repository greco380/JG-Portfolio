# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm start` - Start development server on http://localhost:3000
- `npm run build` - Create production build in `build/` directory
- `npm test` - Run test suite using Jest and React Testing Library
- `npm run eject` - Eject from Create React App (irreversible)

### Installation
- `npm install` - Install all dependencies
- Alternative: `uv pip install -r requirements.txt` (if using uv package manager)

## Project Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations and gradients
- **Animations**: Framer Motion for smooth transitions
- **3D Graphics**: Three.js for holographic globe rendering
- **Icons**: React Icons library
- **Scroll**: React Scroll for smooth navigation
- **Build Tool**: Create React App (CRA)

### Key Components Structure
The app follows a single-page application pattern with vertical sections:

1. **Navbar** - Navigation with smooth scrolling
2. **HeroSection** - Landing/intro section
3. **MissionSection** - Mission statement
4. **WhatIDoSection** - Skills/services overview
5. **HolographicGlobe** - Interactive 3D globe component (main feature)
6. **TimelineSection** - Career timeline
7. **ProjectsSection** - Portfolio projects
8. **PhilosophySection** - Personal philosophy
9. **NextSection** - Call to action
10. **Footer** - Contact information

### HolographicGlobe Component
The centerpiece component features:
- Canvas-based 3D globe rendering using land polygon data
- Web Worker for performance optimization
- Interactive dragging and auto-rotation
- Multiple display modes: vector, full, squish
- Embedded land polygon data for instant rendering
- Animation loop with requestAnimationFrame

### Styling System
- **Primary colors**: `#0f172a` (primary), `#4f46e5` (secondary), `#7c3aed` (accent)
- **Custom animations**: gradient-x, gradient-y, gradient-xy keyframes
- **Responsive design**: Mobile-first approach
- **Holographic effects**: CSS gradients and animations

### File Organization
- `src/App.tsx` - Main application component with section layout
- `src/components/` - Individual section components
- `src/index.css` - Global styles and Tailwind directives
- `public/` - Static assets including globe data files
- `tailwind.config.js` - Tailwind customization with animations

### Development Notes
- TypeScript strict mode enabled
- Uses React 18 features (concurrent rendering)
- Framer Motion for performance-optimized animations
- Canvas-based rendering for globe visualization
- Embedded data prevents external API dependencies
- React Router for navigation between pages
- Mobile-responsive timeline with vertical linear display
- Snake layout implemented in What's Next section with right-angle pathway lines
- Autonomous animations for What I Do and Projects sections
- Calendly integration for contact (TODO: update implementation later)