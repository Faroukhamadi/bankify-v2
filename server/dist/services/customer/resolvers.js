"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("./entity");
exports.default = {
    Query: {
        async me() {
            const customer = await entity_1.Customer.findOneBy({ id: 1 });
            return customer;
        },
    },
    Customer: {
        __resolveReference(object) {
            return entity_1.Customer.findBy({ id: object.id });
        },
    },
};
//# sourceMappingURL=resolvers.js.map