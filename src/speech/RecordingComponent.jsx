import { useState } from "react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useSpeakingTest } from "./SpeakingContext";
import ollama from "ollama";
const RecordingComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const { startRecognition, stopRecognition } = useSpeechRecognition();
  const { sentence } = useSpeakingTest();

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript("");
    setError(null);
    startRecognition().catch((err) => {
      setError("Failed to start recording: " + err.message);
      setIsRecording(false);
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecognition();
    setTranscript(sentence);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(transcript).then(
      () => {
        alert("Transcript copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy text: ", err);
        setError("Failed to copy to clipboard");
      }
    );
  };
  async function generateText(context) {
    try {
      const response = await ollama.chat({
        model: "llama3",
        temperature: 0.1,
        messages: [{ role: "user", content: context }],
      });

      // Check if the response contains the expected structure
      if (response && response.message && response.message.content) {
        console.log(response.message.content);
        return response.message.content; // Return the formatted text
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error generating text:", error);
      return null;
    }
  }

  const handleFormatTranscript = async () => {
    const formattedText = await generateText(
      `You are an assistant that helps people format their speech into emails. 
The user has provided the following text from their speech: "${transcript}". 
Please reformat it into a clear, well-structured email with a greeting and closing. 
Correct any obvious errors, but try to retain the original wording, tone, and meaning as closely as possible.
Only return email do not add anything else the message.`
    );
    if (formattedText) {
      setTranscript(formattedText);
    }
  };

  return (
    <div>
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={error}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {isRecording && <p>Recording...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <textarea
        value={transcript}
        readOnly
        rows={5}
        cols={50}
        style={{ marginTop: "10px", width: "100%" }}
      />
      <button onClick={handleCopyToClipboard} style={{ marginTop: "10px" }}>
        Copy to Clipboard
      </button>
      <button
        onClick={handleFormatTranscript}
        style={{ marginTop: "10px", marginLeft: "10px" }}
      >
        Format with Ollama
      </button>
    </div>
  );
};

export default RecordingComponent;
