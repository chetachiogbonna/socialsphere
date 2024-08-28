import Loader from "@/components/shared/Loader";
import PostForm from "@/components/shared/PostForm";
import { useToast } from "@/components/ui/use-toast";
import { aiContext } from "@/context/AIContext";
import { useUser } from "@/hooks/useUser";
import { generateImage, talkToAI } from "@/lib/config/api";
import { AISpeak, navigationPath } from "@/lib/utils";
import { useGetPostById } from "@/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditPost() {
  const { postId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: postToEdit, isPending } = useGetPostById(postId as string);

  const { transcript, isAIInAction, setIsAIInAction, setIsImageGenerating, setImagePrompt } = aiContext();
  const { currentUserId } = useUser();
  const [post, setPost] = useState<Post>(postToEdit!);

  useEffect(() => {
    if (postToEdit) {
      setPost({ postId: postToEdit.postId || postId, ...postToEdit });
    }
  }, [postToEdit]);

  useEffect(() => {
    const interactWithAI = async () => {
      try {
        const res = await talkToAI(transcript);
        
        const updatePostAction = async () => {
          const { title, image_prompt, location, tags, message } = res;
          const updatedPost = { ...post };
          if (title) updatedPost.title = title;
          if (location) updatedPost.location = location;
          if (tags && tags.length > 0) updatedPost.tags = tags.join(" ");
          
          if (image_prompt) {
            setIsImageGenerating(true);
            setImagePrompt(image_prompt);
            const blob = await generateImage(image_prompt);
            const imageUrl = URL.createObjectURL(blob);
            updatedPost.imageUrl = imageUrl;
            updatedPost.imageFilePath = blob;
            setIsImageGenerating(false);
          }

          setPost(updatedPost);
          if (message) AISpeak(message);
        }
        
        const { action } = res;
        if (!action) return updatePostAction()
     
        switch (action) {
          case "edit_post":
            updatePostAction()
            break;

          case "navigate":
            const { destination } = res;
            if (!destination) {
              return toast({ title: "Please say the page you want to go." });
            }

            if (navigationPath(destination, currentUserId as string) === "ai_speak") {
              return AISpeak("I'm sorry but the page you want to be navigated to does not exist.")
            } 
            navigate(navigationPath(destination, currentUserId!));
            break;

          default:
            AISpeak("I couldn't understand what you want. Please say something else.");
            break;
        }
      } catch (error) {
        setIsImageGenerating(false);
        toast({
          title: error instanceof Error ? error.message : "An error occurred. Please refresh the page and try again.",
          variant: "destructive",
        });
      } finally {
        setIsAIInAction(false);
        setImagePrompt("");
      }
    };

    if (isAIInAction) {
      interactWithAI();
    }
  }, [isAIInAction, transcript, post]);

  if (isPending) {
    return <Loader className="mx-auto" />;
  }

  return (
    <section className="pt-3 pb-32 md:pb-20 lg:w-[80%] mx-auto">
      <div className="mx-auto mb-14 flex gap-1 items-center w-[98%] md:w-[80%]">
        <img src="/assets/icons/edit-icon.svg" className="change-icon" width={40} height={40} alt="edit post" />
        <h2 className="text-2xl font-medium">Edit Post</h2>
      </div>

      <p className="w-[98%] md:w-[80%] mx-auto text-xs text-center text-gray-400">
        Tips: (you can tell the AI to edit certain parts of the post and make sure to emphasize the word "Edit or Update" to make it understand well.)
      </p>

      <PostForm action="Edit" post={post} />
    </section>
  );
}

export default EditPost;
