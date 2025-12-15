const API_URL = 'http://localhost:3000';

async function carregarProdutos() {
    const container = document.getElementById('lista-produtos');
    if (!container) return; 

    try {
        const response = await fetch(`${API_URL}/produtos`);
        const produtos = await response.json();

        container.innerHTML = ''; 

        produtos.forEach(produto => {
            
            
            let caminhoImagem = produto.imagem;
            if (window.location.pathname.includes('/pages/')) {
                caminhoImagem = '../' + produto.imagem;
            }

            const produtoHTML = `
                <div class="pro">
                    <img src="${caminhoImagem}" alt="${produto.nome}">
                    <div class="des">
                        <h5>${produto.nome}</h5>
                        <div class="estrela">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <h4>R$${produto.preco.toFixed(2).replace('.', ',')}</h4>
                    </div>
                    <a href="#" onclick="adicionarAoCarrinho(${produto.id}, '${produto.nome}', ${produto.preco}, '${produto.imagem}'); return false;">
                        <i class="fa-solid fa-cart-shopping cart"></i>
                    </a>
                </div>
            `;
            container.innerHTML += produtoHTML;
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}
async function adicionarAoCarrinho(id, nome, preco, imagem) {
    try {
        const response = await fetch(`${API_URL}/carrinho`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, nome, preco, imagem })
        });

        if (response.ok) {
            alert("Produto adicionado ao carrinho!");
        }
    } catch (error) {
        console.error("Erro ao adicionar:", error);
    }
}

async function carregarCarrinho() {
    const tbody = document.getElementById('lista-carrinho');
    const subtotalElem = document.getElementById('cart-subtotal');
    const totalElem = document.getElementById('cart-final');

    if (!tbody) return;

    try {
        const response = await fetch(`${API_URL}/carrinho`);
        const itens = await response.json();

        tbody.innerHTML = '';
        let totalGeral = 0;

        itens.forEach(item => {
            const subtotalItem = item.preco * item.quantidade;
            totalGeral += subtotalItem;

           
            let caminhoImagem = item.imagem;
            if (window.location.pathname.includes('/pages/')) {
                caminhoImagem = '../' + item.imagem;
            }

            const linha = `
                <tr>
                    <td><a href="#" onclick="removerDoCarrinho(${item.id}); return false;"><i class="fa-solid fa-trash"></i></a></td>
                    <td><img src="${caminhoImagem}" alt=""></td>
                    <td>${item.nome}</td>
                    <td>R$${item.preco.toFixed(2).replace('.', ',')}</td>
                    <td>
                        <input type="number" value="${item.quantidade}" min="1" 
                        onchange="atualizarQuantidade(${item.id}, this.value)">
                    </td>
                    <td>R$${subtotalItem.toFixed(2).replace('.', ',')}</td>    
                </tr>
            `;
            tbody.innerHTML += linha;
        });

        const totalFormatado = `R$${totalGeral.toFixed(2).replace('.', ',')}`;
        if (subtotalElem) subtotalElem.innerText = totalFormatado;
        if (totalElem) totalElem.innerHTML = `<strong>${totalFormatado}</strong>`;

    } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
    }
}

async function atualizarQuantidade(id, novaQuantidade) {
    if(novaQuantidade < 1) return;
    
    await fetch(`${API_URL}/carrinho/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade: parseInt(novaQuantidade) })
    });
    carregarCarrinho(); 
}

async function removerDoCarrinho(id) {
    if(confirm("Tem certeza que deseja remover este item?")) {
        await fetch(`${API_URL}/carrinho/${id}`, {
            method: 'DELETE'
        });
        carregarCarrinho();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    carregarCarrinho();
});