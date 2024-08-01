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
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const prismaClient_1 = __importDefault(require("../prismaClient"));
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield prismaClient_1.default.user.findMany();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ error: "Error fetching users" });
        }
    });
}
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const user = yield prismaClient_1.default.user.findUnique({
                where: { id: Number(id) },
            });
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ error: "User not found" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "Error fetching user" });
        }
    });
}
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email } = req.body;
        try {
            const newUser = yield prismaClient_1.default.user.create({
                data: { name, email },
            });
            res.status(201).json(newUser);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error creating user" });
        }
    });
}
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { name, email } = req.body;
        try {
            const updatedUser = yield prismaClient_1.default.user.update({
                where: { id: Number(id) },
                data: { name, email },
            });
            res.json(updatedUser);
        }
        catch (error) {
            res.status(500).json({ error: "Error updating user" });
        }
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            yield prismaClient_1.default.user.delete({
                where: { id: Number(id) },
            });
            res.status(204).end();
        }
        catch (error) {
            res.status(500).json({ error: "Error deleting user" });
        }
    });
}
