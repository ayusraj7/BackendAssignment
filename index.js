const express= require('express');
const app=express();

require('dotenv').config();
const PORT=process.env.PORT||3000;

const cors=require('cors')
app.use(cors());

//middleware
app.use(express.json());

const mongoose=require('mongoose')

//database connection 
const connectwithDb=()=>{
    mongoose.connect(process.env.MONGODB_URL,{})
    .then(console.log('DB connected successfully'))
    .catch((error)=>{
        console.log('DB facing connection issues ')
        console.log(error);
        process.exit(1);
    })
};

connectwithDb();

//controllers 

const router = express.Router()

const{login,register,forgetpass}=require('./Controller/UserCreation');

router.post('/register',register);
router.post('/login',login);
router.post('/forget-password',forgetpass);

app.use('/api',router);





app.listen(PORT,()=>{
    console.log(`App is started at Port no ${PORT}`)
})

app.get('/',(req,res)=>{
    res.send(`<h1>This is my HomePage</h1>`)
})




