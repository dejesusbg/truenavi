import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import WebView from 'react-native-webview';
import usePreferencesContext from '~/context/PreferencesProvider';
import { getLocale } from '~/services';
import { htmlContent } from '~/utils/audio';
import { FlowReducer, listenTranscript } from '~/utils/flow';

export interface SpeechActions {
  start: () => void;
  stop: () => void;
}

export const SpeechWebView = forwardRef(({ state, dispatch }: FlowReducer, ref) => {
  const { preferences, loadPreferences } = usePreferencesContext();
  const webviewRef = useRef<WebView>(null);

  const actions = (): SpeechActions => ({
    start: () => webviewRef.current?.postMessage('start'),
    stop: () => webviewRef.current?.postMessage('stop'),
  });

  useImperativeHandle(ref, actions);

  useEffect(() => {
    const locale = getLocale(preferences.spanish!);
    webviewRef.current?.postMessage(locale);
  }, [preferences]);

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
