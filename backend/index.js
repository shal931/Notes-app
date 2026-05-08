const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const Authrouter = require('./Routes/Authrouter');
const NotesRouter = require('./Routes/NotesRouter');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT||8080;

app.get('/ping',(req,res)=>{
    res.send('PONG');
})

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', Authrouter);
app.use('/notes', NotesRouter);


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})