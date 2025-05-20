import { ConversationView, NavigationView, PermissionView } from '~/components/views';
import { usePermissions } from '~/hooks/usePermissions';
import { useFlowReducer } from '~/utils/flow';

export default function Home() {
  const permissionsGranted = usePermissions();
  const { state, dispatch } = useFlowReducer(permissionsGranted);

  if (state.appState === 'not-allowed') return <PermissionView />;
  if (state.appState === 'navigate') return <NavigationView state={state} dispatch={dispatch} />;
  return <ConversationView state={state} dispatch={dispatch} />;
}
