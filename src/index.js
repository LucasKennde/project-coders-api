require("dotenv").config();
const express = require("express");
const db = require("./db.js");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: "uploads",
    allowedFormats: ["jpg", "png", "jpeg", "gif"],
});

const upload = multer({ storage: storage });

app.post("/product", upload.single("image"), async (req, res) => {
    try {
        const newProduct = {
            ...req.body,
            image: req.file.path,
        };
        const data = await db.insertProduct(newProduct);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
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
