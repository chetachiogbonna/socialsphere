declare type INewUser = { 
  name: string, 
  email: string, 
  username: string, 
  password: string
}

declare type IComment = {
  userId: string,
  commentProfilePicUrl: string,
  postId: string,
  commentText: string
}

declare type FirestoreTimestamp = {
  nanoseconds: number;
  seconds: number;
};

declare type Post = {
  title: string,
  imageUrl: string,
  imageFilePath?: File | Blob,
  userId: string,
  postId?: string,
  location: string,
  tags: string,
  createdAt: FirestoreTimestamp,
  updatedAt: FirestoreTimestamp,
  likes: string[],
  saves: string[],
  comments: IComment[]
}

declare type BookmarkPostType = Post & { bookmarker: string }

declare type IUser = {
  coverImgUrl: string,
  profilePicUrl: string,
  name: string,
  userId: string,
  bio: string,
  follower: string[],
  following: string[],
  saves: Post[],
  likes: string[]
}


declare type Chat = {
  chatId: string,
  type: "text" | "image",
  userId: string,
  message: string,
  createdAt: FirestoreTimestamp
}