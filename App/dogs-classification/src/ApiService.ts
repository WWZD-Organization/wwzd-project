import { IApiResponse } from "./interfaces";
import { IPostDog } from "./interfaces/IPostDog";
import Constants from "./utils/constants";

export async function fetchData(method: string): Promise<IApiResponse> {
  try {
    const response = await fetch(`${Constants.BaseApiUrl}/data?method=${method}`, {
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
    const form = new FormData();
    form.append("name", dogData.form.name);
    form.append("description", dogData.form.description);
    form.append("image", dogData.form.image);

    const response = await fetch(`${Constants.BaseApiUrl}/data?method=${dogData.form.method}`, {
      method: "POST",
      body: form
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