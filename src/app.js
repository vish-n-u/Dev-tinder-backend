// app.js
const express = require("express");
const database = require("./config/database");
const cookie = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile")
const userRouter = require("./routes/user")
const feedRouter = require("./routes/myFeed")
const requestRouter = require("./routes/request")
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const cors = require("cors")

const app = express();

// Add these middleware

app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true                 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

const swaggerDefinition = {
  openapi: "3.0.0",  // Note: changed from openApi to openapi
  info: {
    title: "Express API for JSONPlaceholder",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. It retrieves data from JSONPlaceholder.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "JSONPlaceholder",
      url: "https://jsonplaceholder.typicode.com",
    },
  },
  servers: [
    {
      url: "http://localhost:7777",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["src/routes/*.js"], // Make sure this path is correct relative to where you run the app
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/", authRouter);
app.use("/",profileRouter)
app.use("/",userRouter)
app.use("/",requestRouter)
app.use("/",feedRouter)

async function startApp() {
  try {
    await database();
    console.log("DB successfully connected");
    app.listen(7777, () => {
      console.log("Server running on http://localhost:7777");
      console.log("API Documentation available at http://localhost:7777/docs");
    });
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
}

startApp();