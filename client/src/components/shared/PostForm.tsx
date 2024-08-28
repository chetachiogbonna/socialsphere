import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createPostSchema } from "@/lib/validation";
import { useCreateNewPost, useUpdatePost } from "@/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import Loader from "./Loader";
import { serverTimestamp } from "firebase/firestore";
import GenerateImage from "./GenerateImage";
import { aiContext } from "@/context/AIContext";

type PostFormProps = {
  post?: Post;
  action: "Create" | "Edit";
};

function PostForm({ post, action }: PostFormProps) {
  const { postId } = useParams()
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUserId, isLoading: isUserLoading } = useUser();
  const { isAIInAction, isImageGenerating } = aiContext();

  const [imageUrl, setImageUrl] = useState(post?.imageUrl || "");
  const [imageFilePath, setImageFilePath] = useState<File | undefined>();
  const [imageBlob, setImageBlob] = useState<Blob | undefined>();

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: post?.title || "",
      imageUrl: post?.imageUrl || "",
      location: post?.location || "",
      tags: post?.tags || "",
    },
  });

  const { mutateAsync: createPost, isPending: isCreatingPost } = useCreateNewPost();
  const { mutateAsync: updatePost, isPending: isUpdatingPost } = useUpdatePost();

  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title || "",
        imageUrl: post.imageUrl || "",
        location: post.location || "",
        tags: post.tags || "",
      });
      setImageUrl(post.imageUrl || "");
    }
  }, [post, form]);  

  if (isUserLoading) return <Loader className="mx-auto" />;

  async function onSubmit(values: z.infer<typeof createPostSchema>) {  
    if (!values.imageUrl) {
      return toast({
        title: "Please upload or generate an image.",
        variant: "destructive",
      });
    }
  
    const postValues = {
      ...values,
      imageFilePath: post?.imageFilePath || imageBlob || imageFilePath as File | Blob,
      userId: currentUserId!,
      createdAt: serverTimestamp() as unknown as FirestoreTimestamp,
      updatedAt: serverTimestamp() as unknown as FirestoreTimestamp,
      likes: post?.likes || [],
      saves: post?.saves || [],
      comments: post?.comments || [],
    };
    
    try {
      if (action === "Create") {
        await createPost(postValues);
        toast({ title: "Post created successfully!" });
        form.reset();
        navigate("/");
      } else if (action === "Edit") {
        await updatePost({ ...postValues, postId: post?.postId || postId });
        toast({ title: "Post updated successfully!" });
        form.reset();
        navigate(`/post-details/${post?.postId}`);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast({
        title: error instanceof Error ? error.message : "An error occurred.",
        variant: "destructive",
      });
    }
  }
  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto space-y-4 w-[98%] md:w-[80%] max-sm:last:mb-14"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Textarea
                  className="bg-[#1A1A1A] border-light focus-visible:ring-offset-1 focus:ring-offset-dark-2 text-white"
                  placeholder="What's on your mind..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Image</FormLabel>
              <FormControl>
                <GenerateImage
                  field={field.onChange}
                  imageUrl={imageUrl || post?.imageUrl}
                  setImageFilePath={setImageFilePath}
                  setImageBlob={setImageBlob}
                  setImageUrl={setImageUrl}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  className="bg-[#1A1A1A] border-light focus-visible:ring-offset-1 focus:ring-offset-dark-3 text-white"
                  placeholder="Location"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input
                  className="bg-[#1A1A1A] border-light focus-visible:ring-offset-1 focus:ring-offset-dark-3 text-white"
                  placeholder="Tags"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end items-center gap-3">
          <Button
            type="reset"
            onClick={() => navigate("/")}
            className="bg-dark-3 hover:bg-dark-3 border border-light px-3 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue hover:bg-blue transition-colors px-3 rounded-lg"
            disabled={isCreatingPost || isUpdatingPost || isAIInAction || isImageGenerating}
          >
            {isCreatingPost 
              ? <><Loader /> creating..</>
              : isUpdatingPost 
                ? <><Loader /> updating...</> 
                : action
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default PostForm;
