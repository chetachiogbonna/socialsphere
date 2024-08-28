import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom"
import { Input } from "../ui/input"
import { AISpeak, cn, navigationPath } from "@/lib/utils"
import { useGetAllUsers, useGetFriendsChats } from "@/react-query"
import Loader from "./Loader"
import useWindowWidth from "@/hooks/useWindowWidth"
import { useUser } from "@/hooks/useUser"
import { useEffect } from "react"
import { talkToAI } from "@/lib/config/api"
import { useToast } from "../ui/use-toast"
import { aiContext } from "@/context/AIContext"

const ChatItem = ({ user, isActive }: { user: IUser, isActive: boolean }) => {
  const { currentUserId } = useUser()

  const chatId = currentUserId! < user?.userId
    ? `${currentUserId}_${user?.userId}` : `${user?.userId}_${currentUserId}`;
  
  const { messages, isPending } = useGetFriendsChats(chatId);

  return (
    <p className={cn("text-gray-400 text-sm line-clamp-1", { "text-gray-300": isActive })}>
     {isPending
        ? "Loading..."
        : messages && messages.length > 0
          ? messages[messages.length - 1].type === "image"
            ? "Photo"
            : messages[messages.length - 1].message
          : "No messages yet."
      }
    </p>
  );
}

function MessageLeftBar() {
  const { userId } = useParams()

  const windowWidth = useWindowWidth();
  const{ pathname } = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()

  const { currentUserId } = useUser()

  const { transcript, isAIInAction, setIsAIInAction } = aiContext()

  const { data: users, isPending } = useGetAllUsers();

  const replace = windowWidth > 1024 ? true : false;

  useEffect(() => {
      const interactWithAI = async () => {
        if (pathname === "/message") {
          return AISpeak("Please select a friend to chat with before using the AI features.")
        }
  
        try {
          const res = await talkToAI(transcript)
          console.log(res)
          const { action } = res;
          console.log(res)
          if (!action) {
            return toast({
              title: "An error occured. Please refresh the page.",
              variant: "destructive"
            })
          }
  
          switch (action) {
            case "send_text":
              if (!userId) {
                AISpeak("I don't know the friend to send this to. Please select a friend.")
              }
              break;
  
            case "send_image":
              if (!userId) {
                AISpeak("I don't know the friend to send this to. Please select a friend.")
              }
              break;
  
            case "navigate":
              const { destination } = res
              if (!destination) {
                return toast({
                  title: "Please say the page you want to go."
                })
              }
  
              if (navigationPath(destination, currentUserId!) === "ai_speak") {
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

  return (
    <aside className={cn("bg-dark-3 [#272F37] h-screen w-full md:w-[30%] lg:w-[25%]", { "hidden lg:block": userId })}>
      <div className="mt-4 mx-auto w-[90%] bg-[#424A52] border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-3xl flex items-center pl-2">
        <img className="w-6 h-6 cursor-pointer" src="/assets/icons/search.png" alt="search friend" />
        <Input
          type="text"
          placeholder="Search friends"
          className="bg-[#424A52] border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-3xl"
        />
      </div>

      {isPending 
        ? (
            <Loader className="mx-auto mt-4" />
        ): (
          <ul className="mt-5 mx-auto w-[90%] flex flex-col overflow-y-auto h-screen gap-4">
              {users && users?.length > 0
                ? users?.map(user => {
                    const isActive = pathname === `/messages/${user?.userId}`

                    return (
                      <li key={user.userId} className={cn("hover:bg-light py-3 rounded-xl w-full px-2 cursor-pointer last:mb-80", { "bg-blue hover:bg-blue": isActive })}>
                        <NavLink to={user.userId} className="flex gap-2 h-[40px]" replace={replace}>
                          <img 
                            className="rounded-full object-cover w-10 h-10"
                            src={user.profilePicUrl || "/assets/images/profile-placeholder.jpg"} 
                            alt="profile pic"
                            width={40}
                            height={40}
                          />
                          <div className="">
                            <h2>{user.name}</h2>
                            <ChatItem user={user} isActive={isActive} />
                          </div>
                        </NavLink>
                      </li>
                    )
                  })
                : <div className="text-sm text-gray-400 w-[90%] text-center mx-auto">
                    No user found! Invite your friends to stay connected.
                  </div>
              }
          </ul>
        )
      }
    </aside>
  )
}

export default MessageLeftBar