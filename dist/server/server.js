"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const luckyNumbersGame_1 = __importDefault(require("./luckyNumbersGame"));
const port = 3000;
class App {
    constructor(port) {
        this.port = port;
        const app = (0, express_1.default)();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
        this.server = new http_1.default.Server(app);
        this.io = new socket_io_1.default.Server(this.server);
        this.game = new luckyNumbersGame_1.default();
        this.io.on('connection', (socket) => {
            console.log('Client connected: ' + socket.id);
            this.game.LuckyNumbers[socket.id] = Math.floor(Math.random() * 10);
            socket.emit('message', 'Hello from server' +
                socket.id +
                this.game.LuckyNumbers[socket.id]);
            socket.broadcast.emit('message', 'A new user has joined the chat' + socket.id);
            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
        setInterval(() => {
            let randomNumber = Math.floor(Math.random() * 10);
            let winners = this.game.GetWinners(randomNumber);
            if (winners.length > 0) {
                winners.forEach((w) => {
                    this.io.to(w).emit('message', 'You won!');
                });
            }
            this.io.emit('random', randomNumber);
        }, 1000);
    }
    Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}
new App(port).Start();
//# sourceMappingURL=server.js.map