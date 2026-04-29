const express = require("express");
const WebSocket = require("ws");

const app = express();
app.use(express.json());

const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
});

const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
    clients.push(ws);

    ws.on("close", () => {
        clients = clients.filter(c => c !== ws);
    });
});

// 📬 ВЕБХУК
app.post("/webhook", (req, res) => {
    const data = req.body;

    console.log("LOG:", data);

    clients.forEach(c => c.send(JSON.stringify(data)));

    res.sendStatus(200);
});

app.use(express.static("public"));