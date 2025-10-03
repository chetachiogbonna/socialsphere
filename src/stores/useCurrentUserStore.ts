import { User } from "@/types";
import { create } from "zustand";

type useCurrentUserStoreType = {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
}

const useCurrentUserStore = create<useCurrentUserStoreType>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user })
}));

export default useCurrentUserStore;