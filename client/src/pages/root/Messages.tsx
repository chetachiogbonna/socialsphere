import Loader from "@/components/shared/Loader";
import MessageImageBox from "@/components/shared/MessageImageBox";
import MessageTextBox from "@/components/shared/MessageTextBox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { aiContext } from "@/context/AIContext";
import { useUser } from "@/hooks/useUser";
import { generateImage, getImageUrlAndSaveToStorage, talkToAI } from "@/lib/config/api";
import { AISpeak, navigationPath } from "@/lib/utils";
import { useChatFriend, useGetFriendsChats, useGetUserById } from "@/react-query";
import { serverTimestamp } from "firebase/firestore";
import { LucideSendHorizontal, Link as LucideLink } from "lucide-react";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"

function Messages() {
  const { userId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation()

  const [message, setMessage] = useState("");

  const { data: user, isPending: isUserPending, error: userError } = useGetUserById(userId as string);

  if (!isUserPending && !user) navigate("/messages");

  const { currentUserId } = useUser()
  const chatContainerRef = useRef() as React.MutableRefObject<HTMLElement>

  const chatId = currentUserId! < user?.userId!
  ? `${currentUserId}_${user?.userId}` 
  : `${user?.userId}_${currentUserId}`;
  
  const { messages, isPending: isGettingMessages } = useGetFriendsChats(chatId);
  
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight
  }, [messages])

  const { transcript, isAIInAction, setIsAIInAction } = aiContext()
  const { mutateAsync: sendMessage } = useChatFriend();

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
            const { text_message } = res
            if (text_message) {
              await sendMessage({
                chatId,
                type: "text",
                userId: currentUserId as string,
                message: text_message,
                createdAt: serverTimestamp() as unknown as FirestoreTimestamp
              })
            }
            break;

          case "send_image":
            const { image_description } = res
            if (image_description) {
              const imageBlob = await generateImage(image_description)
              const imageUrl = await getImageUrlAndSaveToStorage(imageBlob) as string;
              await sendMessage({
                chatId,
                type: "image",
                userId: currentUserId as string,
                message: imageUrl,
                createdAt: serverTimestamp() as unknown as FirestoreTimestamp
              })
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
 
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await sendMessage({
      chatId,
      type: "text",
      userId: currentUserId as string,
      message,
      createdAt: serverTimestamp() as unknown as FirestoreTimestamp
    })

    setMessage("")

    if (userError) {
     return toast({
       title: userError.message,
       variant: "destructive"
     })
   }
  }

  const inputFileRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [isSelectingFile, setIsSelectingFile] = useState(false)

  const handleSendFileClick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelectingFile(true)

    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".")[file.name.split(".").length - 1]

    try {
      if (!file.type.startsWith("image")) {
        throw new Error(
          `Our server doesn't support files with (.${fileExtension}) extension. Please select a photo with (.png, .svg, etc) extension.`
        )
      }

      const fileUrl = await getImageUrlAndSaveToStorage(file as File) as string;
      await sendMessage({
        chatId,
        type: "image",
        userId: currentUserId as string,
        message: fileUrl,
        createdAt: serverTimestamp() as unknown as FirestoreTimestamp
      })
    } catch (error) {
      toast({
        title: (error as Error).message,
        variant: "destructive"
      })
    } finally {
      setIsSelectingFile(false)
    }
  }

  return (
    <section className="relative h-screen flex-1">
      <div className="sticky top-[60px] right-0">
        <div className="flex items-center">
          <Link to={`/profile/${userId}`} className="flex items-center gap-2 px-4 h-[60px] min-w-min">
            <img className="rounded-full w-10 h-10" width={40} height={40} src={user?.profilePicUrl || "/assets/images/profile-placeholder.jpg"} alt="profile pic" />
            
            <div>
              <h2 className="capitalize">{user?.name}</h2>
              <h3 className="hover:underline text-gray-600 cursor-pointer">@{user?.name}</h3>
            </div>
          </Link>

          <p className="w-[98%] md:w-[80%] mx-auto text-xs text-center text-gray-400">Tips: (you can tell AI send an image or a text message to your friend.)</p>
        </div>
        <hr className="border-[#242A32]" />
      </div>

      <section ref={chatContainerRef} className="overflow-y-auto chat-container pb-28 md:px-14">
        {isGettingMessages
          ? <div className="flex flex-col h-full w-full justify-center items-center">
              <p className="text-lg font-semibold text-center">Getting messages</p>
              <Loader className="mx-auto" />
            </div>
          : messages && messages?.length > 0 ?
              messages?.map(chat => {
                return chat.type === "text"
                  ? <MessageTextBox key={`${chat.chatId}-${crypto.randomUUID()}`} chat={chat} />
                  : <MessageImageBox key={`${chat.chatId}-${crypto.randomUUID()}`} chat={chat} />
              }) : (
                <div className="flex flex-col h-full w-full justify-center items-center">
                  <p className="text-lg font-semibold text-center">You have no conversation with this person</p>
                  <p className="text-gray-500 text-center">Be friendly and say hi.</p>
                </div>
              )
        }
      </section>

      <form onSubmit={handleSendMessage} className="sticky bottom-[2px] w-[98%] mx-auto">
        <div className="flex gap-1 items-center bg-[#424A52] rounded-[16px]">
          <div className="ml-2 opacity-60 cursor-pointer">
            🤨
          </div>

          <Textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="write something..."
            className="bg-[#424A52] border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 resize-none min-h-8"
          />

          {isSelectingFile
            ? <Loader className="ml-auto" />
            : (
              <>
                <LucideLink 
                  onClick={() => inputFileRef.current.click()}
                  className="cursor-pointer opacity-[0.8px]"
                  size={18}
                  color="#eee"
                />
                <input
                  ref={inputFileRef}
                  className="hidden"
                  type="file" 
                  onChange={(e) => handleSendFileClick(e)}
                />
              </>
            )
          }

          <button>
            <LucideSendHorizontal 
              color="#1959FC"
              className="mr-2 cursor-pointer"
            />
          </button>
        </div>
      </form>
    </section>
  )
}

export default Messages