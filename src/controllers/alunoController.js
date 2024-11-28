const { supabase } = require('../config/database');
const bcrypt = require("bcrypt");


async function listarAlunos(req, res) {
    const aluno = 'aluno'
    try {

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq("status", aluno);

        if (error) throw error;

        res.status(200).json(data);
    } catch (err) {
        console.error('Erro ao listar alunos:', err.message);
        res.status(500).json({ error: 'Erro ao buscar alunos no banco de dados.' });
    }
}

module.exports = { listarAlunos };
