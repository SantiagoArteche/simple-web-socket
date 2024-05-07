import express from "express";
import { ServerRoutes } from "./routes";
import "dotenv/config";
import { WebSocketServer, WebSocket } from "ws";
export class Server {
  private app = express();
  private PORT = process.env.PORT;

  public start() {
    const wss = new WebSocketServer({ port: 8081 });
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use("/", ServerRoutes.routes);

    wss.on("connection", function connection(ws) {
      ws.on("error", console.error);

      ws.on("message", function message(data) {
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(`${data}`);
          }
        }); /* enviar a todos menos al emisor */

        // wss.clients.forEach(function each(client) {
        //   if (client.readyState === WebSocket.OPEN) {
        //     client.send(`${data}`);
        //   }
        // }); enviar a todos
      });

      ws.on("close", () => {
        console.log("Client desconected");
      });
    });

    this.app.listen(this.PORT, () => {
      console.log(`Server running on PORT ${this.PORT}`);
    });
  }
}
