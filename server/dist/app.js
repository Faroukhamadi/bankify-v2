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
        synchronize: true,
        entities: [Customer_1.Customer, Account_1.Account, Teller_1.Teller, Transaction_1.Transaction],
    });
    await myDataSource.initialize();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: [constants_1.DEV_ORIGIN, 'http://localhost:4000'],
    }));
    app.use(express_1.default.json());
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