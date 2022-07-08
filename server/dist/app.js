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
const validateWithdrawOrDeposit_1 = require("./utils/validateWithdrawOrDeposit");
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
const constants_1 = require("./constants");
const main = async () => {
    const myDataSource = new typeorm_1.DataSource({
        type: 'postgres',
        database: process.env.POSTGRES_DB_NAME,
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        synchronize: true,
        entities: [Customer_1.Customer, Account_1.Account, Teller_1.Teller, Transaction_1.Transaction],
    });
    await myDataSource.initialize();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: [constants_1.DEV_ORIGIN, 'http://localhost:4000'],
    }));
    app.use(express_1.default.json());
    app.post('/transactions/withdraw', async (req, res) => {
        console.log('we are in withdraw');
        console.log('this is the data we got from the browser: ', req.body);
        const errors = (0, validateWithdrawOrDeposit_1.validateWithdrawOrDeposit)(req.body);
        if (errors) {
            res.json(errors);
            return;
        }
        const { cin, accountNumber, amount, tellerId } = req.body;
        const customer = await Customer_1.Customer.findOne({
            where: { cin },
            relations: { accounts: true },
        });
        if (!customer) {
            res.json({
                errors: [
                    {
                        message: `customer with specified cin doesn't exist`,
                        field: 'cin',
                    },
                ],
            });
            return;
        }
        if (!(customer === null || customer === void 0 ? void 0 : customer.accounts.some((a) => a.accountNumber === accountNumber))) {
            res.json({
                errors: [
                    {
                        message: `customer with specified cin doesn't have an account with entered account number`,
                        field: 'accountNumber',
                    },
                ],
            });
            return;
        }
        const account = customer === null || customer === void 0 ? void 0 : customer.accounts.find((a) => a['accountNumber'] === accountNumber);
        if (account.balance < amount) {
            res.json({
                errors: [
                    {
                        message: `Please check your account's balance`,
                        field: 'amount',
                    },
                ],
            });
            return;
        }
        const transaction = Transaction_1.Transaction.create({
            amount,
            customerAccountId: account.id,
            tellerId,
        });
        transaction.id = 'wi:' + (0, uuid_1.v4)();
        account.balance -= amount;
        try {
            await (account === null || account === void 0 ? void 0 : account.save());
            await transaction.save();
            res.json({
                transaction,
            });
            return;
        }
        catch (err) {
            console.log('unexpected err:', err);
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
    app.post('/transactions/deposit', async (req, res) => {
        const errors = (0, validateWithdrawOrDeposit_1.validateWithdrawOrDeposit)(req.body);
        if (errors) {
            res.json(errors);
            return;
        }
        const { cin, accountNumber, amount, tellerId } = req.body;
        const customer = await Customer_1.Customer.findOne({
            where: { cin },
            relations: { accounts: true },
        });
        if (!customer) {
            res.json({
                errors: [
                    {
                        message: `customer with specified cin doesn't exist`,
                        field: 'cin',
                    },
                ],
            });
            return;
        }
        if (!(customer === null || customer === void 0 ? void 0 : customer.accounts.some((a) => a.accountNumber === accountNumber))) {
            res.json({
                errors: [
                    {
                        message: `customer with specified cin doesn't have an account with entered account number`,
                        field: 'accountNumber',
                    },
                ],
            });
            return;
        }
        const account = customer === null || customer === void 0 ? void 0 : customer.accounts.find((a) => a['accountNumber'] === accountNumber);
        const transaction = Transaction_1.Transaction.create({
            amount,
            customerAccountId: account.id,
            tellerId,
        });
        transaction.id = 'de:' + (0, uuid_1.v4)();
        account.balance += amount;
        try {
            await (account === null || account === void 0 ? void 0 : account.save());
            await transaction.save();
            res.json({
                transaction,
            });
            return;
        }
        catch (err) {
            console.log('unexpected err:', err);
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
    app.get('/transactions/count/:account_id', async (req, res) => {
        const accountId = parseInt(req.params.account_id);
        const count = await Transaction_1.Transaction.count({
            where: [
                { customerAccountId: accountId },
                { senderAccountId: accountId },
                { receiverAccountId: accountId },
            ],
        });
        return res.json({
            count,
        });
    });
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
            console.log('unexpected err:', err);
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
    app.get('/transactions', async (_, res) => {
        const transactions = await Transaction_1.Transaction.find();
        res.json(transactions);
    });
    app.delete('/transactions', async (_, _res) => {
        return Transaction_1.Transaction.delete({ id: (0, typeorm_1.In)([3, 4, 5]) });
    });
    app.get('/transactions/:account_id', async (req, res) => {
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const accountId = parseInt(req.params.account_id);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        let data = {
            results: [],
            next: undefined,
            prev: undefined,
        };
        const transactionsLength = await Transaction_1.Transaction.count({
            where: [
                { customerAccountId: accountId },
                { senderAccountId: accountId },
                { receiverAccountId: accountId },
            ],
        });
        if (endIndex < transactionsLength) {
            data.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if (startIndex > 0) {
            data.prev = {
                page: page - 1,
                limit: limit,
            };
        }
        const transactions = await Transaction_1.Transaction.find({
            take: limit,
            skip: startIndex,
            order: {
                createdAt: 'DESC',
            },
            where: [
                { customerAccountId: accountId },
                { senderAccountId: accountId },
                { receiverAccountId: accountId },
            ],
            relations: [
                'customerAccount',
                'customerAccount.customer',
                'senderAccount',
                'senderAccount.customer',
                'receiverAccount',
                'receiverAccount.customer',
            ],
        });
        data.results = transactions;
        return res.json(data);
    });
    app.listen(4001, () => {
        console.log('transaction service listening on port 4001');
    });
};
main().catch((err) => console.log(err));
//# sourceMappingURL=app.js.map