import { AVG_READ_RATE } from "../constants/constants";

const calcRaadingTime = (content: string): number => {
  const seconds = (content.length / 5 / AVG_READ_RATE) * 60;
  return Math.round(seconds);
};

export default calcRaadingTime;
