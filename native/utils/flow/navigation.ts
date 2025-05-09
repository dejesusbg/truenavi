import { calculateRoute, EdgeProps, getPlaces, NodeProps, PreferencesProps } from '~/services';
import { speak } from '~/utils/audio';
import t, { Locale } from '~/utils/text';
import { direction, flow, navigationNode, navigationStep } from './steps';
import { FlowDispatch, NavigationStep } from './types';

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
async function getRoute(destination: string, preferences: PreferencesProps) {
  const places = await getPlaces();

  // TODO: get actual nearest node as start
  const start = places.find((place) => place.name === 'entrada');
  const end = places.find((place) => place.name === destination);

  let steps = [navigationStep('start', destination)];

  if (preferences.weather) {
    // TODO: get actual rain chance
    steps.push(navigationStep('weather', '20 percent'));
  }

  let edges: EdgeProps[] = [],
    path: NodeProps[] = [];

  if (start && end && start !== end) {
    const route = await calculateRoute(start._id, end._id);

    if (route.success && route.data) {
      ({ edges, path } = route.data);

      steps.push(navigationStep('straight', `${edges[0].distance} meters`));

      // loop through the edges and calculate each step
      for (let i = 1; i < path.length - 1; i++) {
        const a = path[i - 1].coordinates;
        const b = path[i].coordinates;
        const c = path[i + 1] ? path[i + 1].coordinates : path[i].coordinates;

        const bearing1 = getBearing(a, b);
        const bearing2 = getBearing(b, c);

        const direction = getTurnDirection(bearing1, bearing2);
        const distance = edges[i].distance;

        if (direction !== 'straight') steps.push(navigationNode(direction, path[i]));

        // update last step distance if it was straight - otherwise add a straight step
        const lastStep = steps[steps.length - 1];
        if (lastStep.id === 'straight' && lastStep.value) {
          const newDistance = parseInt(lastStep.value.split(' ')[0]) + distance;
          lastStep.value = `${newDistance} meters`;
        } else {
          steps.push(navigationStep('straight', `${distance} meters`));
        }
      }
    }
  }

  steps.push(navigationStep('end', destination));
  console.log(steps);
  return { steps, path, edges };
}

// handle navigation instructions
export function speakNavigation(
  steps: NavigationStep[],
  index: number,
  locale: Locale,
  dispatch: FlowDispatch
) {
  const { id, value } = steps[index];
  const instructionText = `${t(direction[id].output, locale)} ${t(value, locale)}`;

  console.log(`[Navigation] ${instructionText}`);

  speak(t(instructionText, locale), locale, {
    onDone: () => {
      if (index < steps.length - 1) {
        // TODO: check actual navigation flow to go to next instruction
        setTimeout(() => dispatch({ type: 'NEXT_INSTRUCTION' }), 3000);
      } else {
        endNavigation(dispatch);
      }
    },
  });
}

// initialize navigation flow
export async function startNavigation(
  destination: string,
  preferences: PreferencesProps,
  dispatch: FlowDispatch
) {
  const { steps, path, edges } = await getRoute(destination, preferences);
  setTimeout(() => {
    if (edges.length) {
      dispatch({ type: 'SET_DESTINATION', payload: destination });
      dispatch({ type: 'SET_APP_STATE', payload: 'navigate' });
      dispatch({ type: 'SET_CONVERSATION_STATUS', payload: null });
      dispatch({ type: 'START_NAVIGATION', steps, path });
    } else {
      dispatch({ type: 'SET_CONVERSATION_STATUS', payload: 'speak' });
      dispatch({ type: 'SET_CURRENT_STEP', payload: flow.same_destination });
    }
  }, 3000);
}

// end navigation and return to conversation (delay)
export function endNavigation(dispatch: FlowDispatch) {
  setTimeout(() => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: flow.start });
    dispatch({ type: 'SET_APP_STATE', payload: 'start' });
    dispatch({ type: 'SET_CONVERSATION_STATUS', payload: 'speak' });
    dispatch({ type: 'END_NAVIGATION' });
  }, 3000);
}
