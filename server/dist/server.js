"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = __importDefault(require("./prismaClient"));
// Load environment variables from .env file
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const server = app_1.default.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("SIGINT signal received: closing HTTP server");
    server.close(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("HTTP server closed");
        yield prismaClient_1.default.$disconnect();
        console.log("Prisma Client disconnected");
        process.exit(0);
    }));
}));
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("HTTP server closed");
        yield prismaClient_1.default.$disconnect();
        console.log("Prisma Client disconnected");
        process.exit(0);
    }));
}));
