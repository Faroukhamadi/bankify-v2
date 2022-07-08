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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TellerResolver = exports.FieldError = void 0;
const Teller_1 = require("../entities/Teller");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const argon2_1 = __importDefault(require("argon2"));
const constants_1 = require("../constants");
const UsernamePasswordInput_1 = require("../utils/UsernamePasswordInput");
const validateRegister_1 = require("../utils/validateRegister");
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
exports.FieldError = FieldError;
let TellerResponse = class TellerResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], TellerResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Teller_1.Teller, { nullable: true }),
    __metadata("design:type", Teller_1.Teller)
], TellerResponse.prototype, "teller", void 0);
TellerResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], TellerResponse);
let TellerResolver = class TellerResolver {
    me({ req }) {
        if (!req.session.tellerId) {
            return null;
        }
        const teller = Teller_1.Teller.findOne({
            where: { id: req.session.tellerId },
        });
        return teller;
    }
    async register(options, { req }) {
        const errors = (0, validateRegister_1.validateRegister)(options);
        if (errors) {
            return { errors };
        }
        const hashedPassword = await argon2_1.default.hash(options.password);
        const teller = Teller_1.Teller.create({
            username: options.username,
            password: hashedPassword,
        });
        try {
            await teller.save();
        }
        catch (err) {
            if (err.code === '23505') {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'username already taken',
                        },
                    ],
                };
            }
        }
        req.session.tellerId = teller.id;
        return { teller };
    }
    async login(username, password, { req }) {
        const teller = await Teller_1.Teller.findOne({ where: { username } });
        if (!teller) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'username not found',
                    },
                ],
            };
        }
        const valid = await argon2_1.default.verify(teller.password, password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'incorrect password',
                    },
                ],
            };
        }
        req.session.tellerId = teller.id;
        return {
            teller,
        };
    }
    async Tellers({}) {
        const tellers = await Teller_1.Teller.find();
        return tellers;
    }
    Teller(id, {}) {
        return Teller_1.Teller.findOne({ where: { id } });
    }
    deleteTellers() {
        return Teller_1.Teller.delete({ id: (0, typeorm_1.In)([1, 3, 8]) });
    }
    deleteTeller(username) {
        return Teller_1.Teller.delete({ username });
    }
    logout({ req, res }) {
        res.clearCookie(constants_1.COOKIE_NAME);
        return new Promise((resolve) => req.session.destroy((err) => {
            if (err) {
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => Teller_1.Teller, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TellerResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => TellerResponse),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], TellerResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => TellerResponse),
    __param(0, (0, type_graphql_1.Arg)('username')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TellerResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Teller_1.Teller]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TellerResolver.prototype, "Tellers", null);
__decorate([
    (0, type_graphql_1.Query)(() => Teller_1.Teller, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TellerResolver.prototype, "Teller", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Teller_1.Teller),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TellerResolver.prototype, "deleteTellers", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Teller_1.Teller),
    __param(0, (0, type_graphql_1.Arg)('username', () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TellerResolver.prototype, "deleteTeller", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TellerResolver.prototype, "logout", null);
TellerResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], TellerResolver);
exports.TellerResolver = TellerResolver;
//# sourceMappingURL=teller.js.map