import { cn, formatFirestoreTimestampToTime } from "@/lib/utils"
import { useParams } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

function MessageImageBox({ chat }: { chat: Chat }) {
  const { userId } = useParams()

  return (
    <Dialog>
      <div>
        <div className={cn("w-full flex", { "justify-start mr-auto": userId === chat.userId }, { "justify-end ml-auto": userId !== chat.userId })}>
          <div className="p-4 rounded-lg max-w-xs md:max-w-sm flex jusitfy-end">
            <div className={cn("w-full flex mb-2", { "justify-start mr-auto": userId === chat.userId }, { "justify-end ml-auto": userId !== chat.userId })}>
              <DialogTrigger className={cn("", { "comment-box-left": userId === chat.userId }, { "comment-box-right": userId !== chat.userId })}>
                <img src={chat.message} alt="photo" />
                <span className="text-xs text-gray-300">
                  {formatFirestoreTimestampToTime(chat.createdAt)}
                </span>
              </DialogTrigger>
            </div>
          </div>
        </div>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="-mt-4">Update profile</DialogTitle>
          </DialogHeader>

          <img src={chat.message} alt="photo" />
        </DialogContent>
      </div>
    </Dialog>
  )
}

export default MessageImageBox