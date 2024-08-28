import { useGetAllUsers } from "@/react-query"
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { talkToAI } from "@/lib/config/api";
import { useEffect } from "react";
import { aiContext } from "@/context/AIContext";
import { useUser } from "@/hooks/useUser";
import { toast } from "@/components/ui/use-toast";
import { AISpeak, navigationPath } from "@/lib/utils";

function People() {
  const { currentUserId } = useUser()
    const navigate = useNavigate()
    const { transcript, isAIInAction, setIsAIInAction } = aiContext()
    
    useEffect(() => {
      const interactWithAI = async () => {
        try {
          const res = await talkToAI(transcript)
          const { action } = res;
          if (!action) {
            return toast({
              title: "An error occured. Please refresh the page.",
              variant: "destructive"
            })
          }
  
          switch (action) {
            case "navigate":
              const { destination } = res
              if (!destination) {
                return toast({
                  title: "Please say the page you want to go."
                })
              }
  
              if (navigationPath(destination, currentUserId as string) === "ai_speak") {
                return AISpeak("I'm sorry but the page you want to be navigated to does not exist.")
              }
              navigate(navigationPath(destination, currentUserId as string))
              break;
  
            case "navigate_suggestion":
              const { message: AIMessage } = res
              if (AIMessage) {
                return AISpeak(AIMessage)
              }
              break;
  
            case "ai_speak":
              const { description } = res
              if (!description) {
                return AISpeak("I couldn't get you can you please say something else.")
              }
              AISpeak(description)
              break;
              
              case "greet":
                const { response } = res
                if (!response) {
                  return AISpeak("take me home page");
                }
                AISpeak(response)
              break;
              
              default:
                AISpeak("I couldn't understand what you want. Please say something else.")
              break;
          }
  
        } catch (error) {
          console.log(error)
          const errorMsg = error instanceof Error ? error.message : "An error occured please refresh the page an try again";
          toast({
            title: errorMsg,
            variant: "destructive"
          })
        } finally {
          setIsAIInAction(false)
        }
      }
  
      if (isAIInAction) {
        interactWithAI()
      }
    }, [isAIInAction])

  const { data: users, isPending: isGettingUser } = useGetAllUsers()

  if (isGettingUser) {
    return (
      <Loader className="mx-auto" />
    )
  }

  return (
    <section className="pt-3 pb-44 xl:pb-20">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="w-[90%] md:w-[95%] mx-auto font-bold text-xl">People</h2>
      </div>

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users?.map(user => {
          return (
            <li key={user?.userId} className="max-sm:max-h-[400px] max-sm:max-w-[400px] sm:max-h-[350px] sm:max-w-[350px] rounded-2xl relative bg-[#9CA8B2] mx-auto">
              <div className="w-full h-full rounded-2xl px-12 py-6 space-y-2 bg-light">
                <Link to={`/profile/${user?.userId}`} className="w-16 h-16 rounded-full cursor-pointer bg-dark-3">
                  <img className="w-16 h-16 rounded-full" src={user.profilePicUrl || "/assets/images/profile-placeholder.jpg"} alt="user profile" />
                </Link>

                <Link to={`/profile/${user?.userId}`} className="flex flex-col justify-center items-center">
                  <h2>{user.name}</h2>
                  <h3
                    className="hover:underline cursor-pointer text-dark-3 text-[14px]"
                    onClick={() => {}}
                  >@{user.name}</h3>
                </Link>

                <Button
                  className="bg-dark-3 hover:bg-dark-3"
                  type="button"
                >Follow</Button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default People