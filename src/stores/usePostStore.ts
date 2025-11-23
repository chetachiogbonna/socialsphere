import { Post } from "@/types";
import { create } from "zustand";

interface PostStore {
  currentViewingPost: Post | null,
  setCurrentViewingPost: (post: Post) => void,
  imageFile: File | Blob | null;
  post: Pick<Post, "title" | "location" | "tags"> | null;
  setPost: (post: Pick<Post, "title" | "location" | "tags"> | null) => void;
  setImageFile: (imageFile: File | Blob | null) => void;
  imageUrl: string | null;
  setImageUrl: (imageUrl: string) => void;
  isGeneratingImage: boolean,
  setIsGeneratingImage: (isGeneratingImage: boolean) => void,
  imagePrompt: string,
  setImagePrompt: (imagePrompt: string) => void,
  imageGenerationError: string | null
  setImageGenerationError: (errorMsg: string | null) => void,
}

const usePostStore = create<PostStore>((set) => ({
  currentViewingPost: null,
  setCurrentViewingPost: (post) => set({ currentViewingPost: post }),
  imageFile: null,
  post: null,
  setPost: (post) => set({ post }),
  setImageFile: (imageFile) => set({ imageFile }),
  imageUrl: null,
  setImageUrl: (imageUrl) => set({ imageUrl }),
  isGeneratingImage: false,
  setIsGeneratingImage: (isGeneratingImage) => set({ isGeneratingImage }),
  imagePrompt: "",
  setImagePrompt: (imagePrompt) => set({ imagePrompt }),
  imageGenerationError: null,
  setImageGenerationError: (errorMsg: string | null) => set({ imageGenerationError: errorMsg })
}));

export default usePostStore;