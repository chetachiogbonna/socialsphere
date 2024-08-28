import { useGetAllPosts } from "@/react-query"
import RightSideBar from "@/components/shared/RightSideBar";
import PostCard from "@/components/shared/PostCard";
import { useToast } from "@/components/ui/use-toast";
import Loader from "@/components/shared/Loader";
import { AISpeak, checkIfPostIsBookmarked, checkIfPostIsLiked, navigationPath } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { aiContext } from "@/context/AIContext";
import { useEffect, useRef } from "react";
import { bookmarkAndUnbookPost, commentToPost, deletePost, getUserById, likeAndUnlikePost, talkToAI } from "@/lib/config/api";
import { useState } from 'react';
import SetUserProfile from "@/components/shared/SetUserProfile";
import AIFirstTime from "@/components/shared/AIFirstTime";

function Home() {
  const { toast } = useToast();
  const { currentUserId } = useUser()
  const navigate = useNavigate()
  const { transcript, isAIInAction, setIsAIInAction, settingUserProfileReady, setSettingUserProfileReady } = aiContext()

  const { posts, isPending, error } = useGetAllPosts();
  const [currentViewingPost, setCurrentViewingPost] = useState<Post | null>(null);

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
                title: "Please say your page you want to go."
              })
            }

            if (navigationPath(destination, currentUserId as string) === "ai_speak") {
              return AISpeak("I'm sorry but the page you want to be navigated to does not exist.")
            } else if (navigationPath(destination, currentUserId as string) === "post-details") {
              return navigate(`/post-details/${currentViewingPost?.postId}`)
            } else if (navigationPath(destination, currentUserId as string) === "edit-post") {
              const isPostOwnedByCurrentUser = currentUserId! === currentViewingPost?.userId!
              if (!isPostOwnedByCurrentUser) {
                return AISpeak("You are not allowed to edit a post that is not yours please try creating yours to edit it or say another action i can do for you.")
              }
              return navigate(`/edit-post/${currentViewingPost?.postId}`)
            }
            navigate(navigationPath(destination, currentUserId as string))
            break;

          case "like_post":
            const isPostLiked = checkIfPostIsLiked(currentUserId!, currentViewingPost?.likes!)
            if (isPostLiked) {
              AISpeak("The post you want to like is already liked.")
            } else {
              await likeAndUnlikePost(currentViewingPost!, currentUserId!)
              AISpeak("The post has been liked")
            }
            break;

          case "unlike_post":
            const postAlreadyUnliked = checkIfPostIsLiked(currentUserId!, currentViewingPost?.likes!)
            if (postAlreadyUnliked) {
              await likeAndUnlikePost(currentViewingPost!, currentUserId!)
              AISpeak("The post has been unliked")
            } else {
              AISpeak("The post you are trying to unlike is already unliked.")
            }
            break;

          case "comment":
            const { message } = res
            if (message) {
              const user = await getUserById(currentUserId!)
              const comment = {
                userId: currentUserId!,
                commentProfilePicUrl: user.profilePicUrl,
                postId: currentViewingPost?.postId!,
                commentText: message
              }
              await commentToPost(comment, currentViewingPost!)
              AISpeak(`I have commented ${message} on this post.`)
              navigate(`/post-details/${currentViewingPost?.postId}`)
            } else {
              AISpeak("What will i comment on the post.")
            }
            break;

          case "save_post":
            const isPostSaved = checkIfPostIsBookmarked(currentUserId!, currentViewingPost?.saves!)
            if (isPostSaved) {
              AISpeak("The post you want to save is already saved.")
            } else {
              await bookmarkAndUnbookPost(currentViewingPost!, currentUserId!)
              AISpeak("The post has been saved")
            }
            break;

          case "unsave_post":
            const isPostAlreadySaved = checkIfPostIsBookmarked(currentUserId!, currentViewingPost?.saves!)
            if (isPostAlreadySaved) {
              await bookmarkAndUnbookPost(currentViewingPost!, currentUserId!)
              AISpeak("The post has been unsaved")
            } else {
              AISpeak("The post is unsave already.")
            }
            break;

          case "delete_post":
            const isPostOwnedByCurrentUser = currentUserId! === currentViewingPost?.userId
            if (!isPostOwnedByCurrentUser) {
              return AISpeak("You are not allowed to delete a post that you didn't created. Please say any other action i can do for you such as comment, like or save the post.")
            }
            await deletePost(currentViewingPost.postId!, currentViewingPost.imageUrl)
            AISpeak("Post has been deleted successfully.")
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

  const postRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const post = entry.target.getAttribute("data-post");
            if (post) {
              const p = JSON.parse(post)
              setCurrentViewingPost(p);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    postRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      postRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [posts]);

  if (error) {
    toast({
      title: error.message,
      variant: "destructive"
    })
  }

  return (
    <section className="flex flex-col gap-4 pt-3 pb-44 xl:pb-20">
      <div className="lg:mx-auto xl:pr-[20%]">
        <h2 className="text-[20px] font-semibold w-[98%] mx-auto text-left md:w-full md:text-center">Home Feed</h2>
      </div>

      {isPending 
        ? <Loader className="xl:pr-[22%] mx-auto" />
        : <ul className="xl:pr-[22%] w-[98%] md:w-full flex flex-col gap-10 mx-auto">
          {posts?.map((post, index) => (
            <PostCard 
              ref={(el: HTMLLIElement) => (postRefs.current[index] = el)}
              key={post.postId} post={post} 
              isPending={isPending}
              currentViewingPost={currentViewingPost!}
            />
          ))}
        </ul>
      }

      <RightSideBar /> 

      <SetUserProfile 
        settingUserProfileReady={settingUserProfileReady} 
        setSettingUserProfileReady={setSettingUserProfileReady}
      />
      <AIFirstTime />
    </section>
  )
}

export default Home