"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const env_1 = require("../config/env");
const date_fns_1 = require("date-fns");
const uuid_1 = require("uuid");
const uploadToCloudinary = (subfolder, fieldName, filePrefix) => async (req, res, next) => {
    try {
        const file = req.file;
        if (!file || !file.buffer) {
            res.error(400, "error", "No file selected", {});
            return;
        }
        const buffer = file.buffer;
        const fileName = `${filePrefix}_${(0, date_fns_1.format)(new Date(), "ddMMyyHHmmss")}_${(0, uuid_1.v4)()}`;
        const folder = `${env_1.env.CLOUDINARY_ROOT_FOLDER}/${subfolder}`;
        const public_id = `${fileName}`;
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            resource_type: "image", // or auto for mixed types
            folder,
            public_id,
            // folder: `${env.CLOUDINARY_ROOT_FOLDER}/${subfolder}`,
            // use_filename: true,
            // filename_override: "custom_profile_pic",
            // unique_filename: true,
        }, (error, result) => {
            if (error || !result) {
                console.log(error);
                res.error(400, "error", "Something went wrong while uploading", {});
                return;
            }
            req.body[fieldName] = result;
            next();
        });
        uploadStream.end(buffer);
    }
    catch (err) {
        console.log(err);
        res.error(500, "error", "Something went wrong", {});
        return;
    }
};
exports.default = uploadToCloudinary;
