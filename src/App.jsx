import RecordingComponent from "./speech/RecordingComponent";
import { SpeakingTestProvider } from "./speech/SpeakingContext";
function App() {
  return (
    <SpeakingTestProvider>
      <RecordingComponent />
    </SpeakingTestProvider>
  );
}

export default App;
