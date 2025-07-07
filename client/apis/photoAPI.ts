import { env } from "@/config/env";
import { ReduxErrorPayload, ReduxSuccessPayload } from "@/types/types";
import axios from "axios";

export async function uploadProfilePictureAPI(image: Blob):Promise<ReduxSuccessPayload> {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/upload-profile-picture`;
      const formData: FormData = new FormData()
      formData.append('image', image)
      const response = await axios.post(
        url,
        formData,
        { withCredentials: true }
      );
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}


export async function deleteProfilePictureAPI() {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/profile-picture`;
      const response = await axios.delete(
        url,
        { withCredentials: true }
      );
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}


export async function uploadCoverImageAPI(image: Blob):Promise<ReduxSuccessPayload> {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/upload-cover-image`;
      const formData: FormData = new FormData()
      formData.append('image', image)
      const response = await axios.post(
        url,
        formData,
        { withCredentials: true }
      );
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}


export async function deleteCoverImageAPI() {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `${env.NEXT_PUBLIC_BASE_URL}/user/cover-image`;
      const response = await axios.delete(
        url,
        { withCredentials: true }
      );
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
}