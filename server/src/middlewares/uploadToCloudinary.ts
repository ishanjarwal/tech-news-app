import { RequestHandler } from "express";
import cloudinary from "../config/cloudinary";
import { env } from "../config/env";
import { UploadStream } from "cloudinary";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
const uploadToCloudinary =
  (subfolder: string, fieldName: string, filePrefix: string): RequestHandler =>
  async (req, res, next) => {
    try {
      const file = req.file as Express.Multer.File;
      if (!file || !file.buffer) {
        res.error(400, "error", "No file selected", {});
        return;
      }
      const buffer = file.buffer;
      const fileName = `${filePrefix}_${format(
        new Date(),
        "ddMMyyHHmmss"
      )}_${uuidv4()}`;
      const folder = `${env.CLOUDINARY_ROOT_FOLDER}/${subfolder}`;
      const public_id = `${fileName}`;
      const uploadStream: UploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image", // or auto for mixed types
          folder,
          public_id,
          // folder: `${env.CLOUDINARY_ROOT_FOLDER}/${subfolder}`,
          // use_filename: true,
          // filename_override: "custom_profile_pic",
          // unique_filename: true,
        },
        (error, result) => {
          if (error || !result) {
            console.log(error);
            res.error(400, "error", "Something went wrong while uploading", {});
            return;
          }

          req.body[fieldName] = result;
          next();
        }
      );

      uploadStream.end(buffer);
    } catch (err) {
      console.log(err);
      res.error(500, "error", "Something went wrong", {});
      return;
    }
  };

export default uploadToCloudinary;
