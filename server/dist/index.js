"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const ioredis_1 = __importDefault(require("ioredis"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const constants_1 = require("./constants");
const Customer_1 = require("./entities/Customer");
const Account_1 = require("./entities/Account");
const Teller_1 = require("./entities/Teller");
const Transaction_1 = require("./entities/Transaction");
const main = async () => {
    console.log('postgres password is: ', process.env.POSTGRES_DB_PASSWORD);
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
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    const redis = new ioredis_1.default();
    app.use((0, cors_1.default)({
        origin: constants_1.DEV_ORIGIN,
        credentials: true,
    }));
    app.use((0, express_session_1.default)({
        name: constants_1.COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        }),
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
        },
    }));
    app.listen(4000, () => {
        console.log('listening on port 4000');
    });
};
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map