"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessByRole = (allowed) => async (req, res, next) => {
    try {
        const user = req.user;
        if (!user)
            throw new Error();
        const hasRole = allowed.some((role) => user.roles.includes(role));
        if (!hasRole)
            throw new Error();
        return next();
    }
    catch (error) {
        res.error(401, "error", "Unauthorized access", {});
        return;
    }
};
exports.default = accessByRole;
