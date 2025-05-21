import { forwardRef, useImperativeHandle, useRef } from 'react';
import WebView from 'react-native-webview';
import usePreferencesContext from '~/context/PreferencesProvider';
import { htmlContent } from '~/utils/audio';
import { FlowReducer, listenTranscript } from '~/utils/flow';

export interface SpeechActions {
  start: () => void;
  stop: () => void;
}

/**
 * A forwardRef component that renders a hidden WebView for speech-related actions.
 *
 * @param state - The state from the flow reducer.
 * @param dispatch - The dispatch from the flow reducer.
 * @param ref - A ref to expose imperative speech actions (`start` and `stop`).
 *
 * @remarks
 * - Uses the `usePreferencesContext` to access user preferences.
 * - Exposes `start` and `stop` methods via the ref to control speech actions in the WebView.
 * - Handles messages from the WebView to update the application state.
 */
export const SpeechWebView = forwardRef(({ state, dispatch }: FlowReducer, ref) => {
  const { preferences, loadPreferences } = usePreferencesContext();
  const webviewRef = useRef<WebView>(null);

  if (preferences === null) return null;

  const actions = (): SpeechActions => ({
    start: () => webviewRef.current?.postMessage('start'),
    stop: () => webviewRef.current?.postMessage('stop'),
  });

  useImperativeHandle(ref, actions);

  const onMessage = (e: any) =>
    listenTranscript(state, dispatch, preferences, loadPreferences, e.nativeEvent.data);

  return (
    <WebView
      ref={webviewRef}
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      onMessage={onMessage}
      javaScriptEnabled
      containerStyle={{ position: 'absolute', width: 0, height: 0 }}
    />
  );
});
