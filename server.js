import express from 'express'
import { readdirSync } from 'fs'
// import mongoose from 'mongoose'
import cors from "cors"
const morgan = require("morgan")
 
    require("dotenv").config()


    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use(morgan("dev"))

  

    readdirSync("./routes").map((r)=>
        app.use("/api",require(`./routes/${r}`))
    )


    const port = process.env.PORT || 8000
    app.listen(port, console.log(`port running on ${port}`)) 