const EventEmitter = require("events");
const http = require("http");

class Sale extends EventEmitter {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }
}
const myEmitter = new Sale();

myEmitter.on("newSale", () => {
  console.log("First Emit happen");
});
myEmitter.on("newSale", () => {
  console.log("Second Emit happen");
});

myEmitter.on("newSale", (stock) => {
  console.log(`Total Available items:${stock}`);
});
myEmitter.emit("newSale", 9);

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("First request received");
  res.end("First request received");
});
server.on("request", (req, res) => {
  console.log("Second request received");
  // res.end('Second request received');
});
server.on("close", () => {
  console.log("Closed");
});

server.listen(3001, "localhost", () => {
  console.log("Waiting for response....");
});
