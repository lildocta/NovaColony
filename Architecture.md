# Architecture & Design Decisions

## Design System: Spaceship Control Interface

### Core Principles
- **Aesthetic**: Sci-fi, utilitarian, holographic, high-contrast.
- **Colors**: Deep space blues/blacks, glowing cyans/ambers/greens for interactive elements.
- **Typography**: Monospace or technical sans-serif fonts.
- **Visual Effects**: Subtle CRT scanlines, glowing borders, glassmorphism.

### Component Guidelines

#### 1. Program Container
ALL programs must run within a standardized `ProgramContainer`.
- **Header**: Contains program title and window controls (Exit).
- **Body**: The main content area of the program.
- **Footer**: Status indicators or system info.
- **Consistency**: Programs should not implement their own "window" frames.

#### 2. Icons
- Use **Heroicons** (`@heroicons/react`) for all UI iconography.
- Icons should generally be outlined or have a "holographic" stroke appearance.

### Technical Architecture

#### Program Interface
Programs are React components that receive standard props from the OS/Launcher.
```typescript
interface ProgramProps {
  onExit: () => void;
  // potentially other OS-injected props like windowState, fileSystem, etc.
}
```

#### Toast Notifications
When a program needs to notify the user of an event, it should use the `notify` function from the `utils/notifications` module.
import { notify } from './utils/notifications';
