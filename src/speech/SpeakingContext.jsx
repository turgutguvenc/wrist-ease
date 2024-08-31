import { createContext, useContext, useReducer } from "react";

/* eslint-disable react/prop-types */
const SpeakingTestContext = createContext();

const initialState = {
  status: "ready",
  step: 0,
  sentence: "",
  stage: "",
  score: 0,
  isNextButtonDisabled: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "StatusReady":
      return {
        ...state,
        status: "active",
      };

    case "recordingRender":
      return {
        ...state,
        stage: "recording",
      };

    case "RESET_STAGE":
      return { ...state, stage: "" };

    case "DISABLE_NEXT_BUTTON": // Add action for disabling button
      return { ...state, isNextButtonDisabled: true };
    case "ENABLE_NEXT_BUTTON": // Add action for enabling button
      return { ...state, isNextButtonDisabled: false };

    case "resetStep":
      return { ...state, step: 1 };
    case "updateSummaryAnswer": {
      const { index, answers } = action.payload;
      const updatedSummaryAnswers = [...state.summaryAnswers];
      updatedSummaryAnswers[index] = answers;

      return {
        ...state,
        summaryAnswers: updatedSummaryAnswers,
      };
    }
    case "restart":
      // If the status is "finished", keep the current UserAnswers and points
      return {
        ...state,
        step: 1,
        index: 0, // Set the index to 0 to start from the beginning
        status: "finished", // Set the status to "review" for review mode
      };

    case "record":
      console.log("record dispatched");
      return {
        ...state,
        sentence: action.payload,
      };

    default:
      throw new Error("Action unknown");
  }
}

function SpeakingTestProvider({ children }) {
  const [{ status, sentence, stage }, dispatch] = useReducer(
    reducer,
    initialState
  );

  console.log(sentence);
  return (
    <SpeakingTestContext.Provider
      value={{
        status,
        dispatch,
        sentence,
        stage,
      }}
    >
      {children}
    </SpeakingTestContext.Provider>
  );
}

function useSpeakingTest() {
  const context = useContext(SpeakingTestContext);
  if (context === undefined)
    throw new Error(
      "SpeakingTestContext was used outside SpeakingTestProvider"
    );
  return context;
}

export { SpeakingTestProvider, useSpeakingTest };
