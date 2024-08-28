/* eslint-disable no-unused-vars */

import React, { createContext, useState, useContext } from "react"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

type ContextType = {
  transcript: string,
  start: () => void,
  stop: () => void,
  isAIInAction: boolean,
  isImageGenerating: boolean,
  setIsImageGenerating: React.Dispatch<React.SetStateAction<boolean>>,
  setIsAIInAction: React.Dispatch<React.SetStateAction<boolean>>,
  setImagePrompt: React.Dispatch<React.SetStateAction<string>>,
  imagePrompt: string,
  settingUserProfileReady: boolean,
  setSettingUserProfileReady:  React.Dispatch<React.SetStateAction<boolean>>,
  AIFirstTimeSpeak:  boolean,
  setAIFirstTimeSpeak:  React.Dispatch<React.SetStateAction<boolean>> 
}

const INITIAL_VALUE: ContextType = {
  transcript: "",
  start: () => {},
  stop: () => {},
  isAIInAction: false,
  isImageGenerating: false,
  setIsImageGenerating: () => {},
  setIsAIInAction: () => {},
  setImagePrompt: () => {},
  imagePrompt: "",
  settingUserProfileReady: false,
  setSettingUserProfileReady: () => {},
  AIFirstTimeSpeak:  false,
  setAIFirstTimeSpeak: () => {}
}

export const AIContext = createContext(INITIAL_VALUE)

function AIContextProvider({ children }: { children: React.ReactNode }) {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [isAIInAction, setIsAIInAction] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false)
  const [imagePrompt, setImagePrompt] = useState("")
  const [settingUserProfileReady, setSettingUserProfileReady] = useState(false)
  const [AIFirstTimeSpeak, setAIFirstTimeSpeak] = useState(false)

  const start = () => {
    resetTranscript()
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
      interimResults: true
    })
  }

  const stop = () => {
    SpeechRecognition.stopListening()
  }

  return (
    <AIContext.Provider
      value={{
        transcript,
        start,
        stop,
        isAIInAction,
        isImageGenerating,
        setIsImageGenerating,
        setIsAIInAction,
        setImagePrompt,
        imagePrompt: imagePrompt,
        settingUserProfileReady,
        setSettingUserProfileReady,
        AIFirstTimeSpeak,
        setAIFirstTimeSpeak
      }}
    >
      <>
        {children}
      </>
    </AIContext.Provider>
  )
}

export const aiContext = () => useContext(AIContext)

export default AIContextProvider