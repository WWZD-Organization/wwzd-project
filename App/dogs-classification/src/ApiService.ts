import { IApiResponse } from "./interfaces";
import { IPostDog } from "./interfaces/IPostDog";
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

export async function sendImageToProcess(dogData: IPostDog) {
   try {
    console.log(dogData)
    const response = await fetch(`${Constants.BaseApiUrl}/data`, {
      body: JSON.stringify(dogData),
      method: "POST",
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