"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants/constants");
const calcRaadingTime = (content) => {
    const seconds = (content.length / 5 / constants_1.AVG_READ_RATE) * 60;
    return Math.round(seconds);
};
exports.default = calcRaadingTime;
