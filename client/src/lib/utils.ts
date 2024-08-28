import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getCurrentUser } from "./config/api";
import { redirect } from "react-router-dom";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const loader = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return redirect("/sign-up")

    return currentUser;
  } catch (error) {
    console.log(error)
    return null;
  }
}

export const changePageTitle = (pathname: string) => {
  let routeName;

  switch (pathname === "/create-post") {
    case true:
      routeName = pathname.split("/")[1].split("")[0].toLocaleUpperCase() + pathname.split("/")[1].slice(1, pathname.length - 1).replace("-", " ")
      break;
    case false:
      routeName =  pathname !== "/"
      ? pathname.split("/")[1].split("")[0].toLocaleUpperCase() + pathname.split("/")[1].slice(1, pathname.length - 1) 
      : ""
      break;
    default:
      break;
  }

  const titleElement = document.querySelector("title") as HTMLTitleElement;
  titleElement.textContent = `Socialsphere ${routeName && "|"} ${routeName}`
}

export const checkIfPostIsLiked = (currentUser: string, likesArray: string[]) => {
  return likesArray.includes(currentUser)
}

export const checkIfPostIsBookmarked = (currentUser: string, bookmarkArray: string[]) => {
  return bookmarkArray.includes(currentUser)
}

export const convertToReadableDateString = (timestamp: FirestoreTimestamp) => { 
  const milliseconds = timestamp?.seconds * 1000 + timestamp?.nanoseconds / 1000000;
  const date = new Date(milliseconds);

  const timeAgo = (date: Date): string => {
    const now = new Date();
    const secondsDiff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    if (secondsDiff < 60) return "just now";
    const minutes = Math.floor(secondsDiff / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  
    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  };
  
  return timeAgo(date);
}

export const formatFirestoreTimestampToTime = (timestamp: FirestoreTimestamp): string => {
  const date = new Date(timestamp?.seconds ? (timestamp?.seconds * 1000) : Date.now());
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours % 12 || 12; 
  const amPm = hours >= 12 ? "PM" : "AM";

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${amPm}`;
}

export const AISpeak = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();

    utterance.lang = 'en-US'; 
    utterance.pitch = 1; 
    utterance.rate = 1.5; 
    utterance.volume = 1; 

    window.speechSynthesis.speak(utterance);
  } else {
    alert('Sorry, your browser does not support text-to-speech!');
  }
}

export const navigationPath = (destination: string, currentUserId: string) => {
  if (
    (
      window.location.pathname !== "/" ||
      !window.location.pathname.startsWith("/post-details")
    ) && destination === "edit-post"
  ) {
    AISpeak("There's no post i can see to edit.")
    return ""
  } else {
    if (destination === "home" || destination.includes("home")) {
      return "/";
    } else if (destination === "messages" || destination.includes("messages")) {
      return "/messages";
    } else if (destination === "bookmarks" || destination.includes("bookmarks")) {
      return `/bookmarks/${currentUserId}`;
    } else if (destination === "people" || destination.includes("people")) {
      return "/people";
    } else if (destination === "create-post" || destination.includes("create")) {
      return "/create-post";
    } else if (destination === "edit-post" || destination.includes("edit")) {
      return "edit-post";
    } else if (destination === "profile" || destination.includes("profile")) {
      return `/profile/${currentUserId}`
    } else if (destination === "post-details" || destination.includes("post details")) {
      return "post-details";
    } else {
      return "ai_speak"
    }
  }
}