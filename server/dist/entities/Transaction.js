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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
const Teller_1 = require("./Teller");
let Transaction = class Transaction extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Transaction.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Account_1.Account),
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, (account) => account.accountTransactions),
    __metadata("design:type", Account_1.Account)
], Transaction.prototype, "account", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "accountId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Account_1.Account),
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, (account) => account.senderTransactions),
    __metadata("design:type", Account_1.Account)
], Transaction.prototype, "senderAccount", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "senderAccountId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Account_1.Account),
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, (account) => account.receiverTransactions),
    __metadata("design:type", Account_1.Account)
], Transaction.prototype, "receiverAccount", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "receiverAccountId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Teller_1.Teller),
    (0, typeorm_1.ManyToOne)(() => Teller_1.Teller, (teller) => teller.receiverTransactions),
    __metadata("design:type", Teller_1.Teller)
], Transaction.prototype, "teller", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transaction.prototype, "tellerId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Float),
    (0, typeorm_1.Column)('real'),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
Transaction = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Transaction);
exports.Transaction = Transaction;
//# sourceMappingURL=Transaction.js.map