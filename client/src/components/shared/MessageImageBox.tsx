import { cn, formatFirestoreTimestampToTime } from "@/lib/utils"
import { useParams } from "react-router-dom"

function MessageImageBox({ chat }: { chat: Chat }) {
  const { userId } = useParams()

  return (
    <div className={cn("w-full flex", { "justify-start mr-auto": userId === chat.userId }, { "justify-end ml-auto": userId !== chat.userId })}>
      <div className="p-4 rounded-lg max-w-xs md:max-w-sm flex jusitfy-end">
        <div className={cn("w-full flex mb-2", { "justify-start mr-auto": userId === chat.userId }, { "justify-end ml-auto": userId !== chat.userId })}>
          <div className={cn("", { "comment-box-left": userId === chat.userId }, { "comment-box-right": userId !== chat.userId })}>
            <img src={chat.message} alt="photo" />
            <span className="text-xs text-gray-300">
              {formatFirestoreTimestampToTime(chat.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageImageBox