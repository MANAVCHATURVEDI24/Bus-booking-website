const express=require('express')
const bodyparser=require('body-parser')
const cors =require('cors')
const mongoose=require('mongoose')

const app=express();

app.use(cors());
app.use(bodyparser.json())
const customerroutes=require("./routes/customer");
const routesroute=require("./routes/route");
const bookingroute=require("./routes/booking");
const notificationroute=require("./routes/notifications");
const storyroute=require("./routes/story");
const forumroute=require("./routes/forum");

app.use('/api', bookingroute)
app.use('/api', routesroute)
app.use('/api', customerroutes)
app.use('/api/notifications', notificationroute)
app.use('/api/stories', storyroute)
app.use('/api/forum', forumroute)

const DBURL="mongodb+srv://admin:admin@tedbus.vqk1yid.mongodb.net/?retryWrites=true&w=majority&appName=tedbus"
mongoose.connect(DBURL)
.then(()=> console.log("Mongodb connected"))
.catch(err=> console.error('Mongodb connection error:' ,err))

app.get('/',(req,res)=>{
    res.send('Hello , Ted bus is working')
})

const PORT= process.env.PORT || 5001
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
