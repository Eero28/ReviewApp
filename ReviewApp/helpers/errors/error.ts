import { AxiosError } from "axios";

export const errorHandler = (e: unknown, handleLogout?: () => void) => {
  if (e instanceof AxiosError && e.response) {
    const { status, data } = e.response;

    if (status === 401) {
      console.error(data?.message || "Unauthorized");
      handleLogout?.();
      throw new Error("401 Unauthorized");
    }

    if (status === 404) {
      console.error(data?.message || "Not Found");
      throw new Error("404 Not Found");
    }

    if (status === 500) {
      console.error(data?.message || "Internal Server Error");
      throw new Error("500 Error");
    }

    console.error(data?.message || "Unknown Error");
    throw new Error(`${status} Error`);
  } else {
    // Not axios error
    throw e;
  }
};
