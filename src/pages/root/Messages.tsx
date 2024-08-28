import Loader from "@/components/shared/Loader";
import MessageImageBox from "@/components/shared/MessageImageBox";
import MessageTextBox from "@/components/shared/MessageTextBox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { getImageUrlAndSaveToStorage } from "@/lib/config/api";
import { useChatFriend, useGetFriendsChats, useGetUserById } from "@/react-query";
import { serverTimestamp } from "firebase/firestore";
import { LucideSendHorizontal, Link as LucideLink } from "lucide-react";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"

function Messages() {
  const { userId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const { data: user, isPending: isUserPending, error: userError } = useGetUserById(userId as string);

  // if (!isUserPending && !user) navigate("/messages");

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
 
  const { mutateAsync: sendMessage } = useChatFriend();

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

  crypto.randomUUID()
  return (
    <section className="relative h-screen flex-1">
      <div className="sticky top-[60px] right-0">
        <div className="flex">
          <Link to={`/profile/${userId}`} className="flex items-center gap-2 px-4 h-[60px] min-w-min">
            <img className="rounded-full" width={40} height={40} src={user?.profilePicUrl || "/assets/images/profile-placeholder.jpg"} alt="profile pic" />
            
            <div>
              <h2 className="capitalize">{user?.name}</h2>
              <h3 className="hover:underline text-gray-600 cursor-pointer">@{user?.name}</h3>
            </div>
          </Link>

          <div />
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

      <form onSubmit={handleSendMessage} className="sticky bottom-0 w-[98%] mx-auto h-12 bg-[#111]">
        <div className="flex gap-1 items-center bg-[#424A52] rounded-[16px] bg-red-5">
          <div className="ml-2 opacity-60 cursor-pointer">
            🤨
          </div>

          <Input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder="write something..."
            className="bg-[#424A52] border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-3xl placeholder:text-gray-400"
          />

         {isSelectingFile
            ? <Loader className="ml-auto" />
            : (
              <>
                <LucideLink 
                  onClick={() => inputFileRef.current.click()}
                  className="cursor-pointer"
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