import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import WebView from 'react-native-webview';
import usePreferencesContext from '~/context/PreferencesProvider';
import { getLocale } from '~/services';
import { htmlContent } from '~/utils/audio';
import { FlowReducer, processTranscript } from '~/utils/flow';

export interface SpeechActions {
  start: () => void;
  stop: () => void;
}

export const SpeechWebView = forwardRef(({ state, dispatch }: FlowReducer, ref) => {
  const { preferences } = usePreferencesContext();
  const locale = getLocale(preferences.spanish!);
  const webviewRef = useRef<WebView>(null);

  const actions = (): SpeechActions => ({
    start: () => webviewRef.current?.postMessage('start'),
    stop: () => webviewRef.current?.postMessage('stop'),
  });

  useImperativeHandle(ref, actions);

  useEffect(() => {
    webviewRef.current?.postMessage(locale);
  }, [locale]);

  return (
    <WebView
      ref={webviewRef}
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      onMessage={(e: any) => processTranscript(state, dispatch, e.nativeEvent.data)}
      javaScriptEnabled
      containerStyle={{ position: 'absolute', width: 0, height: 0 }}
    />
  );
});
