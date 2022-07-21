"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_jwt_1 = __importDefault(require("express-jwt"));
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
require("reflect-metadata");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const geoip_lite_1 = __importDefault(require("geoip-lite"));
const mobile_detect_1 = __importDefault(require("mobile-detect"));
const schema_1 = require("./schema");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const graphQlPath = process.env.GRAPHQL_PATH;
const port = process.env.PORT;
const dbUrl = process.env.MONGODB_URL;
const auth = (0, express_jwt_1.default)({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
});
mongoose_1.default
    .connect(dbUrl, {
    autoIndex: true,
})
    .then(() => {
    console.log("connected to mongodb");
})
    .catch((e) => {
    console.log(e);
});
async function startApolloServer() {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    app.use(graphQlPath, (0, cors_1.default)({
        origin: "*",
    }), body_parser_1.default.json(), auth);
    const schema = await (0, schema_1.getSchema)();
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)(),
        ],
        introspection: true,
        context: ({ req }) => {
            const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const context = {
                req,
                user: req.user,
                ip,
                location: geoip_lite_1.default.lookup(ip),
                md: new mobile_detect_1.default(req.headers["user-agent"]),
            };
            return context;
        },
    });
    await server.start();
    server.applyMiddleware({ app, path: graphQlPath });
    await new Promise((resolve) => {
        httpServer.listen({ port });
        resolve(true);
    });
    console.log(`Server started at http://localhost:${port}${graphQlPath}`);
    return { server, app };
}
startApolloServer();
