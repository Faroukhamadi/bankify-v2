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
exports.Teller = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Transaction_1 = require("./Transaction");
var TellerRole;
(function (TellerRole) {
    TellerRole["CUSTOMER"] = "customer";
    TellerRole["ADMIN"] = "admin";
})(TellerRole || (TellerRole = {}));
(0, type_graphql_1.registerEnumType)(TellerRole, {
    name: 'TellerRole',
});
let Teller = class Teller extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], Teller.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Teller.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Teller.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.DeleteDateColumn)({ nullable: true }),
    __metadata("design:type", Date)
], Teller.prototype, "deletedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Teller.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => TellerRole),
    (0, typeorm_1.Column)({
        unique: true,
        type: 'enum',
        enum: TellerRole,
        default: TellerRole.CUSTOMER,
    }),
    __metadata("design:type", String)
], Teller.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Teller.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Transaction_1.Transaction, (transaction) => transaction.teller),
    __metadata("design:type", Array)
], Teller.prototype, "transactions", void 0);
Teller = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Teller);
exports.Teller = Teller;
//# sourceMappingURL=Teller.js.map