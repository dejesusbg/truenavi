import { ConversationView, NavigationView, PermissionView } from '~/components/views';
import { useFlowReducer } from '~/utils/flow';

/**
 * The `Home` component serves as the main entry point for the application UI.
 * It utilizes the `useFlowReducer` hook to manage application state and dispatch actions.
 *
 * Depending on the current `appState`, it conditionally renders one of the following views:
 * - `PermissionView` when the app state is `'not-allowed'`
 * - `NavigationView` when the app state is `'navigate'`
 * - `ConversationView` for all other states
 */
export default function Home() {
  const { state, dispatch } = useFlowReducer();
  if (state.appState === 'not-allowed') return <PermissionView />;
  if (state.appState === 'navigate') return <NavigationView state={state} dispatch={dispatch} />;
  return <ConversationView state={state} dispatch={dispatch} />;
}
