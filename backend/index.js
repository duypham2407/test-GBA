import express from "express";
import dbConn from "./config/dbConn.js";
import "dotenv/config";
import cookieParse from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsConfig.js";
import routes from "./routes/index.js";

const app = express();
const port = process.env.PORT || 3000;

dbConn();
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParse());

app.use("/api/", routes);

app.listen(port, () => {
  console.log("Port is: ", port);
});