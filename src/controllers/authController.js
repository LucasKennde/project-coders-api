require("dotenv").config();
const { supabase } = require('../config/database');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");


async function loginUser(req, res) {
    const { email, password } = req.body;
    console.log("Email recebido:", email);
    console.log("Senha recebida:", password);

    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (error) {
            console.error("Erro no Supabase:", error);
            throw new Error("Erro ao buscar usuário");
        }

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        console.log("Usuário encontrado:", user);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Senha inválida");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, status: user.status, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ token });
    } catch (err) {
        console.error("Erro no login:", err.message);
        res.status(400).json({ error: err.message });
    }
}

async function createUser(req, res) {
    const { name, email, password } = req.body;

    try {
        const userExists = await verifyUser(email);
        console.log("Usuario existe:", userExists);

        if (userExists) {
            return res.status(400).json({ error: "Usuário já cadastrado" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const userWithId = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            status: "aluno",
        };

        const { data, error } = await supabase
            .from("users")
            .insert([userWithId]);

        if (error) throw error;

        return res.status(201).json({ message: "Usuário criado com sucesso", data });
    } catch (error) {
        console.error("Erro ao inserir usuário:", error);
        return res.status(500).json({ error: "Erro interno ao criar usuário" });
    }
}

async function verifyUser(email) {
    const { data: user, error } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Erro ao verificar usuário:", error);
        throw error;
    }

    return user ? true : false;
}
module.exports = { loginUser, createUser };