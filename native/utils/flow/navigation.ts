import { LocationObject } from 'expo-location';
import { calculateRoute, findClosest, findPlace, getWeather } from '~/services';
import { speak } from '~/utils/audio';
import t, { Locale } from '~/utils/text';
import { direction, flow, navigationStep } from './steps';
import { FlowDispatch, FlowState } from './types';

const NAVIGATION_DELAY = 3000; // delay for visual feedback
const DEFAULT_INITIAL_LOCATION = { latitude: 11.224301653902437, longitude: -74.18565012507534 };

/**
 * Calculates the initial bearing (forward azimuth) in degrees from the start point to the end point.
 *
 * The bearing is measured clockwise from true north and normalized to a value between 0 and 360 degrees.
 *
 * @param start - The starting point as a tuple of [latitude, longitude] in decimal degrees.
 * @param end - The ending point as a tuple of [latitude, longitude] in decimal degrees.
 * @returns The initial bearing from the start point to the end point, in degrees.
 */
function calculateBearing(start: [number, number], end: [number, number]): number {
  const DEG_TO_RAD = Math.PI / 180;
  const lat1 = start[0] * DEG_TO_RAD;
  const lon1 = start[1] * DEG_TO_RAD;
  const lat2 = end[0] * DEG_TO_RAD;
  const lon2 = end[1] * DEG_TO_RAD;

  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const bearing = Math.atan2(y, x);

  // normalize to 0-360 degrees
  return ((bearing * 180) / Math.PI + 360) % 360;
}

/**
 * Determines the turn direction between two bearings.
 *
 * Calculates the angular difference between `bearing1` and `bearing2` and returns a string
 * indicating the type of turn: `straight`, `slight-right`, `slight-left`, `right`, `left`,
 * `sharp-right`, `sharp-left`, or `u-turn`.
 *
 * @param bearing1 - The initial bearing in degrees (0-359).
 * @param bearing2 - The target bearing in degrees (0-359).
 * @returns A string representing the turn direction.
 */
function getTurnDirection(bearing1: number, bearing2: number): string {
  let change = (bearing2 - bearing1 + 360) % 360;
  if (change > 180) change -= 360;

  const absChange = Math.abs(change);
  const isRight = change > 0;

  if (absChange < 20) return 'straight';
  if (absChange < 45) return isRight ? 'slight-right' : 'slight-left';
  if (absChange < 100) return isRight ? 'right' : 'left';
  if (absChange < 160) return isRight ? 'sharp-right' : 'sharp-left';
  return 'u-turn';
}

/**
 * Calculates a navigation route from the user's current position to a specified destination.
 * Optionally includes weather information in the navigation steps.
 *
 * @param destination - The name of the destination place to navigate to.
 * @param includeWeather - Whether to include weather information in the navigation steps.
 * @returns An object containing the navigation steps, path, and edges for the route.
 *          If the route cannot be calculated, returns an empty route object.
 *
 * @remarks
 * - The function retrieves the user's current position and finds the closest start node.
 * - If weather information is requested, it fetches and appends temperature and rain data to the steps.
 * - The route is calculated between the start and end nodes, and navigation instructions are generated for each segment.
 * - Steps include origin, start, straight segments, turns, weather (if requested), and end.
 */

async function calculateNavigationRoute(destination: string, includeWeather: boolean) {
  const emptyRoute = { steps: [], path: [], edges: [] };

  console.log('[Route] Getting current position');
  // const location = await getCurrentPositionAsync(); // production
  const location = { coords: DEFAULT_INITIAL_LOCATION } as LocationObject; // development

  // find start and end nodes
  const start = await findClosest(location.coords);
  const end = await findPlace(destination);
  if (!start || !end || start === end) return emptyRoute;

  // initialize navigation steps
  let steps = [navigationStep('origin', start.name!), navigationStep('start', destination)];

  // add weather information if requested
  if (includeWeather) {
    console.log('[Route] Fetching weather');
    const { temperature, rain } = await getWeather(location.coords);
    steps.push(navigationStep('temperature', `${temperature} celsius`));
    steps.push(navigationStep('rain', `${rain} percent`));
  }

  // calculate the route
  console.log('[Route] Calculating route');
  const route = await calculateRoute(start._id, end._id);
  if (!route.success || !route.data) return emptyRoute;

  const { edges, path } = route.data;

  // add first straight section
  steps.push(navigationStep('straight', `${edges[0].distance} meters`, path[0], path[1]));

  // process each path segment to build navigation instructions
  for (let i = 1; i < path.length - 1; i++) {
    const prevNode = path[i - 1].coordinates;
    const currentNode = path[i].coordinates;
    const nextNode = path[i + 1].coordinates;

    const incomingBearing = calculateBearing(prevNode, currentNode);
    const outgoingBearing = calculateBearing(currentNode, nextNode);
    const turnDirection = getTurnDirection(incomingBearing, outgoingBearing);
    const distance = edges[i].distance;

    // add turn instruction if not going straight
    if (turnDirection !== 'straight') {
      steps.push(navigationStep(turnDirection, '', path[i]));
    }

    // update distance for next straight segment
    const lastStep = steps[steps.length - 1];

    if (lastStep.id === 'straight') {
      // combine with previous straight segment
      const currentDistance = parseInt(lastStep.value.split(' ')[0]);
      lastStep.value = `${currentDistance + distance} meters`;
      lastStep.end = path[i + 1];
    } else {
      // add new straight segment
      steps.push(navigationStep('straight', `${distance} meters`, path[i], path[i + 1]));
    }
  }

  steps.push(navigationStep('end', destination));
  return { steps, path, edges };
}

