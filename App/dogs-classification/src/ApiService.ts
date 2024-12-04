import { ApiResponse } from "./interfaces/ApiResponse";

const baseURL = 'http://127.0.0.1:3000/api/v1/data';

export async function fetchData(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${baseURL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}