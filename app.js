const express = require('express')
const app = express();
const  mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const cors = require('cors')
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify:false,useCreateIndex:true})
.then(()=>console.log("db connected"))
.catch((err)=>{
    console.log(err.message)
})
if(process.env.NODE_ENV='dev'){
    app.use(cors({origin:`${process.env.CLIENT_URL}`}))
}


app.use(bodyParser.json())

app.use(morgan('dev'))

app.use('/v',authRoutes)
app.use('/v',userRoutes)

const port = process.env.PORT||8000;
app.listen(port,()=>{console.log(`server started on port:${port}`)})