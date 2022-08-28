const express = require("express");
const cors = require("cors");
const dbConnection = require("./dataBase/config");
const path = require("path");
require("dotenv").config();

const app = express();
dbConnection();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//public folder
app.use(express.static("public"));

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas middleware
app.use("/api/auth", require("./routes/auth"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/auth-app/index.html"));
});

//Cors
app.use(cors());
