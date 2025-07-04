let dadoFetchado = "http://localhost:3000/products";

//Função para criar e retornar um elemento HTML representando um produto
function newBook(book) {
    //cria uma div para o livro e adiciona a classe de coluna
    const div = document.createElement('div');
    div.className = 'column is-4';

    //Define o conteudo HTML interno da div com os dados do livro
    div.innerHTML = `
        <div class="card is-shady">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img
                        src="${book.photo}" 
                        alt="${book.name}" 
                        class="modal-button"
                    />
                </figure>
            </div>
            <div class="card-content">
                <div class="content book" data-id="${book.id}"> 
                    <div class="book-meta">
                        <p class="is-size-4">R$${book.price.toFixed(2)}</p> 
                        <p class="is-size-6">Disponível em estoque: 5</p> 
                        <h4 class="is-size-3 title">${book.name}</h4> 
                        <p class="subtitle">${book.author}</p> 
                    </div>
                    <div class="field has-addons"> 
                        <div class="control">
                            <input class="input" type="text" id="input-cep-${book.id}" placeholder="Digite o CEP"/>
                        </div>
                        <div class="control">
                            <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
                        </div>
                    </div>
                    <button class="button button-buy is-success is-fullwidth">Comprar</button>
                </div>
            </div>
        </div>`;
    
    //Retorna o elemento montado
    return div;
}

//Função para calcular o frete com base no ID do livro e no CEP
function calculateShipping(id, cep) {
    fetch('http://localhost:3000/shipping' + cep) //Faz requisição para a API de frete
        .then((data) => {
            if(data.ok) {
                return data.json(); //converte a resposta para JSON se estiver ok
            }
            throw data.statusText; //caso contrário, lança erro
        })
        .then((data) => {
            //Mostra o valor do frete
            swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success');
        })
        .catch((err) => {
            //Mostra erro se a requisição falhar
            swal('Erro', 'Erro ao consultar frete', 'error');
            console.error(err);
        });
}

//Função que define un novo valor para a variavel dadoFetchado baseado no input
function searchID(){
    let userInput = document.getElementById("input-id").value;

    if (userInput == "") {
        dadoFetchado = "http://localhost:3000/products";
    } else {
    dadoFetchado = "http://localhost:3000/product/" + userInput}
    carregarLivros();

}

// Função pra substituir a antiga da esperar pelo DOM. Acho q funciona melhor assim
function carregarLivros(){
    const books = document.querySelector('.books'); //Seleciona o container onde os livros serão exibidos

    books.innerHTML = ''; // Limpa a lista antes de renderizar

    //Busca os produtos (livros) do servidor
    fetch(dadoFetchado)
        .then((data) => {
            if (data.ok) {
                return data.json(); //Converte a resposta para JSON se estiver ok
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                // Para cada livro, cria e adiciona o elemento ao container
                const livros = Array.isArray(data) ? data : [data]; // Se for array, mantém normal. Se for só um objeto, transforma em um array de um unico item (forEach só funciona em array)

                livros.forEach(book => {
                books.appendChild(newBook(book));
                });

                //adiciona evento de clique aos botões de calcular frete
                document.querySelectorAll('.button-shipping').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id'); //Pega o ID do livro

                        const cep = document.getElementById("input-cep-" + id).value //Pega o CEP digitado

                        if (cep != ""){
                            calculateShipping(id, cep); //chama a função de frete
                        }
                    });
                });

                //adiciona evento de clique aos botões de compra
                document.querySelectorAll('.button-buy').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
                    });
                });
            }
        })
        .catch((err) => {
            //Em caso de erro ao carregar os produtos
            swal('Erro', 'Erro ao listar os produtos', 'error');
            console.error(err);
        });
}