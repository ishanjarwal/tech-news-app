"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST_FLAGS = exports.IMAGE_FORMATS = exports.LOGIN_PROVIDER_OPTIONS = exports.AUTHOR_LIMIT = exports.COMMENT_LIMIT = exports.TAG_LIMIT = exports.CATEGORY_LIMIT = exports.PREFERENCES_THEMES = exports.USER_STATUS = exports.USER_ROLES = exports.AVG_READ_RATE = exports.POST_STATUS = exports.POST_LIMIT = void 0;
exports.POST_LIMIT = 25;
exports.POST_STATUS = ["draft", "published", "archived"];
exports.AVG_READ_RATE = 50; // wpm
exports.USER_ROLES = ["user", "admin", "author"];
exports.USER_STATUS = ["active", "deactive", "pending"];
exports.PREFERENCES_THEMES = ["light", "dark"];
exports.CATEGORY_LIMIT = 100;
exports.TAG_LIMIT = 100;
exports.COMMENT_LIMIT = 100;
exports.AUTHOR_LIMIT = 20;
exports.LOGIN_PROVIDER_OPTIONS = ["google", "email", "github"];
exports.IMAGE_FORMATS = ["jpeg", "png", "jpg"];
exports.POST_FLAGS = [
    "popular",
    "editors_pick",
    "trending",
    "sponsored",
    "exclusive",
];
