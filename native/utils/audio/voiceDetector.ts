/**
 * This HTML sets up a simple page that uses the `webkitSpeechRecognition` API to perform continuous speech recognition. It listens for messages from the React Native WebView to start or stop recognition, and posts back the recognized transcript (or an empty string if nothing is recognized).
 *
 * - When a final result is detected, it sends the transcript to the React Native WebView and stops recognition.
 * - If stopped without a final result, it sends an empty transcript.
 * - Handles recognition errors and resets state accordingly.
 *
 * @remarks
 * This HTML is intended to be injected into a WebView in a React Native application, and communicates with the native side via `window.ReactNativeWebView.postMessage`.
 */
export const htmlContent = `
<!DOCTYPE html>
  <html>
  <head></head>
  <meta charset="utf-8">
  <body>
      <script>
        let recognition;
        let isProcessingFinal = false;
        let hasStarted = false;
        
        if ('webkitSpeechRecognition' in window) {
          recognition = new webkitSpeechRecognition();
          recognition.continuous = true; 
          recognition.lang = 'es-CO';

          recognition.onresult = function(event) {
            let transcript = '';
            let isFinal = false;

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              transcript += event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                isFinal = true;
              }
            }
            
            // only process the final result once
            if (isFinal && !isProcessingFinal) {
              isProcessingFinal = true;
              window.ReactNativeWebView.postMessage(JSON.stringify({ transcript }));
              recognition.stop();
            }
          };

          recognition.onend = function() {
            if (!isProcessingFinal && hasStarted) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ transcript: '' }));
            }
            isProcessingFinal = false;
            hasStarted = false;
          };

          recognition.onerror = function() {
            isProcessingFinal = false;
            hasStarted = false;
          };
        }

        document.addEventListener('message', function(event) {
          if (!recognition) return;

          const data = event.data;
          if (data === 'start' && !hasStarted) {
            hasStarted = true;
            isProcessingFinal = false;
            recognition.start();
          } else if (data === 'stop') {
            recognition.stop();
            hasStarted = false;
            isProcessingFinal = false;
          }
        });
      </script>
  </body>
  </html>
`;

/**
 * Calculates the Levenshtein distance between two strings.
 *
 * The Levenshtein distance is a measure of the minimum number of single-character edits
 * (insertions, deletions, or substitutions) required to change one string into the other.
 *
 * @param a - The first string to compare.
 * @param b - The second string to compare.
 * @returns The Levenshtein distance between the two strings.
 *
 * @example
 * ```typescript
 * getLevenshtein('kitten', 'sitting'); // returns 3
 * ```
 */
export function getLevenshtein(a: string, b: string): number {
  const matrix = [];

  // initialize matrix
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  // fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
