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
const validateWithdrawOrDeposit_1 = require("./utils/validateWithdrawOrDeposit");
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
        console.log('body we get on withdraw microservice: ', req.body);
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
    app.listen(4002, () => {
        console.log('transaction service listening on port 4002');
    });
};
main().catch((err) => console.log(err));
//# sourceMappingURL=withdrawMs.js.map