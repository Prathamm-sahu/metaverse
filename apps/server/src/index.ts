import express from "express"
import { v1Router } from "./routes/v1";
const PORT = process.env.PORT || 3000;
const app = express()

app.use(express.json())

app.use("/api/v1", v1Router)

app.listen(PORT, () => console.log(`server started at port ${PORT}`))

