"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const main = async () => {
    console.log('this is my env variable: ', process.env.POSTGRES_PASSWORD);
};
main().catch(err => console.log(err));
//# sourceMappingURL=index.js.map