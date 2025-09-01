# Sacred Shifter

## Project Overview

**Sacred Shifter** is a consciousness transformation platform built as a web application. It provides tools for spiritual growth, community connection, and personal development through various interactive modules including journaling, meditation, sacred geometry visualization, and community circles.

**Tech Stack:**
- **Frontend:** React 18.3.1, TypeScript 5.5.3, Vite 7.1.3
- **UI Framework:** Tailwind CSS 3.4.11, shadcn/ui components, Framer Motion 12.23.11
- **3D Graphics:** Three.js 0.179.1, React Three Fiber 8.18.0, React Three Drei 9.122.0
- **Backend:** Supabase (PostgreSQL database, authentication, edge functions)
- **State Management:** Zustand 5.0.8, XState 5.20.2, TanStack Query 5.56.2
- **Audio:** Tone.js 15.1.22
- **Testing:** Vitest 3.2.4, Testing Library, Canvas mock
- **Mobile:** Capacitor 7.4.3 (iOS/Android support)

**Architecture:**
- **Frontend Modules:** Modular React components organized by feature (meditation, journaling, circles, etc.)
- **Backend Services:** Supabase edge functions for AI integration, autonomous systems, and real-time features
- **Database:** PostgreSQL with Row Level Security (RLS) policies for data protection
- **Real-time:** Supabase subscriptions for live updates
- **3D Visualization:** WebGL-based sacred geometry and frequency visualization components

## Current State

### ✅ Implemented Features

**Authentication & Profiles:**
- [x] Email/password authentication via Supabase Auth
- [x] User profiles with display names and avatars
- [x] Role-based access control (admin/user roles)
- [x] Protected routes and authentication guards

**Core Modules:**
- [x] **Home Dashboard** - Central navigation and user activity overview
- [x] **Sacred Feed** - Unified activity stream from all platform areas
- [x] **Circles** - Community groups with posts, chakra alignment, and frequency tracking
- [x] **Mirror Journal** - Personal reflection and consciousness journaling
- [x] **Grove (3D Modules)** - Interactive 3D learning experiences
- [x] **Meditation** - Guided meditation with frequency visualization and sacred geometry
- [x] **Support** - Donation system via Stripe integration

**Advanced Features:**
- [x] **Akashic Constellation** - 3D knowledge visualization and storage system
- [x] **Registry of Resonance** - Wisdom sharing and community knowledge base
- [x] **Hermetic Principles** - Interactive 3D lessons on universal laws
- [x] **Sacred Geometry Visualization** - WebGL-powered geometric animations
- [x] **Frequency-based UI** - Audio-reactive interface elements
- [x] **Theme System** - Dark/light mode with semantic color tokens

**AI & Autonomous Systems:**
- [x] **Aura AI Assistant** - Autonomous platform intelligence
- [x] **Auto-generation** - AI-powered content creation and system improvements
- [x] **Community Sensing** - Automated community health monitoring
- [x] **Initiative Queue** - Self-directed AI task management

**Technical Infrastructure:**
- [x] **Responsive Design** - Mobile-first approach with Tailwind CSS
- [x] **Component Library** - Reusable shadcn/ui components with custom variants
- [x] **Real-time Updates** - Live data synchronization via Supabase
- [x] **Error Handling** - Comprehensive error boundaries and user feedback
- [x] **Performance Optimization** - Code splitting, lazy loading, and caching

### ⚠️ Known Limitations

- **Database Tables:** Some advanced features reference tables that may not exist in all environments
- **Mobile Optimization:** While responsive, some 3D modules may have performance constraints on mobile
- **Edge Functions:** Autonomous AI systems require proper Supabase configuration
- **Audio Features:** Browser audio permissions may affect meditation and frequency features

### 🔬 Experimental Features

- **Liberation Module** - Advanced consciousness exploration (3D environments)
- **Sonic Shifter** - Audio-based transformation tools  
- **Dreamscape Analysis** - Sleep and dream pattern tracking
- **Quantum Consciousness** - Advanced metaphysical concepts visualization

## Planned Enhancements

