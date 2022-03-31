const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(require("./routes/record"));
app.use(require("./routes/project"));

// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
