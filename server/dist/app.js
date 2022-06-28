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
    const transactionRepository = myDataSource.getRepository(Transaction_1.Transaction);
    const tellerRepository = myDataSource.getRepository(Teller_1.Teller);
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get('/transactions', async (_, res) => {
        const transactions = await transactionRepository.find();
        res.json(transactions);
    });
    app.get('/tellers', async (req, res) => {
        const tellers = await tellerRepository.find();
        res.json(tellers);
    });
    app.get('/transactions/:id', async (req, res) => {
        const transaction = await transactionRepository.findOneBy({
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