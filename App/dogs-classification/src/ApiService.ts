import { IApiResponse } from "./interfaces";
import Constants from "./utils/Constants";

export async function fetchData(): Promise<IApiResponse> {
  try {
    const response = await fetch(`${Constants.BaseApiUrl}/data`, {
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

export function getImageUrl(id: string): string {
  return `${Constants.BaseApiUrl}/images/${id}`;
}