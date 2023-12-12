import express from "express";
import { __dirname } from "./dirname.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
import { Server } from "socket.io";

const app = express();
const PORT = 5000;

const httpServer = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const io = new Server(httpServer);

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use("/", viewsRouter);




const messages = [];

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("newUser", (username) => {
    socket.broadcast.emit("userConnected", username);
  });

  socket.on("message", (data) => {
    messages.push(data);
    console.log(messages);
    io.emit("messages", messages);
  });

  socket.emit("messages", messages);
});

