import Loader from "@/components/shared/Loader";
import PostBox from "@/components/shared/PostBox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { aiContext } from "@/context/AIContext";
import { useUser } from "@/hooks/useUser";
import { talkToAI } from "@/lib/config/api";
import { AISpeak, cn, navigationPath } from "@/lib/utils";
import { useGetPostByUser, useGetUserById } from "@/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate();
  const { currentUserId } = useUser()
  const { toast } = useToast()

  const { data: user } = useGetUserById(userId as string)
  const { data: userPosts, isPending: isUserPostsPending } = useGetPostByUser(userId as string);

  const myProfile = currentUserId! === user?.userId!

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
    <section className="px-2 pt-3 pb-56 md:pb-20 lg:w-[90%] mx-auto flex flex-col font-sans">
      <div className="w-full rounded-t-xl xl:rounded-t-3xl bg-dark-3 rounded-b-xl">
        <div className="w-full h-[35dvh] relative">
          <div className="w-full h-full rounded-t-xl xl:rounded-t-3xl border border-light bg-dark-2">
            <img className="w-full h-full rounded-t-xl xl:rounded-t-3xl" src={user?.coverImgUrl || "/assets/images/profile-placeholder.jpg"} alt="cover photo" />
          </div>
          <div className="h-[100px] w-[100px] md:h-[120px] md:w-[120px] rounded-full absolute left-1/2 -translate-x-1/2 -bottom-14 bg-dark-2">
            <img className="w-full h-full rounded-full border border-light" src={user?.profilePicUrl || "/assets/images/profile-placeholder.jpg"} alt="profile pic" />
          </div>

          <div className="w-full flex justify-between items-center mt-6 px-1 sm:px-4">
            <Button
              className="bg-blue hover:bg-blue"
            >
              Follow
            </Button>
            <Button 
              className={cn("hidden bg-blue hover:bg-blue", { "block": myProfile })}
              type="button" 
              onClick={() => navigate(`/edit-profile/${userId}`)}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl">{user?.name}</h2>
            <p className="text-[15px] max-w-[450px] w-[90%] line-clamp-1 text-center">{user?.bio}</p>
          </div>
          <div className="flex gap-10 pb-3 justify-center items-center profile-stats">
            <div>
              <p>{user?.following.length || 0}</p>
              Following
            </div>

            <div>
              <p>{user?.follower.length || 0}</p>
              Followers
            </div>
      
            <div>
              <p>{userPosts?.length || 0}</p>
              Posts
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 w-[98%] mx-auto">
        <h2 className="font-semibold text-[20px] mb-2">Posts</h2>
        <ul 
          className={`${(userPosts as Post[])?.length > 0 && "w-full mx-auto grid max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4"}`}
        >
          {isUserPostsPending
            ? <Loader className="w-full mx-auto" />
            : userPosts && userPosts?.length > 0
              ? userPosts?.map(post => {
                  return (
                    <PostBox post={post} user={user!} isPending={isUserPostsPending} />
                  )
                })
              : <div className="w-full text-center">This user has no post.</div>
            }
        </ul>
      </div>
    </section>
  )
}

export default Profile