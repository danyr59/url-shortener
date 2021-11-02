require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db")
const bodyParser = require("body-parser")

const app = express();

//connect database
connectDB();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));


//routes
app.use("/", require("./routes/index"))
app.use("/api", require("./routes/url"))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
