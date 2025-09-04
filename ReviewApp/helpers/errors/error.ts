import { AxiosError } from "axios";

export const errorHandler = (e: unknown, handleLogout?: () => void) => {
  if (e instanceof AxiosError) {
    if (!e.response) {
      console.log("Network Error: Could not reach server", e.message);
      throw new Error("Network Error");
    }

    const { status, data } = e.response;
    const message = data?.message || "Unknown error";
    switch (status) {
      case 401:
        alert(`${message}. Please log in again`);
        handleLogout?.();
      case 404:
        console.log(message);
        throw new Error(`404 Not Found: ${message}`);
      case 500:
        console.log(message);
        throw new Error(`500 Error: ${message}`);
      default:
        console.log(message);
        throw new Error(`${status} Error: ${message}`);
    }
    // other error
  } else {
    throw e;
  }
};
