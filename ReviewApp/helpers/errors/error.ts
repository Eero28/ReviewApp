import { AxiosError } from "axios";

export const errorHandler = (e: unknown, handleLogout?: () => void) => {
  if (e instanceof AxiosError) {
    if (!e.response) {
      console.error("Network Error: Could not reach server", e.message);
      throw new Error("Network Error");
    }

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
    throw e;
  }
};
