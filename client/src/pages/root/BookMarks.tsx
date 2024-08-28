import Loader from '@/components/shared/Loader';
import PostBox from '@/components/shared/PostBox';
import { useToast } from '@/components/ui/use-toast';
import { aiContext } from '@/context/AIContext';
import { useUser } from '@/hooks/useUser';
import { getUserBookmarkedPosts, getUserById, talkToAI } from '@/lib/config/api';
import { AISpeak, navigationPath } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BookMarks() {
  const { currentUserId } = useUser();
  const navigate = useNavigate()
  const { toast } = useToast()

  const [user, setUser] = useState<IUser>()
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>()
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    const getUserAndBookmarkPost = async () => {
      if (!currentUserId) {
        setIsPending(true)
        return;
      }

      try {
        const [user, bookmarkedPosts] = await Promise.all([
          getUserById(currentUserId!), getUserBookmarkedPosts(currentUserId!)
        ]);
        setUser(user)
        setBookmarkedPosts(bookmarkedPosts)
      } catch (error) {
        console.log(error)
        const errorMsg = error instanceof Error ? error.message : "an error occured while fetching post."
        toast({
          title: errorMsg,
          variant: "destructive"
        })
      } finally {
        setIsPending(false)
      }
    }

    getUserAndBookmarkPost()
  }, [currentUserId])

  const { transcript, isAIInAction, setIsAIInAction, setIsImageGenerating, setImagePrompt } = aiContext()

  useEffect(() => {
    const interactWithAI = async () => {
      try {
        const res = await talkToAI(transcript)

        const { action } = res
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

            if (navigationPath(destination, currentUserId as string) === "edit-post") {
              return AISpeak("I'm sorry but you have to be on the home page to edit a post.")
            } else if (navigationPath(destination, currentUserId!) === "ai_speak") {
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
        setIsImageGenerating(false)
        console.log(error)
        const errorMsg = error instanceof Error ? error.message : "An error occured please refresh the page an try again";
        toast({
          title: errorMsg,
          variant: "destructive"
        })
      } finally {
        setIsAIInAction(false)
        setImagePrompt("")
      }
    }

    if (isAIInAction) {
      interactWithAI()
    }
  }, [isAIInAction])

  return (
    <section className="pt-3 pb-44 xl:pb-20">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="w-[90%] md:w-[95%] mx-auto font-bold text-xl">Bookmarks</h2>
      </div>
      
      {isPending
        ? <Loader className='mx-auto' />
        : (
          <ul className="w-[90%] md:w-[95%] mx-auto grid max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {bookmarkedPosts?.map(post => (
              <PostBox key={post.postId} post={post} user={user!} isPending={isPending} />
            ))}
          </ul>
        )
      }
    </section>
  )
}

export default BookMarks