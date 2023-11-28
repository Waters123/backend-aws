"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const serverless_express_1 = __importDefault(require("@vendia/serverless-express"));
const app_module_1 = require("./app.module");
const pgdb_1 = require("./pgdb");
const { DB_HOST, DB_PORT = '5432', DB_NAME, DB_USER, DB_PASSWORD, } = process.env;
let server;
async function bootstrap() {
    const connection = new pgdb_1.PostgresConnection({
        host: DB_HOST,
        port: +DB_PORT,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD,
        ssl: {
            rejectUnauthorized: false
        }
    });
    pgdb_1.PGDB.init(connection);
    return connection.connect().then(() => core_1.NestFactory.create(app_module_1.AppModule));
}
const handler = async (event, context, callback) => {
    server = server !== null && server !== void 0 ? server : (await bootstrap().then(async (app) => {
        app.enableCors({
            origin: (req, callback) => callback(null, true),
        });
        await app.init();
        const expressApp = app.getHttpAdapter().getInstance();
        return (0, serverless_express_1.default)({ app: expressApp });
    }));
    return server(event, context, callback);
};
exports.handler = handler;
//# sourceMappingURL=main.js.map