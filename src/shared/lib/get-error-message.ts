import axios from "axios";

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Failed to add project directory";
    return Array.isArray(message) ? message.join(", ") : message;
  }

  if (err instanceof Error) return err.message;
  return "An unexpected error occurred.";
}
