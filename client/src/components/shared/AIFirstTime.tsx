import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { aiContext } from "@/context/AIContext"
import { AISpeak } from "@/lib/utils";
import { useEffect } from "react";

function AIFirstTime() {
  const { AIFirstTimeSpeak, setAIFirstTimeSpeak } = aiContext()

  const text = `
    Hello! I'm an AI assistant built to help you within this social media application called Socialsphere. And as an AI assistant i can help  you do different activities within this social app, such as, like a post, save a post, create a post, navigate to different pages of this web app, all with just voice command, you can also command me to send messages to a friend, at the messages page and again with just voice command.
    Rules to activate the AI, click on the robot icon you can see on any page, once you click on it a voice icon will appear, and then you can speak to the AI, after speaking, click on the icon again, just like that, the AI will take action.
    And also mind you! The AI can also make mistakes.
    Do you want to see a test of what i can do? Let's start by clicking the continue button and then click on the robot icon you can see on the first post on the screen, and say something like [comment this post is awesome] to see the magic happen. 
  `;
  const speak = async (text: string) => {
    if (AIFirstTimeSpeak) {      
      AISpeak(text)
    }
  }
  useEffect(() => {
    speak(text)
  }, [AIFirstTimeSpeak])

  return (
    <AlertDialog open={AIFirstTimeSpeak}>
      <AlertDialogContent className="bg-dark-3">
        <AlertDialogHeader>
          <AlertDialogTitle>App overview.</AlertDialogTitle>
          <AlertDialogDescription>
            Steps to help you understand how to the AI feature of this app
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-dark-2"
            onClick={() => speak(text)}
          >
            Repeat
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue hover:bg-blue"
            onClick={() => {
              speak("")
              setAIFirstTimeSpeak(false)
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AIFirstTime