import { Post } from "@/types";
import { create } from "zustand";

interface PostStore {
  currentViewingPost: Post | null,
  setCurrentViewingPost: (post: Post) => void,
  imageFile: File | null;
  post: Pick<Post, "title" | "location" | "tags"> | null;
  setPost: (post: Pick<Post, "title" | "location" | "tags">) => void;
  setImageFile: (imageFile: File | null) => void;
  imageUrl: string | null;
  setImageUrl: (imageUrl: string) => void;
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
}));

export default usePostStore;