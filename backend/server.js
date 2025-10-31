import express from 'express';
import cors from 'cors';
const app=express();
import mongoose from 'mongoose';
import router from './route.js';
import dotenv from 'dotenv';

const port=3001;
const host='localhost';

app.use(cors());
app.use(express.json());

dotenv.config();

const uri="mongodb+srv://sujitha:12345@smart.tupstte.mongodb.net/?appName=smart";


const connect = async()=>{
        try {
               await mongoose.connect(uri);
               console.log("connect to mongodb"); 
                
        } catch (error) {
                console.log("mongodb error: ",error);
        }
};

connect();

const srever =app.listen(port,host,()=>{
        console.log(`Node server is listening to ${srever.address().port} `)
});



app.use('/api',router)