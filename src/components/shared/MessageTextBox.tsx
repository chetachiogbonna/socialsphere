import { cn, formatFirestoreTimestampToTime } from "@/lib/utils"
import { useParams } from "react-router-dom"

function MessagesTextBox({ chat }: { chat: Chat }) {
  const { userId } = useParams()

  return (
    <div>
      <div className={cn("w-full flex", { "justify-start mr-auto": userId === chat.userId }, { "justify-end ml-auto": userId !== chat.userId })}>
        <div className="p-4 rounded-lg max-w-xs md:max-w-md flex jusitfy-end">
          <div className={cn("w-full flex mb-2", { "justify-start mr-auto": userId === chat.userId }, { "justify-end ml-auto": userId !== chat.userId })}>
            <div className={cn("", { "comment-box-left": userId === chat.userId }, { "comment-box-right": userId !== chat.userId })}>
                <p className="text-xs md:text-sm">{chat.message}</p>
                <span className="text-xs text-gray-300">
                  {formatFirestoreTimestampToTime(chat.createdAt)}
                </span>
            </div>
            <div />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesTextBox