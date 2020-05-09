const express = require('express');
const connectDB = require('./config/db')
const app = express();
const cors = require('cors');
const path = require('path');
//const Feedback = require("./models/Feedback");
var bodyParser = require('body-parser')

const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cors());
//connect database
//connectDB();
app.use('/api/feedback',require('./routes/feedback'));
app.use('/api/sentiment',require('./routes/sentiment'));
app.use('/api/predictSafety',require('./routes/streetmlalgo'));
app.use(express.json({extended: false}));

//if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    );
 // }
app.listen(PORT,()=>{console.log(`SERVER STARTED AT PORT ${PORT}`)});