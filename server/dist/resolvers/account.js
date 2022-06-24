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
exports.AccountResolver = void 0;
const Customer_1 = require("../entities/Customer");
const type_graphql_1 = require("type-graphql");
const Account_1 = require("../entities/Account");
let Error = class Error {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Error.prototype, "message", void 0);
Error = __decorate([
    (0, type_graphql_1.ObjectType)()
], Error);
let CredentialsResponse = class CredentialsResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => Customer_1.Customer, { nullable: true }),
    __metadata("design:type", Customer_1.Customer)
], CredentialsResponse.prototype, "customer", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Account_1.Account, { nullable: true }),
    __metadata("design:type", Account_1.Account)
], CredentialsResponse.prototype, "account", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Error], { nullable: true }),
    __metadata("design:type", Array)
], CredentialsResponse.prototype, "errors", void 0);
CredentialsResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CredentialsResponse);
let AccountResolver = class AccountResolver {
    async createAccount(userId) {
        const account = Account_1.Account.create({
            accountNumber: '123456789123',
        });
        const customer = await Customer_1.Customer.findOne({
            where: { id: userId },
            loadRelationIds: true,
        });
        if (!customer) {
            return {
                errors: [
                    {
                        message: 'user not found',
                    },
                ],
            };
        }
        if (customer.accounts) {
            return {
                errors: [
                    {
                        message: 'user already has an account',
                    },
                ],
            };
        }
        try {
            await account.save();
        }
        catch (error) {
            return {
                errors: [
                    {
                        message: 'I dont know what is causing this error',
                    },
                ],
            };
        }
        account.customers.push(customer);
        await account.save();
        return {
            account,
            customer,
        };
    }
    async balance(userId, {}) {
        const account = await Account_1.Account.findOne({
            where: {
                customers: {
                    id: userId,
                },
            },
        });
        if (account === null || account === void 0 ? void 0 : account.balance) {
            return account.balance;
        }
        return null;
    }
    async accounts({}) {
        return Account_1.Account.find({
            relations: {
                customers: true,
            },
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => CredentialsResponse, { nullable: false }),
    __param(0, (0, type_graphql_1.Arg)('userId', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "createAccount", null);
__decorate([
    (0, type_graphql_1.Query)(() => type_graphql_1.Int, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('userId', () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "balance", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Account_1.Account]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountResolver.prototype, "accounts", null);
AccountResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AccountResolver);
exports.AccountResolver = AccountResolver;
//# sourceMappingURL=account.js.map