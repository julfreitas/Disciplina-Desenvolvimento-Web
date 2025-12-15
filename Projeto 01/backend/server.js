const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const lerDados = (arquivo) => {
    return JSON.parse(fs.readFileSync(arquivo, 'utf-8'));
};

const escreverDados = (arquivo, dados) => {
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
};


app.get('/produtos', (req, res) => {
    const produtos = lerDados('produtos.json');
    res.json(produtos);
});

app.get('/carrinho', (req, res) => {
    const carrinho = lerDados('carrinho.json');
    res.json(carrinho);
});

app.post('/carrinho', (req, res) => {
    const carrinho = lerDados('carrinho.json');
    const novoItem = req.body;

    const itemExistente = carrinho.find(item => item.id === novoItem.id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        novoItem.quantidade = 1;
        carrinho.push(novoItem);
    }

    escreverDados('carrinho.json', carrinho);
    res.status(201).json({ message: "Produto adicionado ao carrinho!" });
});

app.put('/carrinho/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { quantidade } = req.body;
    let carrinho = lerDados('carrinho.json');

    const itemIndex = carrinho.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
        carrinho[itemIndex].quantidade = quantidade;
        escreverDados('carrinho.json', carrinho);
        res.json({ message: "Carrinho atualizado!" });
    } else {
        res.status(404).json({ message: "Item não encontrado." });
    }
});

app.delete('/carrinho/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let carrinho = lerDados('carrinho.json');

    const novoCarrinho = carrinho.filter(item => item.id !== id);

    escreverDados('carrinho.json', novoCarrinho);
    res.json({ message: "Item removido!" });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});