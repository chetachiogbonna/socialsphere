import { z } from "zod"

export const signInSchema = z.object({
  email: z.string().email({ message: "wrong email." }),
  password: z.string().min(8, { message: "password must atleast be 8 characters." }),
})

export const signUpSchema = z.object({
  name: z.string().min(5, { message:  "name must be atleast 5 characters." }).max(10),
  email: z.string().email(),
  username: z.string().min(5, { message:  "username must be atleast 5 characters." }).max(10),
  password: z.string().min(8, { message: "password must be atleast 8 characters." }),
})

export const createPostSchema = z.object({
  title: z.string().min(5).max(2000),
  imageUrl: z.string(),
  location: z.string().min(5),
  tags: z.string().min(5),
})

export const profileSchema = z.object({
  coverImgUrl: z.string().min(1),
  profilePicUrl: z.string().min(1),
  bio: z.string().min(10).max(1000)
})