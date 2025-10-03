"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useMutation } from "convex/react"
import { Trash } from "lucide-react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel";

function DeletePostAlert({ postId }: { postId: Id<"posts"> }) {
  const deletePost = useMutation(api.post.deletePost)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash size={20} color="red" className="cursor-pointer" />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#151515]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            post and remove your it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border border-light cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={() => deletePost({ postId })}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeletePostAlert;