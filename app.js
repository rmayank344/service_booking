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

//catalog routes for admin and customer
app.use('/api/admin/v1/catalog', require("./routes/catalog_routes"));
app.use('/api/user/v1/catalog', require("./routes/catalog_routes"));

// customer location routes
app.use('/api/user/v1/location', require("./routes/location_routes"));

// pro availability routes
app.use('/api/pro/v1', require("./routes/pro_availability_routes"));

// service booking routes
app.use('/api/user/v1', require("./routes/booking_routes"));

// service rating routes
app.use('/api/user/v1/rating', require("./routes/rating_routes"));

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`server is running on port ${process.env.PORT}`);
});