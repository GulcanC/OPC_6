const http = require("http");

const app = require("./app");

// make sure that when we configure a port and receive it via an environment variable, it's a valid number

const normalizePort = (originalPort) => {
  // parse our port and it returns an integer
  const port = parseInt(originalPort, 10);

  // if the port number is illegal, it returns our original port
  if (isNaN(port)) {
    return originalPort;
  }
  // if the port number >= 0 , it returns the port we analyzed
  if (port >= 0) {
    return port;
  }
  return false;
};

// check what kind of error occurred
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges."); // access authorization denied
      process.exit(1);

    case "EADDRINUSE":
      console.error(bind + " is already in use."); // the address already used
      process.exit(1);

    default:
      throw error;
  }
};

// to record that we are listening for incoming requests
const onListening = () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("✅ Listening on " + bind);
};

// configure the port, call the function normalizePort, pass 3000 as a string
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// attach the server for the error and for the listener, start the server
const server = http.createServer(app);
server.on("error", errorHandler);
server.on("listening", onListening);
server.listen(port);
