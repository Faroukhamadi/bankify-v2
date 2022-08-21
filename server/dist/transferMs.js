"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const Account_1 = require("./entities/Account");
const Customer_1 = require("./entities/Customer");
const Teller_1 = require("./entities/Teller");
const Transaction_1 = require("./entities/Transaction");
const validaterTransfer_1 = require("./utils/validaterTransfer");
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./constants");
const main = async () => {
    const myDataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || undefined,
        database: process.env.POSTGRES_DB || process.env.POSTGRES_DB_NAME,
        username: process.env.POSTGRES_USER || process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD,
        logging: 'all',
        entities: [Customer_1.Customer, Account_1.Account, Teller_1.Teller, Transaction_1.Transaction],
    });
    await myDataSource.initialize();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: [constants_1.DEV_ORIGIN, 'http://localhost:4000'],
    }));
    app.use(express_1.default.json());
    app.post('/transactions/transfer', async (req, res) => {
        const errors = (0, validaterTransfer_1.validateTransfer)(req.body);
        if (errors) {
            res.json(errors);
            return;
        }
        const { senderCin, receiverCin, senderAccountNumber, receiverAccountNumber, amount, tellerId, } = req.body;
        const sender = await Customer_1.Customer.findOne({
            where: { cin: senderCin },
            relations: { accounts: true },
        });
        const receiver = await Customer_1.Customer.findOne({
            where: { cin: receiverCin },
            relations: { accounts: true },
        });
        if (!sender) {
            res.json({
                errors: [
                    {
                        message: `sender with specified cin doesn't exist`,
                        field: 'senderCin',
                    },
                ],
            });
            return;
        }
        if (!receiver) {
            res.json({
                errors: [
                    {
                        message: `receiver with specified cin doesn't exist`,
                        field: 'senderCin',
                    },
                ],
            });
            return;
        }
        if (!(sender === null || sender === void 0 ? void 0 : sender.accounts.some((a) => a.accountNumber === senderAccountNumber))) {
            res.json({
                errors: [
                    {
                        message: `sender with specified cin doesn't have an account with entered account number`,
                        field: 'senderAccountNumber',
                    },
                ],
            });
            return;
        }
        if (!(receiver === null || receiver === void 0 ? void 0 : receiver.accounts.some((a) => a.accountNumber === receiverAccountNumber))) {
            res.json({
                errors: [
                    {
                        message: `receiver with specified cin doesn't have an account with entered account number`,
                        field: 'receiverAccountNumber',
                    },
                ],
            });
            return;
        }
        const senderAccount = sender === null || sender === void 0 ? void 0 : sender.accounts.find((a) => a['accountNumber'] === senderAccountNumber);
        const receiverAccount = receiver === null || receiver === void 0 ? void 0 : receiver.accounts.find((a) => a['accountNumber'] === receiverAccountNumber);
        if (senderAccount.balance < amount) {
            res.json({
                errors: [
                    {
                        message: `Please check the sender's balance`,
                        field: 'amount',
                    },
                ],
            });
            return;
        }
        const transaction = Transaction_1.Transaction.create({
            amount,
            receiverAccountId: receiverAccount === null || receiverAccount === void 0 ? void 0 : receiverAccount.id,
            senderAccountId: senderAccount === null || senderAccount === void 0 ? void 0 : senderAccount.id,
            tellerId,
        });
        transaction.id = 'tr:' + (0, uuid_1.v4)();
        senderAccount.balance -= amount;
        if (typeof amount === 'number') {
            receiverAccount.balance += amount;
        }
        else {
            receiverAccount.balance += parseInt(amount);
        }
        try {
            await (senderAccount === null || senderAccount === void 0 ? void 0 : senderAccount.save());
            await (receiverAccount === null || receiverAccount === void 0 ? void 0 : receiverAccount.save());
            await transaction.save();
            res.json({
                transaction,
            });
            return;
        }
        catch (err) {
            res.json({
                errors: [
                    {
                        message: 'unexpected error',
                        field: 'unknown',
                    },
                ],
            });
            return;
        }
    });
    app.listen(4004, () => {
        console.log('transaction service listening on port 4004');
    });
};
main().catch((err) => console.log(err));
//# sourceMappingURL=transferMs.js.map