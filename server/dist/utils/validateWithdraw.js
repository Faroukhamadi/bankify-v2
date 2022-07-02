"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWithdraw = void 0;
const constants_1 = require("../constants");
const validateWithdraw = ({ cin, accountNumber, amount, }) => {
    if (cin.length != 8) {
        return {
            errors: [
                {
                    message: 'cin should contain 8 nums',
                    field: 'cin',
                },
            ],
        };
    }
    if (!constants_1.NUMBER_REGEX.test(cin)) {
        return {
            errors: [
                {
                    message: 'cin should only contain numbers',
                    field: 'cin',
                },
            ],
        };
    }
    if (!constants_1.NUMBER_REGEX.test(accountNumber) || accountNumber.length != 12) {
        return {
            errors: [
                {
                    field: 'accountNumber',
                    message: 'Account Number must contain 12 numbers',
                },
            ],
        };
    }
    if (amount <= 0) {
        return {
            errors: [
                {
                    message: 'Please provide a positive amount',
                    field: 'amount',
                },
            ],
        };
    }
    return null;
};
exports.validateWithdraw = validateWithdraw;
//# sourceMappingURL=validateWithdraw.js.map