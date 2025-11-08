"use client";

import React, { useEffect, useState } from 'react'
import { Form } from './ui/form'
import CustomFormField from './CustomFormField'
import { Button } from './ui/button'
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema } from '@/lib/formSchemas';
import z from 'zod';
import { useForm } from 'react-hook-form';
import usePostStore from '@/stores/usePostStore';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { uploadImage } from '@/lib/utils';
import { Id } from '../../convex/_generated/dataModel';
import { Post } from '@/types';
import useCurrentUserStore from '@/stores/useCurrentUserStore';
import { useRouter } from 'next/navigation';

function CustomForm({ post, type }: { post?: Post, type: "Update" | "Create" }) {
  const router = useRouter();
  const { currentUser } = useCurrentUserStore();
  const [showImageError, setShowImageError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { imageUrl, imageFile, setImageUrl, post: newPost } = usePostStore();

  useEffect(() => {
    if (type === "Update" && post?.imageUrl) {
      setImageUrl(post.imageUrl);
    } else if (type === "Create") {
      setImageUrl("");
    }
  }, [post, setImageUrl, type]);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: newPost?.title || post?.title || "",
      location: newPost?.location || post?.location || "",
      tags: newPost?.tags || post?.tags || [],
    },
  });

  useEffect(() => {
    if (newPost) {
      if (newPost.title) {
        form.setValue("title", newPost.title);
      }
      if (newPost.location) {
        form.setValue("location", newPost.location);
      }
      if (newPost.tags && newPost.tags.length) {
        form.setValue("tags", newPost.tags);
      }
    }
  }, [newPost, form]);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)
  const getImageUrl = useMutation(api.storage.getImageUrl)
  const deleteImage = useMutation(api.storage.deleteById)
  const createPost = useMutation(api.post.createPost)
  const updatePost = useMutation(api.post.updatePost)

  const onSubmit = async (values: z.infer<typeof postSchema>) => {
    setShowImageError(false);
    if (!post && !imageUrl) {
      setShowImageError(true);
      return;
    }

    setIsSubmitting(true)

    try {
      if (type === "Update") {
        // Update post logic here
        if (!post) return;
        // If imageUrl has changed, upload the new image
        if (imageFile) {
          await deleteImage({ imageId: post.imageId as Id<"_storage"> });
          const url = await generateUploadUrl();
          const imageId = await uploadImage(url, imageFile!) as Id<"_storage">;
          const realImageUrl = await getImageUrl({ storageId: imageId as Id<"_storage"> }) as string;
          updatePost({
            postId: post._id,
            title: values.title,
            location: values.location,
            tags: values.tags,
            imageUrl: realImageUrl,
            imageId,
          });
        } else {
          updatePost({
            postId: post._id,
            title: values.title,
            location: values.location,
            tags: values.tags,
            imageUrl: post.imageUrl,
            imageId: post.imageId as Id<"_storage">,
          });
        }

        router.push(`/post-details/${post?._id}`);
      } else {
        // Create post logic here
        const url = await generateUploadUrl();
        const imageId = await uploadImage(url, imageFile!);
        const realImageUrl = await getImageUrl({ storageId: imageId as Id<"_storage"> }) as string;
        await createPost({
          ownerId: currentUser?._id as Id<"users">,
          imageUrl: realImageUrl,
          ...values,
          imageId,
        });

        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 pb-18"
      >
        <CustomFormField control={form.control} label={{ name: "Title" }} />

        <div>
          <div id="scroll-image" />
          <CustomFormField control={form.control} label={{ name: "Image" }} post={post} />
          {showImageError && (
            <p className="text-red-500 text-sm">
              Please upload an image before submitting.
            </p>
          )}
        </div>

        <div id="scroll-location" />
        <CustomFormField control={form.control} label={{ name: "Location" }} />

        <div id="scroll-tags" />
        <CustomFormField control={form.control} label={{ name: "Tags", watch: form.watch, setValue: form.setValue }} />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-2/4 bg-blue cursor-pointer hover:bg-blue"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"
                    viewBox="0 0 24 24"
                  ></svg>
                  {type.slice(0, 5)}ing...
                </>
              ) : `${type} Post`
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CustomForm