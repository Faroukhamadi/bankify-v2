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
const Customer_1 = require("../entities/Customer");
const teller_1 = require("./teller");
const type_graphql_1 = require("type-graphql");
const constants_1 = require("../constants");
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
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], FindCustomerInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
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
CustomerInput = __decorate([
    (0, type_graphql_1.InputType)()
], CustomerInput);
exports.CustomerInput = CustomerInput;
let CustomerResolver = class CustomerResolver {
    async createCustomer({ firstName, lastName, cin, phone, accountNumber }, {}) {
        if (firstName.length <= 2) {
            return {
                errors: [
                    {
                        field: 'firstName',
                        message: 'First Name must contain 3 characters',
                    },
                ],
            };
        }
        if (lastName.length <= 2) {
            return {
                errors: [
                    {
                        field: 'lastName',
                        message: 'Last Name must contain 3 characters',
                    },
                ],
            };
        }
        if (!constants_1.NAME_REGEX.test(firstName)) {
            return {
                errors: [
                    {
                        field: 'firstName',
                        message: 'First Name must contain letters',
                    },
                ],
            };
        }
        if (!constants_1.NAME_REGEX.test(lastName)) {
            return {
                errors: [
                    {
                        field: 'lastName',
                        message: 'Last Name must contain letters',
                    },
                ],
            };
        }
        if (!constants_1.NUMBER_REGEX.test(cin) || cin.length != 8) {
            return {
                errors: [
                    {
                        field: 'cin',
                        message: 'cin must contain 8 numbers',
                    },
                ],
            };
        }
        if (!constants_1.NUMBER_REGEX.test(phone) || phone.length != 8) {
            return {
                errors: [
                    {
                        field: 'phone',
                        message: 'Phone number must contain 8 numbers',
                    },
                ],
            };
        }
        if (!constants_1.NUMBER_REGEX.test(accountNumber) || accountNumber.length != 12) {
            return {
                errors: [
                    {
                        field: 'accountNumber',
                        message: 'Account Number must contain 12 numbers',
                    },
                ],
            };
        }
        console.log(accountNumber.length);
        const customer = Customer_1.Customer.create({
            firstName,
            lastName,
            cin,
            phone,
            accounts: [
                {
                    accountNumber,
                },
            ],
        });
        console.log('customer accounts: ', customer.accounts);
        try {
            await customer.save();
        }
        catch (err) {
            console.log('err', err);
            if (err.code === '23505' && err.detail.includes('cin')) {
                return {
                    errors: [
                        {
                            field: 'cin',
                            message: 'cin already taken',
                        },
                    ],
                };
            }
            else if (err.code === '23505' && err.detail.includes('phone')) {
                return {
                    errors: [
                        {
                            field: 'phone',
                            message: 'phone already taken',
                        },
                    ],
                };
            }
        }
        return { customer };
    }
    customers() {
        return Customer_1.Customer.find({
            relations: {
                accounts: true,
            },
        });
    }
    async customer({ id, cin }) {
        return Customer_1.Customer.findOne({
            where: [{ id }, { cin }],
            relations: { accounts: true },
        });
    }
    async deleteCustomer(cin) {
        const customer = await Customer_1.Customer.findOneBy({ cin });
        await Customer_1.Customer.delete({ cin });
        return customer;
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
__decorate([
    (0, type_graphql_1.Mutation)(() => Customer_1.Customer),
    __param(0, (0, type_graphql_1.Arg)('cin', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "deleteCustomer", null);
CustomerResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CustomerResolver);
exports.CustomerResolver = CustomerResolver;
//# sourceMappingURL=customer.js.map