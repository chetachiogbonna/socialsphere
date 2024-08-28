import PostForm from "@/components/shared/PostForm";
import { useToast } from "@/components/ui/use-toast";
import { aiContext } from "@/context/AIContext";
import { useUser } from "@/hooks/useUser";
import { generateImage, talkToAI } from "@/lib/config/api";
import { AISpeak, navigationPath } from "@/lib/utils";
import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const { transcript, isAIInAction, setIsAIInAction, setIsImageGenerating, setImagePrompt } = aiContext();
  const navigate = useNavigate();
  const { currentUserId } = useUser();
  const { toast } = useToast()
  const [post, setPost] = useState<Post>({
    title: "",
    imageUrl: "",
    imageFilePath: undefined,
    userId: currentUserId!,
    location: "",
    tags: "",
    createdAt: serverTimestamp() as unknown as FirestoreTimestamp,
    updatedAt: serverTimestamp() as unknown as FirestoreTimestamp,
    likes: [],
    saves: [],
    comments: [],
  });

  useEffect(() => {
    const interactWithAI = async () => {
      try {
        const res = await talkToAI(transcript);

        const createPostAction = async () => {
          const { title, image_prompt, location, tags, message } = res;
          if (!title && !image_prompt && !location && !tags) {
            return toast({ 
              title: "A required input field is missing. Please try crafting another prompt.",
              variant: "destructive",
            });
          }
      
          setPost({ ...post, title });

          setIsImageGenerating(true);
          setImagePrompt(image_prompt);
          const blob = await generateImage(image_prompt);
          const imageUrl = URL.createObjectURL(blob);
          setIsImageGenerating(false);

          const newPost = {
            ...post,
            title,
            imageUrl,
            imageFilePath: blob,
            location,
            tags: tags.join(" "),
          };
          setPost(newPost);

          if (message) AISpeak(message);
        };

        const { action } = res;
        if (!action) return createPostAction();

        switch (action) {
          case "create_post":
            createPostAction();
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
  }, [isAIInAction, transcript]);

  return (
    <section className="pt-3 pb-32 md:pb-20 lg:w-[80%] mx-auto">
      <div className="mx-auto mb-6 flex gap-1 items-center w-[98%] md:w-[80%]">
        <img src="/assets/icons/create.svg" className="change-icon" width={40} height={40} alt="create post" />
        <h2 className="text-2xl font-medium">Create Post</h2>
      </div>

      <PostForm action="Create" post={post} />
    </section>
  );
}

export default CreatePost;
