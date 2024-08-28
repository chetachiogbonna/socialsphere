import { useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { aiContext } from "../../context/AIContext"
import SpeechRecognition from "react-speech-recognition";
import { cn } from "@/lib/utils";

function AI({ className }: { className?: string }) {
  const { start, stop, isAIInAction, transcript, setIsAIInAction } = aiContext()

  const [listening, setListening] = useState(false);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <span>
        Browser doesn't support speech recognition. You can use alternative browsers like Chrome or Edge.
      </span>
    )
  }

  console.log(transcript)
  const handleButtonClick = () => {
    if (listening) {
      stop()
      setListening(false);
      setIsAIInAction(true)
    } else {
      start()
      setListening(true);
    }
  };

  return listening
    ? (
      <div 
        className="w-8 h-8 rounded-full bg-blue flex justify-center items-center"
        onClick={handleButtonClick}
        aria-disabled={isAIInAction}
      >
        <img 
          src="/assets/icons/microphone.svg" 
          width={24} 
          height={24} 
          className="cursor-pointer"
        />
      </div>
    ) : isAIInAction
          ? (
            <ScaleLoader
              color="red"
              loading={true}
              aria-label="Loading Spinner"
              data-testid="loader"
              className={cn("w-6 h-6 cursor-pointer", className)}
              onClick={handleButtonClick}
              aria-disabled={isAIInAction}
            />
          ) : (
            <div 
              className="w-6 h-6 mr-2 rounded-full flex justify-center items-center"
              onClick={handleButtonClick}
              aria-disabled={isAIInAction}
            >
              <img 
                src="/assets/icons/robot.svg" 
                width={24} 
                height={24} 
                alt="robot" 
                className={cn("cursor-pointer absolute h-10 w-10", className)}
              />
            </div>
          )
}

export default AI