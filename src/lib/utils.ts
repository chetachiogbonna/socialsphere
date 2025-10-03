import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const uploadImage = async (url: string, imageFile: File) => {
  try {
    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": imageFile.type },
      body: imageFile,
    });

    const { storageId } = await result.json() as { storageId: string };

    return storageId;
  } catch (error) {
    throw error
  }
}

export const convertToReadableDateString = (timeString: number) => {
  // Handle fractional milliseconds
  const date = new Date(Math.floor(timeString));

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

export const includesId = (arr: string[], id: string) => {
  return arr.includes(id);
}