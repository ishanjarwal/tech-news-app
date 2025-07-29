"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../constants/constants");
const Image_1 = __importDefault(require("./Image"));
const userSchema = new mongoose_1.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
    },
    bio: {
        type: String,
    },
    avatar: {
        type: Image_1.default,
    },
    cover_image: {
        type: Image_1.default,
    },
    socialLinks: {
        github: {
            type: String,
        },
        linkedin: {
            type: String,
        },
        instagram: {
            type: String,
        },
        x: {
            type: String,
        },
        threads: {
            type: String,
        },
        websites: {
            type: [String],
            set: (arr) => {
                if (!arr || arr.length === 0) {
                    return undefined;
                }
                return arr;
            },
            default: undefined,
        },
        youtube: {
            type: String,
        },
        facebook: {
            type: String,
        },
    },
    preferences: {
        theme: { type: String, enum: constants_1.PREFERENCES_THEMES, default: "dark" },
        language: { type: String },
        newsletter: { type: Boolean, default: true },
    },
    roles: {
        type: [String],
        enum: constants_1.USER_ROLES,
        default: ["user"],
    },
    status: {
        type: String,
        enum: constants_1.USER_STATUS,
        default: "active",
    },
    login_provider: { type: String, required: true },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
