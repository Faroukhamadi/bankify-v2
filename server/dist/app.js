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
const main = async () => {
    const myDataSource = new typeorm_1.DataSource({
        type: 'postgres',
        database: process.env.POSTGRES_DB_NAME,
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        logging: 'all',
        synchronize: true,
        entities: [Customer_1.Customer, Account_1.Account, Teller_1.Teller, Transaction_1.Transaction],
    });
    await myDataSource.initialize();
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post('/transactions/withdraw', async (req, res) => {
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
        console.log('customer : ', customer);
        console.log('customer accounts: ', customer === null || customer === void 0 ? void 0 : customer.accounts);
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
        if (amount <= 0) {
            res.json({
                errors: [
                    {
                        message: 'Please provide a positive amount',
                        field: 'amount',
                    },
                ],
            });
            return;
        }
        if (account.balance - amount < 0) {
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
        account.balance -= amount;
        try {
            await (account === null || account === void 0 ? void 0 : account.save());
            await transaction.save();
            res.json({
                transaction,
            });
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
    app.delete('/transactions', async (_, res) => {
        return Transaction_1.Transaction.delete({ id: (0, typeorm_1.In)([3, 4, 5]) });
    });
    app.get('/tellers', async (_req, res) => {
        const tellers = await Teller_1.Teller.find();
        res.json(tellers);
    });
    app.get('/customers', async (_req, res) => {
        const customers = await Customer_1.Customer.find({
            relations: {
                accounts: true,
            },
        });
        return res.send(customers);
    });
    app.get('/transactions/:id', async (req, res) => {
        const transaction = await Transaction_1.Transaction.findOneBy({
            id: parseInt(req.params.id),
        });
        return res.send(transaction);
    });
    app.post('/transactions', (_, _r) => {
    });
    app.put('/transactions/:id', (_, _r) => {
    });
    app.delete('/transactions/:id', (_, _r) => {
    });
    app.listen(4001, () => {
        console.log('transaction service listening on port 4001');
    });
};
main().catch((err) => console.log(err));
//# sourceMappingURL=app.js.map