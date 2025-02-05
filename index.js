const express = require("express");
const connectDb = require("./config/DbConnection");
const errorHandler = require("./middleware/errorHandler.js");

connectDb();

const app = express();
const port = 5000;
app.use(express.json())


app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/availability", require("./routes/availabilityRoutes.js"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use(errorHandler);


app.listen(port, ()=> {
    console.log(`Server running on ${port}`);
})

module.exports = app;