"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slugify = (str) => {
    return str
        .toLowerCase() // convert to lowercase
        .trim() // remove leading/trailing whitespace
        .replace(/[^a-z0-9\s]/g, "") // remove special characters (only keep letters, numbers, and spaces)
        .replace(/\s+/g, "-") // replace spaces with dashes
        .replace(/-+/g, "-") // collapse multiple dashes
        .replace(/^-+|-+$/g, ""); // remove starting/ending dashes
};
exports.default = slugify;
