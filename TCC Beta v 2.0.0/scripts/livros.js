
console.log("livros.html carregado");


// ==========================================================
// BUSCAR LIVROS
// ==========================================================

async function buscarLivros() {

    const pesquisa =
        document.getElementById("pesquisa").value.trim();


    const lista =
        document.getElementById("listaLivros");


    const mensagem =
        document.getElementById("mensagem");


    const contador =
        document.getElementById("contador");


    lista.innerHTML = "";

    mensagem.textContent = "Buscando livros...";


    try {


        let url =
            "http://127.0.0.1:5000/livros";


        // Se existir pesquisa,
        // envia a pesquisa para o Flask

        if (pesquisa !== "") {

            url += "?busca=" +
                encodeURIComponent(pesquisa);

        }


        const resposta =
            await fetch(url);


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Erro ao buscar livros."
            );

        }


        const livros =
            dados.livros;


        contador.textContent =
            livros.length + " encontrado(s)";


        if (livros.length === 0) {

            mensagem.textContent =
                "Nenhum livro encontrado.";

            return;

        }


        mensagem.textContent = "";


        // ==================================================
        // CRIAR OS CARDS
        // ==================================================

        livros.forEach(function(livro) {


            const disponivel =
                livro.Disponivel === "SIM";


            const card =
                document.createElement("div");


            card.className =
                "bg-white rounded-2xl shadow-md p-5";


            card.innerHTML = `

                <div class="flex justify-between
                items-start mb-4">

                    <div class="text-4xl">
                        📖
                    </div>

                    <span class="
                        ${disponivel
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"}
                        px-3 py-1 rounded-full
                        text-xs font-bold
                    ">

                        ${disponivel
                            ? "🟢 Disponível"
                            : "🔴 Indisponível"}

                    </span>

                </div>


                <h3 class="text-xl font-bold
                text-slate-900 mb-3">

                    ${livro.titulo}

                </h3>


                <p class="text-slate-600 mb-1">

                    <strong>Autor:</strong>
                    ${livro.autor_livro}

                </p>


                <p class="text-slate-600 mb-1">

                    <strong>Editora:</strong>
                    ${livro.editora || "Não informado"}

                </p>


                <p class="text-slate-600 mb-1">

                    <strong>Gênero:</strong>
                    ${livro.Genero}

                </p>


                <p class="text-slate-600 mb-1">

                    <strong>Ano:</strong>
                    ${livro.ANO || "Não informado"}

                </p>


                <p class="text-slate-600">

                    <strong>Exemplares:</strong>
                    ${livro.quantidade}

                </p>

            `;


            lista.appendChild(card);

        });


    } catch (erro) {

        console.error("Erro:", erro);


        mensagem.textContent =
            "Erro ao conectar com o Flask.";

    }

}



// ==========================================================
// PESQUISA
// ==========================================================

let tempoPesquisa;


document
    .getElementById("pesquisa")
    .addEventListener("input", function() {


        clearTimeout(tempoPesquisa);


        tempoPesquisa =
            setTimeout(function() {

                buscarLivros();

            }, 300);

    });



// ==========================================================
// CARREGAR AO ABRIR
// ==========================================================

buscarLivros();

