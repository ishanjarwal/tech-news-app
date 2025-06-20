import { RequestHandler } from "express";
import multer from "multer";

interface UploadValues {
  allowedMimetypes: string[];
  sizeLimit: number; // in MB
  fieldName: string; // file field name in the form (e.g., "thumbnail")
}

const handleUpload = ({
  allowedMimetypes,
  sizeLimit,
  fieldName,
}: UploadValues): RequestHandler => {
  const storage = multer.memoryStorage(); // store file in memory as buffer

  const upload = multer({
    storage,
    limits: {
      fileSize: sizeLimit * 1024 * 1024, // convert MB to bytes
    },
    fileFilter: (req, file, cb) => {
      if (allowedMimetypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        const message =
          "only " +
          allowedMimetypes
            .map((type) => type.split("/")[1]) // extract extension
            .map((ext) => ext.toLowerCase()) // ensure lowercase
            .join(", ")
            .replace(/, ([^,]*)$/, " or $1") +
          " allowed";
        cb(new Error(message));
      }
    },
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code == "LIMIT_FILE_SIZE") {
          req.validationErrors = [
            { path: fieldName, msg: `Upto ${sizeLimit}MB allowed` },
          ];
        } else {
          req.validationErrors = [{ path: fieldName, msg: err.message }];
        }
      } else if (err) {
        req.validationErrors = [{ path: fieldName, msg: err.message }];
      }
      next();
    });
  };
};

export default handleUpload;
