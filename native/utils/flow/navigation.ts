import { calculateRoute, getPlaces, PreferencesProps } from '~/services';
import { InstructionStep, NavigationStep } from './types';

const createInstruction = (icon: string, output: string): InstructionStep => ({ icon, output });
const createNavigation = (id: string, value: string = ''): NavigationStep => ({ id, value });

export const direction: Record<string, InstructionStep> = {
  start: createInstruction('explore', 'going to'),
  left: createInstruction('turn-left', 'please, turn to the left'),
  right: createInstruction('turn-right', 'please, turn to the right'),
  'slight-left': createInstruction('turn-slight-left', 'turn slightly to the left'),
  'slight-right': createInstruction('turn-slight-right', 'turn slightly to the right'),
  'sharp-left': createInstruction('rotate-left', 'make a sharp left turn'),
  'sharp-right': createInstruction('rotate-right', 'make a sharp right turn'),
  'u-turn': createInstruction('u-turn-right', 'please, make a u-turn'),
  straight: createInstruction('arrow-upward', 'go straight'),
  reroute: createInstruction('auto-awesome', 'hold up, rerouting quickly'),
  weather: createInstruction('cloud', 'rain chance of'),
  end: createInstruction('place', 'you have arrived to'),
};

// function to calculate bearing between two coordinates
function getBearing(start: [number, number], end: [number, number]): number {
  const DEG_TO_RAD = Math.PI / 180;
  const lat1 = start[0] * DEG_TO_RAD;
  const lon1 = start[1] * DEG_TO_RAD;
  const lat2 = end[0] * DEG_TO_RAD;
  const lon2 = end[1] * DEG_TO_RAD;

  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const bearing = Math.atan2(y, x);

  return ((bearing * 180) / Math.PI + 360) % 360; // normalize to 0-360 degrees
}

// function to determine turn direction based on bearing change
function getTurnDirection(bearing1: number, bearing2: number): string {
  let change = (bearing2 - bearing1 + 360) % 360;
  if (change > 180) change -= 360;

  const absChange = Math.abs(change);

  if (absChange < 20) return 'straight';
  else if (absChange < 45) return change > 0 ? 'slight-right' : 'slight-left';
  else if (absChange < 100) return change > 0 ? 'right' : 'left';
  else if (absChange < 160) return change > 0 ? 'sharp-right' : 'sharp-left';
  else return 'u-turn';
}

// TODO: add special nodes id to check on them and follow navigation flow
export async function getRoute(destination: string, preferences: PreferencesProps) {
  const places = await getPlaces();

  // TODO: get actual nearest node as start
  const start = places.find((place) => place.name === 'entrada');
  const end = places.find((place) => place.name === destination);

  let steps = [createNavigation('start', destination)];

  if (preferences.weather) {
    // TODO: get actual rain chance
    steps.push(createNavigation('weather', '20 percent'));
  }

  if (start && end && start !== end) {
    const route = await calculateRoute(start._id, end._id);

    if (route.success && route.data) {
      const { edges, path } = route.data;
      steps.push(createNavigation('straight', `${edges[0].distance} meters`));

      // loop through the edges and calculate each step
      for (let i = 1; i < path.length - 1; i++) {
        const start = path[i - 1].coordinates;
        const end = path[i].coordinates;

        const bearing1 = getBearing(start, end);
        const bearing2 = getBearing(
          path[i].coordinates,
          path[i + 1] ? path[i + 1].coordinates : path[i].coordinates
        );

        const direction = getTurnDirection(bearing1, bearing2);
        const distance = edges[i].distance;

        if (direction !== 'straight') steps.push(createNavigation(direction));

        // update last step distance if it was straight - otherwise add a straight step
        const lastStep = steps[steps.length - 1];
        if (lastStep.id === 'straight') {
          const newDistance = parseInt(lastStep.value.split(' ')[0]) + distance;
          lastStep.value = `${newDistance} meters`;
        } else {
          steps.push(createNavigation('straight', `${distance} meters`));
        }
      }
    }
  }

  steps.push(createNavigation('end', destination));
  console.log(steps);
  return steps;
}
