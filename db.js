const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Configurações do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
    timeout: 60000,
});


async function insertUser(newUser) {
    try {
        const hashedPassword = await bcrypt.hash(newUser.password, 10);

        const userWithId = {
            id: uuidv4(),
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword
        };

        const { data, error } = await supabase
            .from("users")
            .insert([userWithId]);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erro ao inserir usuário:", error);
        throw error;
    }
}

async function insertCategory(categoryName) {
    try {
        const newcategory = {
            id: uuidv4(),
            name: categoryName
        }

        const { data, error } = await supabase.from("categories").insert([newcategory])
    } catch (error) {
        console.error("Erro ao inserir categoria:", error)
        throw error
    }

}

async function loginUser(email, password) {
    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (error || !user) throw new Error("Usuário não encontrado");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Senha inválida");

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { token, user: { id: user.id, name: user.name, email: user.email } };
}

async function insertProduct(productData) {
    try {
        const productWithId = {
            id: uuidv4(),
            ...productData
        };

        const { data, error } = await supabase
            .from("products")
            .insert([productWithId]);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erro ao inserir produto:", error);
        throw error;
    }
}

async function searchAllCategory() {
    try {

        const { data, error } = await supabase
            .from("categories")
            .select("*")
        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
    }
}

async function searchAllProducts() {
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
        if (error) throw error;
        console.log(data)
        return data
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
    }

}

module.exports = {
    insertUser,
    loginUser,
    insertCategory,
    insertProduct,
    searchAllCategory,
    searchAllProducts
};
