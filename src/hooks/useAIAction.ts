"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import usePostStore from "@/stores/usePostStore";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AIResponse, Post } from "@/types";
import { Id } from "../../convex/_generated/dataModel";
import useCurrentUserStore from "@/stores/useCurrentUserStore";
import { toast } from "sonner";

let isGloballyProcessing = false;
let lastGlobalTranscript = "";

function useAIAction() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);
  const aiIsSpeakingRef = useRef(false);

  const mode = typeof window !== "undefined" && JSON.parse(localStorage.getItem("lazy-mode")!);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const { currentUser } = useCurrentUserStore();
  const { post, setPost } = usePostStore();

  const toggleLikeMutation = useMutation(api.post.toggleLike);
  const toggleSaveMutation = useMutation(api.post.toggleSave);
  const handleComment = useMutation(api.post.comment);
  const handleDeletePost = useMutation(api.post.deletePost)


  const runAI = useCallback(
    async (textInput: string) => {
      const speak = (text: string) => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "en-US";

          aiIsSpeakingRef.current = true;
          SpeechRecognition.stopListening()

          async function simulateSpeech(text: string, delay = 380) {
            const words = `Speaking this text: ${text}`.split(" ");
            for (let i = 0; i < words.length; i++) {
              await new Promise(resolve => setTimeout(resolve, delay));
            }

            if (aiIsSpeakingRef.current) {
              aiIsSpeakingRef.current = false;
              if (mode) {
                SpeechRecognition.startListening({ continuous: true, language: "en-US" });
              }
            }
          }

          simulateSpeech(text);

          speechSynthesis.speak(utterance);

          utterance.onend = () => {
            aiIsSpeakingRef.current = false;
            if (mode) {
              SpeechRecognition.startListening({ continuous: true, language: "en-US" });
            }
          };

        }
      }

      if (!textInput) {
        speak("Please provide an input!");
        return { response: "Please provide an input!" };
      }

      if (isGloballyProcessing || textInput === lastGlobalTranscript) {
        return;
      }

      isGloballyProcessing = true;
      lastGlobalTranscript = textInput;
      setLoading(true);

      try {
        const res = await fetch("/talk-to-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: textInput, currentPage: pathname, lastResponse }),
        });

        const raw = await res.json();
        const parsed: AIResponse = JSON.parse(raw);

        const currentViewingPost = JSON.parse(localStorage.getItem("currentViewingPost") || "{}") as Post;

        if ((pathname === "/" || pathname.startsWith("/post-details/")) && ["navigate", "like_post", "unlike_post", "save_post", "unsave_post", "comment"].includes(parsed.action)) {

          const likePost = (userId: Id<"users">, type: "like_post" | "unlike_post") => {
            const likes = currentViewingPost.likes;
            const alreadyLiked = likes.includes(userId);

            if (type === "like_post") {
              if (alreadyLiked) {
                parsed.response = "This post is already liked!";
              } else {
                toggleLikeMutation({ postId: currentViewingPost._id, userId });
              }
              return;
            }

            if (type === "unlike_post") {
              if (alreadyLiked) {
                toggleLikeMutation({ postId: currentViewingPost._id, userId });
              } else {
                parsed.response = "The post you are trying to unlike is not liked!";
              }
            }
          }

          const savePost = (userId: Id<"users">, type: "save_post" | "unsave_post") => {
            const saves = currentViewingPost.saves;
            const alreadySaved = saves.includes(userId);

            if (type === "save_post") {
              if (alreadySaved) {
                parsed.response = "This post is already saved!";
              } else {
                toggleSaveMutation({ postId: currentViewingPost._id, userId });
              }
              return;
            }

            if (type === "unsave_post") {
              if (alreadySaved) {
                toggleSaveMutation({ postId: currentViewingPost._id, userId });
              } else {
                parsed.response = "The post you are trying to unsave is not saved!";
              }
            }
          }

          if (!currentUser) {
            toast.error("No user found.");
            return parsed;
          }

          switch (parsed.action) {
            case "like_post":
              likePost(currentUser._id, "like_post")
              break;
            case "unlike_post":
              likePost(currentUser._id, "unlike_post")
              break;
            case "save_post":
              savePost(currentUser._id, "save_post")
              break;
            case "unsave_post":
              savePost(currentUser._id, "unsave_post")
              break;
            case "comment":
              handleComment({
                comment: {
                  userId: currentUser._id,
                  text: parsed.message
                },
                postId: currentViewingPost._id
              })
              break;
            case "delete_post":
              if (currentUser._id !== currentViewingPost.ownerId) {
                return;
              }

              handleDeletePost({
                postId: currentViewingPost._id,
                imageId: currentViewingPost.imageId as Id<"_storage">
              })
              break;
          }
        }

        if (pathname === "/create-post" && parsed.action === "create_post" && ["navigate", "create_post"].includes(parsed.action)) {
          const typingEffect = async (textOrArray: string | string[], field: string) => {
            if (Array.isArray(textOrArray)) {
              let newArray: string[] = []

              for (const item of textOrArray) {
                await new Promise((resolve) => setTimeout(resolve, 500));
                newArray = [...newArray, item];

                setPost({ ...post, [field]: newArray } as Pick<Post, "title" | "location" | "tags">)
              }

              setPost({ ...post, [field]: newArray } as Pick<Post, "title" | "location" | "tags">)
              return;
            }

            const newTextArray = textOrArray.split("")
            let newText = "";

            for (let i = 0; i < newTextArray.length; i++) {
              await new Promise((resolve) => setTimeout(resolve, 100));
              newText += newTextArray[i];

              setPost({ ...post, [field]: newText } as Pick<Post, "title" | "location" | "tags">)
            }

            setPost({ ...post, [field]: newText } as Pick<Post, "title" | "location" | "tags">)
          }

          const scrollTitle = document.getElementById("scroll-title");
          const scrollLocation = document.getElementById("scroll-location");
          const scrollTags = document.getElementById("scroll-tags");

          scrollTitle?.scrollIntoView({ behavior: "smooth", block: "start" })
          await typingEffect(parsed.title, "title")

          scrollLocation?.scrollIntoView({ behavior: "smooth", block: "center" })
          await typingEffect(parsed.location, "location")

          scrollTags?.scrollIntoView({ behavior: "smooth", block: "center" })
          await typingEffect(parsed.tags, "tags")
          scrollTags?.scrollIntoView({ behavior: "smooth", block: "end" })
        }

        if (parsed.action === "navigate") {
          if (parsed.destination === "post-details") {
            router.push(`/${parsed.destination}/${currentViewingPost._id}`);
          } else {
            router.push(`/${parsed.destination}`);
          }
        }

        if ("response" in parsed) {
          if (parsed.action === "delete_post" && currentUser?._id !== currentViewingPost.ownerId) {
            return speak("This post does not belong to you, you cannot delete it.");
          }

          speak(parsed.response);
        }

        setLastResponse(parsed);
        return parsed;
      } catch (error) {
        console.error("AI action failed", error);
        const fallback: AIResponse = {
          action: "unsupported",
          message: "AI parsing failed",
          response: "Something went wrong, please try again.",
        };
        speak(fallback.response);
        return fallback;
      } finally {
        isGloballyProcessing = false;
        setLoading(false);
        setTimeout(() => {
          lastGlobalTranscript = "";
        }, 1000);
      }
    },
    [pathname, router, toggleLikeMutation, toggleSaveMutation, handleComment, handleDeletePost, currentUser, post, setPost, lastResponse, mode]
  );

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  const stopListening = () => SpeechRecognition.stopListening();

  useEffect(() => {
    if (mode) {
      if (!transcript && !listening && !loading && !aiIsSpeakingRef.current) {
        startListening()
      }
    }
  }, [pathname, loading, listening, transcript, mode]);

  useEffect(() => {
    if (!mode) return;

    let silenceTimer: NodeJS.Timeout | null = null;

    if (transcript && transcript.trim()) {
      if (silenceTimer) clearTimeout(silenceTimer);

      silenceTimer = setTimeout(() => {
        const text = transcript.trim();
        if (text) {
          runAI(text).finally(resetTranscript)
        }
      }, 1000);
    }

    return () => {
      if (silenceTimer) clearTimeout(silenceTimer);
    };
  }, [transcript, runAI, resetTranscript, mode]);

  return {
    runAI,
    lastResponse,
    loading,
    transcript,
    listening,
    aiIsSpeaking: aiIsSpeakingRef.current,
    startListening,
    stopListening,
    resetTranscript
  };
}

export default useAIAction;