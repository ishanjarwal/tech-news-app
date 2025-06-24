import mongoose, { Document, Schema } from "mongoose";
import {
  LOGIN_PROVIDER_OPTIONS,
  PREFERENCES_THEMES,
  USER_ROLES,
  USER_STATUS,
} from "../constants/constants";

export interface UserValues {
  _id: Schema.Types.ObjectId;

  fullname: string;
  username: string;
  email: string;
  password: string;

  bio?: string;
  avatarURL?: string;
  coverImageURL?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    x?: string;
    threads?: string;
    websites?: string[];
    youtube?: string;
    facebook?: string;
  };

  preferences?: {
    theme: (typeof PREFERENCES_THEMES)[number];
    newsletter: boolean;
    language: string;
  };

  roles: (typeof USER_ROLES)[number][];
  status: (typeof USER_STATUS)[number];

  created_at: Date;
  updated_at: Date;

  login_provider: (typeof LOGIN_PROVIDER_OPTIONS)[number];
}

const userSchema = new Schema<UserValues>(
  {
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
    avatarURL: {
      type: String,
    },
    coverImageURL: {
      type: String,
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
        set: (arr: string[] | null) => {
          if (!arr || arr.length === 0) {
            return undefined;
          }
          return arr;
        },
      },
      youtube: {
        type: String,
      },
      facebook: {
        type: String,
      },
    },
    preferences: {
      theme: { type: String, enum: PREFERENCES_THEMES, default: "dark" },
      language: { type: String },
      newsletter: { type: Boolean, default: true },
    },

    roles: {
      type: [String],
      enum: USER_ROLES,
      default: ["user"],
    },
    status: {
      type: String,
      enum: USER_STATUS,
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const User = mongoose.model<UserValues>("User", userSchema);
export default User;
