import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import path from 'path'
import {fileURLToPath} from "url";

dotenv.config()

connectDB()

//esmodule fix
const __filename = fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)

const app=express()



//middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'./client/build')))

//routes
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/product",productRoutes)

app.use("*",function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

const PORT=8000

app.listen(PORT,()=>console.log(`server running on port ${PORT}`.bgCyan.white))