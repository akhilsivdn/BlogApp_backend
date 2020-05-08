const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

//import routes
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

//Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads',express.static('uploads'));
app.use('/api/user', authRoute);
app.use('/posts', postsRoute);


//DB connection
mongoose.connect(process.env.DB_CONNECTION_STRING,
    { useNewUrlParser: true },
    () => {
        console.log('DB connected! and state is ' + mongoose.connection.readyState);
    });

app.listen('3000', ()=>{
    console.log('up and running!');
});