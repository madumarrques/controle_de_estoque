document.addEventListener('DOMContentLoaded', carregarProdutos);

function carregarProdutos() {
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  const tabela = document.querySelector('#tabela-produtos tbody');
  tabela.innerHTML = '';

  produtos.forEach((p, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.categoria}</td>
      <td>R$ ${Number(p.preco).toFixed(2)}</td>
      <td>${p.quantidade}</td>
      <td>
        <button onclick="abrirEdicao(${index})">✏️</button>
        <button onclick="excluirProduto(${index})">🗑️</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

// Adicionar produto
document.querySelector('#form-produto')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.querySelector('#nome').value.trim();
  const categoria = document.querySelector('#categoria').value.trim();
  const preco = parseFloat(document.querySelector('#preco').value);
  const quantidade = parseInt(document.querySelector('#quantidade').value, 10);

  if (!nome || !categoria || Number.isNaN(preco) || Number.isNaN(quantidade)) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  produtos.push({ nome, categoria, preco, quantidade });
  localStorage.setItem('produtos', JSON.stringify(produtos));

  e.target.reset();
  carregarProdutos();
});

// Excluir produto
function excluirProduto(index) {
  if (confirm('Deseja excluir este produto?')) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.splice(index, 1);
    localStorage.setItem('produtos', JSON.stringify(produtos));
    carregarProdutos();
  }
}

// 🔧 Abrir o formulário de edição
function abrirEdicao(index) {
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  const produto = produtos[index];
  if (!produto) return alert('Produto não encontrado.');

  document.querySelector('#edit-index').value = index;
  document.querySelector('#edit-nome').value = produto.nome;
  document.querySelector('#edit-quantidade').value = produto.quantidade;
  document.querySelector('#edit-preco').value = produto.preco;

  document.querySelector('#form-editar').style.display = 'block';
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// 💾 Salvar as alterações
document.querySelector('#form-editar')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const index = document.querySelector('#edit-index').value;
  const novaQtd = parseInt(document.querySelector('#edit-quantidade').value, 10);
  const novoPreco = parseFloat(document.querySelector('#edit-preco').value);

  if (Number.isNaN(novaQtd) || novaQtd < 0 || Number.isNaN(novoPreco) || novoPreco < 0) {
    alert('Valores inválidos. Verifique os campos.');
    return;
  }

  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  produtos[index].quantidade = novaQtd;
  produtos[index].preco = novoPreco;

  localStorage.setItem('produtos', JSON.stringify(produtos));
  carregarProdutos();
  cancelarEdicao();
});

// ❌ Cancelar edição
function cancelarEdicao() {
  document.querySelector('#form-editar').style.display = 'none';
  document.querySelector('#edit-index').value = '';
  document.querySelector('#edit-nome').value = '';
  document.querySelector('#edit-quantidade').value = '';
  document.querySelector('#edit-preco').value = '';
}

// 🔍 Buscar produto
function buscarProduto() {
  const filtro = document.getElementById('busca-produto').value.toLowerCase();
  const linhas = document.querySelectorAll('#tabela-produtos tbody tr');

  linhas.forEach(linha => {
    const nome = linha.cells[0].textContent.toLowerCase();
    linha.style.display = nome.includes(filtro) ? '' : 'none';
  });
}

