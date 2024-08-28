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

    if (!currentUser) return redirect("/sign-in")

    return currentUser;
  } catch (error) {
    console.log(error)
    return null;
  }
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
  const date = new Date(timestamp?.seconds ? (timestamp?.seconds * 1000) : Date.now()); // Convert seconds to milliseconds
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Convert to 12-hour format
  const formattedHours = hours % 12 || 12; // If 0, show as 12
  const amPm = hours >= 12 ? "PM" : "AM";

  // Ensure two-digit minute format (e.g., 08, 10)
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${amPm}`;
}