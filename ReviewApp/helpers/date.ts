export const calculateDate = (date: string) => {
  const createdAt = new Date(date);
  const currentTime = new Date();

  const timeDifference = currentTime.getTime() - createdAt.getTime();
  const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365.25)); // leap year considered
  const months = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24 * 365.25)) /
      (1000 * 60 * 60 * 24 * 30.44)
  ); // avg of days per month
  const days = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24)
  );
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  // return time when comment/item has been made
  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB");
};
