const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require('./routes/authRoutes');
const socketServer = require("./socketServer");
const PORT = process.env.PORT || process.env.API_PORT;

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => {
     console.log("Successfully connected to DB");
}).catch(error => console.log(`Could not connect to the database`));

const server = http.createServer(app);
socketServer.registerSocketServer(server);

app.use('/api/auth', authRoutes);

server.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
})

