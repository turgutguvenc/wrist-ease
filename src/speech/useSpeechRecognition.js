import { useEffect, useRef } from "react";
import { useSpeakingTest } from "./SpeakingContext";
/* eslint-disable react/prop-types */
export const useSpeechRecognition = () => {
  const recognitionRef = useRef(null);
  const shouldRestart = useRef(true); // Control flag for automatic restart
  const { dispatch } = useSpeakingTest();

  const startRecognition = async () => {
    if (recognitionRef.current) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition API is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      console.log("Transcript:", transcript); // Debugging
      dispatch({ type: "record", payload: transcript }); // turning it to text here
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error); // Debugging
    };
    recognition.onend = () => {
      if (shouldRestart.current) {
        console.log("Recognition ended, restarting..."); // Debugging
        recognition.start();
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
    console.log("Recognition started"); // Debugging
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      shouldRestart.current = false; // Prevent automatic restart
      recognitionRef.current.stop();
      recognitionRef.current = null;
      console.log("Recognition stopped"); // Debugging
    }
  };

  useEffect(() => {
    return () => {
      shouldRestart.current = false;
      stopRecognition();
    };
  }, []);

  return { startRecognition, stopRecognition };
};
