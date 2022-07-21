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
exports.AuthResolver = void 0;
const type_graphql_1 = require("type-graphql");
const user_entity_1 = require("../../entities/user-entity");
const auth_entinty_1 = require("../../entities/auth-entinty");
const login_arguments_1 = require("./login-arguments");
const apollo_server_core_1 = require("apollo-server-core");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const token_1 = require("./token");
let AuthResolver = class AuthResolver {
    async currentUser(ctx) {
        if (!ctx.user) {
            throw new apollo_server_core_1.AuthenticationError("user_not_authenticated");
        }
        const user = await user_entity_1.UserModel.findById(ctx.user._id);
        const token = ctx.req.headers.authorization.split(" ")[1];
        const expiredТoken = await auth_entinty_1.AuthModel.find({ token });
        if (Array.isArray(expiredТoken) && expiredТoken.length !== 0) {
            throw new apollo_server_core_1.AuthenticationError("user_not_authenticated");
        }
        if (ctx.user.exp * 1000 < Date.now()) {
            const newAuth = new auth_entinty_1.AuthModel({ token });
            await newAuth.save();
            throw new apollo_server_core_1.AuthenticationError("user_not_authenticated");
        }
        return user;
    }
    async login({ email, password }) {
        const user = await user_entity_1.UserModel.findOne({ email });
        if (!user) {
            throw new apollo_server_core_1.UserInputError("Wrong email or password");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new apollo_server_core_1.UserInputError("Wrong email or password");
        }
        user.lastLogin = Date.now();
        await user.save();
        return (0, token_1.getToken)(user._id, user.roles);
    }
    async logout(ctx) {
        if (!ctx.user) {
            throw new apollo_server_core_1.AuthenticationError("user_not_authenticated");
        }
        const token = ctx.req.headers.authorization.split(" ")[1];
        const newAuth = new auth_entinty_1.AuthModel({ token });
        await newAuth.save();
        return newAuth;
    }
};
__decorate([
    (0, type_graphql_1.Query)((returns) => user_entity_1.User),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "currentUser", null);
__decorate([
    (0, type_graphql_1.Mutation)((returns) => String),
    __param(0, (0, type_graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_arguments_1.LoginAgruments]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)((returns) => auth_entinty_1.Auth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "logout", null);
AuthResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AuthResolver);
exports.AuthResolver = AuthResolver;
