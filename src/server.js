require("dotenv").config();
const express = require('express')
const cors = require('cors')
const alunoRoutes = require('./routes/alunoRoutes');
const authRouter = require('./routes/authRoutes')

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api', alunoRoutes)
app.use('/api', authRouter)
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})