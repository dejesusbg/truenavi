import { ConversationView, NavigationView, PermissionView } from '~/components/views';
import usePreferencesContext from '~/context/PreferencesProvider';
import { usePermissions } from '~/hooks/usePermissions';
import { useFlowReducer } from '~/utils/flow';

export default function Home() {
  const permissionsGranted = usePermissions();
  const { preferences, loadPreferences } = usePreferencesContext();
  const { state, dispatch } = useFlowReducer(permissionsGranted, preferences, loadPreferences);

  if (state.appState === 'not-allowed') return <PermissionView />;
  if (state.appState === 'navigate') return <NavigationView state={state} dispatch={dispatch} />;
  return <ConversationView state={state} />;
}
