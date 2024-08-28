import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDeletePost } from "@/react-query"
import { useEffect } from "react"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"

function DeletePostAlert(
  { 
    deletePost, 
    setShowEditAndDelete, 
    post,
    setDeletePost
  }: { 
    deletePost: boolean, 
    setShowEditAndDelete: React.Dispatch<React.SetStateAction<boolean>>, 
    post: Post,
    setDeletePost: React.Dispatch<React.SetStateAction<boolean>>
  }) {

  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const handleWindowClick = () => {
      setShowEditAndDelete(false)
    }

    window.addEventListener("click", handleWindowClick)

    return () => {
      window.removeEventListener("click", handleWindowClick)
    }
  }, [])

  const { mutateAsync, error: deletePostError, isPending: isDeleting } = useDeletePost()

  const handleDeletePost = async () => {
    try {
      await mutateAsync({
        postId: post.postId!,
        postImageUrl: post.imageUrl
      })

      navigate("/")
    } catch (error) {
      toast({
        title: deletePostError?.message
      })
      console.log(error)
    }
  }

  return (
    <AlertDialog open={deletePost}>
      <AlertDialogContent className="bg-dark-3">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. If you delete this post, You won't be able to access it again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-dark-2"
            onClick={() => setDeletePost(false)}
          >Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-blue hover:bg-blue"
            onClick={handleDeletePost}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeletePostAlert