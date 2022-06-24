"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const constants_1 = require("../constants");
const validateRegister = (options) => {
    if (options.username.length <= 2) {
        return [
            {
                field: 'username',
                message: 'username must contain 3 characters',
            },
        ];
    }
    if (options.username.includes('@')) {
        return [
            {
                field: 'username',
                message: 'username cannot include @',
            },
        ];
    }
    if (!constants_1.PASSWORD_REGEX.test(options.password)) {
        return [
            {
                field: 'password',
                message: 'minimum 8 characters, at least 1 uppercase, 1 lower, 1 number and 1 special character',
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map