import { ConversationView, NavigationView, PermissionView } from '~/components/views';
import { useFlowReducer } from '~/utils/flow';

export default function Home() {
  const { state, dispatch } = useFlowReducer();
  if (state.appState === 'not-allowed') return <PermissionView />;
  if (state.appState === 'navigate') return <NavigationView state={state} dispatch={dispatch} />;
  return <ConversationView state={state} dispatch={dispatch} />;
}