### [In Progress]
- [ ] Enhanced mobile app experience via Capacitor
- [ ] Advanced AI personality development for Aura
- [ ] Real-time collaboration features in Circles
- [ ] Expanded meditation library with guided sessions

### [Planned]
- [ ] Video content integration and streaming
- [ ] Advanced analytics and insights dashboard
- [ ] Social features and friend connections
- [ ] Offline mode support for core features
- [ ] Integration with wearable devices for biometric tracking
- [ ] Advanced search and discovery features
- [ ] Multi-language support

### [Future Consideration]
- [ ] VR/AR integration for immersive experiences
- [ ] Blockchain integration for decentralized features
- [ ] Advanced AI counseling and guidance systems
- [ ] Integration with external meditation and wellness platforms

## Developer Setup

### Prerequisites
- **Node.js** 18+ (recommended: use nvm)
- **npm** or **pnpm** package manager
- **Supabase** account and project setup
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd sacred-shifter

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables (.env)

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_PROJECT_ID=your-project-id

# Optional: AI and Integration Keys
# (Add as needed for advanced features)
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build with development settings
npm run preview      # Preview production build
npm run test         # Run test suite
npm run test:ui      # Run tests with UI
npm run lint         # Run ESLint
```

## Contributing & Standards

### Branching Model
- **main** - Production-ready code
- **develop** - Integration branch for features
- **feature/**** - Individual feature development
- **hotfix/**** - Critical bug fixes

### Commit Message Guidelines
Follow conventional commits format:
```
feat: add new meditation module
fix: resolve audio playback issues
docs: update README installation steps
style: improve mobile responsiveness
refactor: optimize 3D rendering performance
```

### Code Standards
- **TypeScript** - Strict type checking enabled
- **ESLint** - Configured with React and accessibility rules
- **Prettier** - Consistent code formatting
- **Component Structure** - Modular, reusable components
- **Semantic HTML** - Accessibility-first approach
- **CSS-in-JS** - Tailwind utility classes with semantic tokens

### Testing
- **Unit Tests** - Vitest for component and utility testing
- **Integration Tests** - Testing Library for user interaction flows
- **3D Testing** - Canvas mock for Three.js component testing
- **Coverage** - Minimum 70% test coverage for critical paths

## Project Roadmap Snapshot

### Core Platform
- [x] User authentication and profiles
- [x] Community circles and posting
- [x] Personal journaling system
- [x] Meditation and visualization tools
- [x] 3D learning modules
- [x] AI assistant integration
- [ ] Advanced mobile app features
- [ ] Real-time collaboration tools

### Content & Learning
- [x] Hermetic principles interactive lessons
- [x] Sacred geometry visualizations
- [x] Knowledge sharing system
- [ ] Video content library
- [ ] Guided meditation expansion
- [ ] Advanced metaphysical concepts

### Technical Infrastructure
- [x] Responsive design system
- [x] Real-time data synchronization
- [x] AI-powered autonomous systems
- [x] Performance optimization
- [ ] Offline mode support
- [ ] Advanced caching strategies
- [ ] Scalability improvements

### Community Features
- [x] Circle-based communities
- [x] Unified activity feed
- [x] User profiles and roles
- [ ] Social connections and messaging
- [ ] Event planning and coordination
- [ ] Advanced moderation tools

## License and Credits

### License
This project is private and proprietary. All rights reserved.

### Credits & Acknowledgments

**Frameworks & Libraries:**
- React Team for React and React DOM
- Vercel for Next.js ecosystem inspiration
- shadcn for the component design system
- Three.js team for 3D graphics capabilities
- Supabase for backend-as-a-service
- Tailwind Labs for the CSS framework

**Special Recognition:**
- Sacred geometry principles from ancient wisdom traditions
- Hermetic philosophy and universal laws
- Open source community for foundational tools and libraries

**Development Team:**
- Core platform architecture and implementation
- AI system design and integration
- 3D visualization and interactive experiences
- Community features and user experience design

---

*"In resonance, we rise. In unity, we transcend."*

Last updated: August 2025