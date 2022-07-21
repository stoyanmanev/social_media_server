"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getToken(_id, roles) {
    var _a;
    return jsonwebtoken_1.default.sign({
        _id,
        roles
    }, process.env.JWT_SECRET, {
        expiresIn: (_a = process.env.TOKEN_EXPIRATION) !== null && _a !== void 0 ? _a : "1d",
    });
}
exports.getToken = getToken;
