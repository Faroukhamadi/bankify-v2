"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerResolver = exports.CustomerInput = void 0;
const Account_1 = require("../entities/Account");
const Customer_1 = require("../entities/Customer");
const teller_1 = require("./teller");
const type_graphql_1 = require("type-graphql");
let CustomerResponse = class CustomerResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [teller_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], CustomerResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Customer_1.Customer, { nullable: true }),
    __metadata("design:type", Customer_1.Customer)
], CustomerResponse.prototype, "customer", void 0);
CustomerResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CustomerResponse);
let FindCustomerInput = class FindCustomerInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], FindCustomerInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FindCustomerInput.prototype, "cin", void 0);
FindCustomerInput = __decorate([
    (0, type_graphql_1.InputType)()
], FindCustomerInput);
let CustomerInput = class CustomerInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CustomerInput.prototype, "firstName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CustomerInput.prototype, "lastName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CustomerInput.prototype, "cin", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CustomerInput.prototype, "phone", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CustomerInput.prototype, "accountNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CustomerInput.prototype, "balance", void 0);
CustomerInput = __decorate([
    (0, type_graphql_1.InputType)()
], CustomerInput);
exports.CustomerInput = CustomerInput;
let CustomerResolver = class CustomerResolver {
    async createCustomer({ firstName, lastName, cin, phone, accountNumber, balance }, {}) {
        const customer = Customer_1.Customer.create({
            firstName,
            lastName,
            cin,
            phone,
        });
        const account = Account_1.Account.create({
            accountNumber,
            balance,
        });
        customer.accounts.push(account);
        try {
            await customer.save();
        }
        catch (err) {
            console.log('customer save:', err);
        }
        return { customer };
    }
    async customers() {
        return Customer_1.Customer.find();
    }
    async customer({ id, cin }) {
        return Customer_1.Customer.findOne({
            where: [{ id }, { cin }],
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => CustomerResponse),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CustomerInput, Object]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "createCustomer", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Customer_1.Customer]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "customers", null);
__decorate([
    (0, type_graphql_1.Query)(() => Customer_1.Customer),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FindCustomerInput]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "customer", null);
CustomerResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CustomerResolver);
exports.CustomerResolver = CustomerResolver;
//# sourceMappingURL=customer.js.map