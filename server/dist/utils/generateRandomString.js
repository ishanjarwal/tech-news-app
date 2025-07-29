"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateRandomString(length = 8) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        password += letters[randomIndex];
    }
    return password;
}
exports.default = generateRandomString;
