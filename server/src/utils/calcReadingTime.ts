import { AVG_READ_RATE } from "../constants/constants";

// Utility to strip HTML tags using regex
const stripHTML = (html: string): string => {
  return html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "") // Remove script tags and content
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "") // Remove style tags and content
    .replace(/<\/?[^>]+(>|$)/g, "") // Remove remaining HTML tags
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim(); // Trim leading/trailing spaces
};

// Calculate reading time based on word count
const calcReadingTime = (content: string): number => {
  const text = stripHTML(content);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const seconds = (wordCount / AVG_READ_RATE) * 60;
  return Math.round(seconds);
};

export default calcReadingTime;
