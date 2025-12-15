const botoes = document.querySelectorAll("button");

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {

    const texto = botao.previousElementSibling.textContent;

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.push(texto);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    const precoTexto = texto.split("R$")[1].trim();  // "12,00"
    const precoNumber = parseFloat(precoTexto.replace(",", ".")); // 12

    let total = parseFloat(localStorage.getItem("total")) || 0;
    total += precoNumber;
    localStorage.setItem("total", total);

    alert("Item adicionado!");
  });
});
