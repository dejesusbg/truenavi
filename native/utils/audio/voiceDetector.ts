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
          recognition.lang = 'en-US';

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
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'result', transcript }));
              recognition.stop();
            }
          };

          recognition.onend = function() {
            if (!isProcessingFinal && hasStarted) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'result', transcript: '' }));
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
          } else {
            recognition.lang = data
          }
        });
      </script>
  </body>
  </html>
`;

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
