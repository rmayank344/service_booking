const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();
require("./config/sql_config");


app.use(express.json({ limit: '5mb'}));
app.use(express.urlencoded({ limit: '5mb', extended: true }));


app.use(cors({
  origin: "*", // You can replace * with your frontend domain for security
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-api-key",
    "x-auth-token",
  ]
}));

//auth routes
app.use('/api/user/v1/auth-route', require("./routes/auth_routes"));

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`server is running on port ${process.env.PORT}`);
});