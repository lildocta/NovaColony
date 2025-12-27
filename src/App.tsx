import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Launcher from './Launcher';
import type { Program } from './types/Program';
import { PermissionLevel } from './types/User';
import HelloWorld from './programs/HelloWorld';
import Counter from './programs/Counter';
import ThemeProgram from './programs/Theme';
import LoginProgram from './programs/Login';
import StarMap from './programs/StarMap';
import Reactor from './programs/Reactor';
import ProgramContainer from './components/ProgramContainer';
import { GameProvider } from './context/GameContext';
import { AuthProvider } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';
import { GlobeAltIcon, CalculatorIcon, PaintBrushIcon, KeyIcon, MapIcon, BoltIcon } from '@heroicons/react/24/outline';
import HUD from './components/HUD';

// Registry of available programs
// Note: We cast permission levels to number to matches the interface requirements if needed, 
// or ensure Program interface allows the const values.
const AVAILABLE_PROGRAMS: Program[] = [
  {
    id: 'starmap',
    name: 'Nav-Com',
    icon: MapIcon,
    component: StarMap,
    minPermissionLevel: PermissionLevel.CREW,
  },
  {
    id: 'reactor',
    name: 'Reactor',
    icon: BoltIcon,
    component: Reactor,
    minPermissionLevel: PermissionLevel.CREW,
  },
  {
    id: 'comms',
    name: 'Comms',
    icon: GlobeAltIcon,
    component: () => <div className="p-8 text-center text-theme-primary animate-pulse">Comms Uplink Offline...</div>,
    minPermissionLevel: PermissionLevel.OFFICER,
  },
  {
    id: 'counter',
    name: 'Counter',
    icon: CalculatorIcon,
    component: Counter,
    minPermissionLevel: PermissionLevel.CREW,
  },
  {
    id: 'login',
    name: 'Login / Identity',
    icon: KeyIcon,
    component: LoginProgram,
    minPermissionLevel: PermissionLevel.GUEST,
  },
  {
    id: 'hello-world',
    name: 'Hello World',
    icon: GlobeAltIcon,
    component: HelloWorld,
    minPermissionLevel: PermissionLevel.GUEST,
  },
  {
    id: 'theme',
    name: 'Theme Settings',
    icon: PaintBrushIcon,
    component: ThemeProgram,
    minPermissionLevel: PermissionLevel.COMMANDER,
  },
  // Add more programs here
];

function AppContent() {
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);

  // Initialize theme side-effects
  useTheme();

  const handleLaunch = (program: Program) => {
    setActiveProgramId(program.id);
  };

  const handleExit = () => {
    setActiveProgramId(null);
  };

  const ActiveProgram = AVAILABLE_PROGRAMS.find((p) => p.id === activeProgramId);

  return (
    <div className="min-h-screen bg-theme-bg text-gray-100 selection:bg-theme-primary/30 selection:text-theme-primary">
      <HUD />
      {ActiveProgram ? (
        <ProgramContainer title={ActiveProgram.name} onExit={handleExit}>
          <ActiveProgram.component onExit={handleExit} />
        </ProgramContainer>
      ) : (
        <Launcher programs={AVAILABLE_PROGRAMS} onLaunch={handleLaunch} />
      )}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AuthProvider>
        <AppContent />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName={() => "relative flex p-1 min-h-16 rounded-md justify-between overflow-hidden cursor-pointer bg-theme-surface border border-theme-primary/50 shadow-[0_0_15px_rgba(var(--theme-primary),0.3)] backdrop-blur-md mb-4"}
        />
      </AuthProvider>
    </GameProvider>
  );
}

export default App;
