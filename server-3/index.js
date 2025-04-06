require('dotenv').config();
const express = require('express');
const cors=require('cors')
const mongoose = require('mongoose');
const patnerRoutes=require('./routes/delivery_routes')
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["*"],
    methods: ["*"],
    credentials: true,
  })
);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB Connected"))
.catch(err => console.error(" MongoDB Connection Error:", err));

app.use('/api/patner',patnerRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
