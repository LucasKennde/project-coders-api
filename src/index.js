require("dotenv").config();
const express = require("express");
const db = require("./db.js");
const cors = require("cors");
const multer = require('multer');
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const app = express();
app.use(cors());
app.use(express.json());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads",
        allowed_formats: ["jpg", "png", "jpeg"],
    },
});
const upload = multer({ storage });

app.post('/upload/image', upload.single('image'), (req, res) => {
    const imageUrl = req.file.path;
    res.status(200).json({ imageUrl });
});

app.post("/users", async (req, res) => {
    try {
        const newUser = req.body;
        const data = await db.insertUser(newUser);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await db.loginUser(email, password);

        res.status(200).json({ message: "Login bem-sucedido", token, user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});


app.post("/category", async (req, res) => {
    try {
        const { name } = req.body;
        const data = await db.insertCategory(name);
        console.log(data)
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.post("/product", async (req, res) => {
    try {
        const newProduto = req.body;
        const data = await db.insertProduct(newProduto);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

})

app.get("/categories", async (req, res) => {
    try {
        const category = await db.searchAllCategory()
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

app.get("/products", async (req, res) => {
    try {
        const products = await db.searchAllProducts()
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})















app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
