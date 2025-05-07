import { InstructionStep, NavigationStep } from './types';

const createInstruction = (icon: string, output: string): InstructionStep => ({ icon, output });
export const createNavigation = (id: string, value: string = ''): NavigationStep => ({ id, value });

export const direction: Record<string, InstructionStep> = {
  start: createInstruction('navigation', 'going to your destination'),
  left: createInstruction('turn-left', 'turn to the left'),
  right: createInstruction('turn-right', 'turn to the right'),
  leftish: createInstruction('turn-slight-left', 'turn slightly to the left'),
  rightish: createInstruction('turn-slight-right', 'turn slightly to the right'),
  straight: createInstruction('arrow-upward', 'go straight'),
  reroute: createInstruction('auto-awesome', 'rerouting'),
  weather: createInstruction('cloud', 'rain chance of'),
  end: createInstruction('place', 'your destination is here'),
};

// mock navigation
export const sampleNavigation: NavigationStep[] = [
  createNavigation('weather', '20 percent'),
  createNavigation('straight', '50 meters'),
  createNavigation('right'),
  createNavigation('straight', '100 meters'),
  createNavigation('leftish'),
  createNavigation('straight', '20 meters'),
];
