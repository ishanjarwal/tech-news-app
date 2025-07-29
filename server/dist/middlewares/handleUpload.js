"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const handleUpload = (allowedMimetypes, sizeLimit, // in mb
fieldName) => {
    const storage = multer_1.default.memoryStorage(); // store file in memory as buffer
    const upload = (0, multer_1.default)({
        storage,
        limits: {
            fileSize: sizeLimit * 1024 * 1024, // convert MB to bytes
        },
        fileFilter: (req, file, cb) => {
            if (allowedMimetypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                const message = "only " +
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
    return async (req, res, next) => {
        upload(req, res, (err) => {
            if (err instanceof multer_1.default.MulterError) {
                if (err.code == "LIMIT_FILE_SIZE") {
                    req.validationErrors = [
                        { path: fieldName, msg: `Upto ${sizeLimit}MB allowed` },
                    ];
                }
                else {
                    req.validationErrors = [{ path: fieldName, msg: err.message }];
                }
            }
            else if (err) {
                req.validationErrors = [{ path: fieldName, msg: err.message }];
            }
            next();
        });
    };
};
exports.default = handleUpload;