/**
 * Speaks the current navigation instruction based on the provided flow state and locale.
 *
 * This function retrieves the current navigation step, constructs the instruction text using
 * localized strings, and uses the `speak` function to vocalize the instruction.
 * After the instruction is spoken, it either advances to the next instruction or ends the
 * navigation, depending on the current navigation index.
 *
 * @param state - The current flow state containing navigation steps and index.
 * @param locale - The locale to use for localization of instruction text.
 * @param dispatch - The dispatch function to update the flow state.
 */
export function speakNavigationInstruction(
  state: FlowState,
  locale: Locale,
  dispatch: FlowDispatch
) {
  const { navigationSteps, navigationIndex } = state;
  const { id, value } = navigationSteps[navigationIndex];
  const instructionText = `${t(direction[id].output, locale)} ${t(value, locale)}`;

  console.log(`[Navigation] ${instructionText}`);

  speak(t(instructionText, locale), locale, {
    onDone: () => {
      if (navigationIndex < navigationSteps.length - 1) {
        // TODO: check actual navigation flow and nodes to go to next instruction
        setTimeout(() => dispatch({ type: 'NEXT_INSTRUCTION' }), NAVIGATION_DELAY);
      } else {
        endNavigation(dispatch);
      }
    },
  });
}

/**
 * Starts the navigation process to a specified destination, optionally considering weather conditions.
 *
 * This function calculates the navigation route asynchronously and, after a delay, dispatches
 * actions to update the application state based on whether a valid route was found.
 *
 * @param destination - The target destination for navigation.
 * @param weather - Whether to consider weather conditions in route calculation.
 * @param dispatch - The dispatch function to update the navigation flow state.
 *
 * @returns A promise that resolves when the navigation process has been initiated.
 */
export async function startNavigation(
  destination: string,
  weather: boolean,
  dispatch: FlowDispatch
) {
  const { steps, path, edges } = await calculateNavigationRoute(destination, weather);
  setTimeout(() => {
    if (edges.length) {
      // valid route exists - begin navigation
      dispatch({ type: 'SET_DESTINATION', payload: destination });
      dispatch({ type: 'SET_APP_STATE', payload: 'navigate' });
      dispatch({ type: 'SET_CONVERSATION_STATUS', payload: null });
      dispatch({ type: 'START_NAVIGATION', steps, path });
    } else {
      // no valid route - fallback to conversation
      dispatch({ type: 'SET_CONVERSATION_STATUS', payload: 'speak' });
      dispatch({ type: 'SET_CURRENT_STEP', payload: flow.no_route });
    }
  }, NAVIGATION_DELAY);
}

/**
 * Ends the current navigation flow after a 3-second delay.
 *
 * This function dispatches a series of actions to reset the navigation state:
 * - Sets the current step to the start of the flow.
 * - Sets the application state to 'start'.
 * - Sets the conversation status to 'speak'.
 * - Dispatches the 'END_NAVIGATION' action.
 *
 * @param dispatch - The dispatch function used to send actions to the flow reducer.
 */
export function endNavigation(dispatch: FlowDispatch) {
  setTimeout(() => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: flow.start });
    dispatch({ type: 'SET_APP_STATE', payload: 'start' });
    dispatch({ type: 'SET_CONVERSATION_STATUS', payload: 'speak' });
    dispatch({ type: 'END_NAVIGATION' });
  }, NAVIGATION_DELAY);
}
