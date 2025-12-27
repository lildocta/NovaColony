import { useState } from 'react';
import Launcher from './Launcher';
import type { Program } from './types/Program';
import HelloWorld from './programs/HelloWorld';
import Counter from './programs/Counter';
import ProgramContainer from './components/ProgramContainer';
import { GlobeAltIcon, CalculatorIcon } from '@heroicons/react/24/outline';

// Registry of available programs
const AVAILABLE_PROGRAMS: Program[] = [
  {
    id: 'hello-world',
    name: 'Hello World',
    icon: GlobeAltIcon,
    component: HelloWorld,
  },
  {
    id: 'counter',
    name: 'Counter',
    icon: CalculatorIcon,
    component: Counter,
  },
  // Add more programs here
];

function App() {
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);

  const handleLaunch = (program: Program) => {
    setActiveProgramId(program.id);
  };

  const handleExit = () => {
    setActiveProgramId(null);
  };

  const ActiveProgram = AVAILABLE_PROGRAMS.find((p) => p.id === activeProgramId);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 selection:text-cyan-200">
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

export default App;
