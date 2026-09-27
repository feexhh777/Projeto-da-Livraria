
console.log("home.html carregado");


// ==========================================================
// CARREGAR LIVROS
// ==========================================================

async function carregarLivros() {

    const lista =
        document.getElementById(
            "listaLivros"
        );


    try {

        const resposta =
            await fetch(
                "http://127.0.0.1:5000/livros"
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Erro ao carregar livros."
            );

        }


        lista.innerHTML = "";


        // ==================================================
        // PEGAR SOMENTE LIVROS DISPONÍVEIS
        // ==================================================

        const livrosDisponiveis =
            dados.livros.filter(
                function(livro) {

                    return (
                        livro.Disponivel === "SIM" &&
                        Number(livro.quantidade) > 0
                    );

                }
            );


        if (
            livrosDisponiveis.length === 0
        ) {

            lista.innerHTML = `

                <div
                    class="col-span-full
                    bg-white
                    rounded-2xl
                    shadow-sm
                    p-8
                    text-center"
                >

                    <div class="text-4xl mb-3">
                        📚
                    </div>

                    <p
                        class="font-bold
                        text-slate-700"
                    >

                        Nenhum livro disponível no momento.

                    </p>

                    <p
                        class="text-sm
                        text-slate-500
                        mt-1"
                    >

                        Volte mais tarde para conferir.

                    </p>

                </div>

            `;

            return;

        }


        // ==================================================
        // MOSTRAR NO MÁXIMO 6 LIVROS
        // ==================================================

        livrosDisponiveis
            .slice(0, 6)
            .forEach(
                function(livro) {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "bg-white " +
                        "rounded-2xl " +
                        "shadow-sm " +
                        "border border-slate-100 " +
                        "p-4 " +
                        "hover:shadow-md " +
                        "transition";


                    card.innerHTML = `

                        <div class="flex gap-4">

                            <!-- CAPA -->

                            <div
                                class="w-16 h-24
                                flex-shrink-0
                                bg-gradient-to-br
                                from-blue-600
                                to-blue-900
                                rounded-lg
                                flex items-center
                                justify-center
                                text-white
                                text-center
                                font-bold
                                text-xs
                                p-2"
                            >

                                📖

                            </div>


                            <!-- INFORMAÇÕES -->

                            <div class="flex-1 min-w-0">

                                <h3
                                    class="font-bold
                                    text-slate-900
                                    truncate"
                                >

                                    ${livro.titulo}

                                </h3>


                                <p
                                    class="text-sm
                                    text-slate-500
                                    mt-1
                                    truncate"
                                >

                                    ${livro.autor_livro}

                                </p>


                                <p
                                    class="text-xs
                                    text-slate-400
                                    mt-1"
                                >

                                    ${livro.Genero || "Sem categoria"}

                                </p>


                                <div
                                    class="mt-3
                                    flex
                                    justify-between
                                    items-center"
                                >

                                    <span
                                        class="text-xs
                                        bg-green-100
                                        text-green-700
                                        px-2 py-1
                                        rounded-full
                                        font-semibold"
                                    >

                                        ${livro.quantidade}
                                        disponível(is)

                                    </span>

                                </div>

                            </div>

                        </div>

                    `;


                    lista.appendChild(
                        card
                    );

                }
            );


    } catch (erro) {

        console.error(
            "Erro ao carregar livros:",
            erro
        );


        lista.innerHTML = `

            <div
                class="col-span-full
                bg-red-50
                border border-red-100
                rounded-2xl
                p-6
                text-center
                text-red-600"
            >

                Não foi possível carregar os livros.

            </div>

        `;

    }

}



// ==========================================================
// PESQUISA
// ==========================================================

let tempoPesquisa;


document
    .getElementById(
        "pesquisaLivro"
    )
    .addEventListener(
        "input",
        function() {

            clearTimeout(
                tempoPesquisa
            );


            const valor =
                this.value.trim();


            tempoPesquisa =
                setTimeout(
                    async function() {

                        if (
                            valor === ""
                        ) {

                            carregarLivros();

                            return;

                        }


                        pesquisarLivros(
                            valor
                        );

                    },
                    300
                );

        }
    );



// ==========================================================
// PESQUISAR LIVROS
// ==========================================================

async function pesquisarLivros(
    termo
) {

    const lista =
        document.getElementById(
            "listaLivros"
        );


    const mensagem =
        document.getElementById(
            "mensagemPesquisa"
        );


    try {

        const resposta =
            await fetch(
                "http://127.0.0.1:5000/livros?busca=" +
                encodeURIComponent(
                    termo
                )
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Erro na pesquisa."
            );

        }


        lista.innerHTML = "";


        const resultados =
            dados.livros.filter(
                function(livro) {

                    return (
                        livro.Disponivel === "SIM" &&
                        Number(livro.quantidade) > 0
                    );

                }
            );


        mensagem.classList.remove(
            "hidden"
        );


        mensagem.textContent =
            resultados.length +
            " livro(s) encontrado(s) para: " +
            termo;


        if (
            resultados.length === 0
        ) {

            lista.innerHTML = `

                <div
                    class="col-span-full
                    bg-white
                    rounded-2xl
                    shadow-sm
                    p-8
                    text-center"
                >

                    <div class="text-4xl mb-3">
                        🔎
                    </div>

                    <p
                        class="font-bold
                        text-slate-700"
                    >

                        Nenhum livro encontrado.

                    </p>

                    <p
                        class="text-sm
                        text-slate-500
                        mt-1"
                    >

                        Tente pesquisar por outro título,
                        autor ou categoria.

                    </p>

                </div>

            `;

            return;

        }


        resultados
            .slice(0, 6)
            .forEach(
                function(livro) {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "bg-white " +
                        "rounded-2xl " +
                        "shadow-sm " +
                        "border border-slate-100 " +
                        "p-4";


                    card.innerHTML = `

                        <div class="flex gap-4">

                            <div
                                class="w-16 h-24
                                flex-shrink-0
                                bg-gradient-to-br
                                from-blue-600
                                to-blue-900
                                rounded-lg
                                flex items-center
                                justify-center
                                text-white
                                text-2xl"
                            >

                                📖

                            </div>


                            <div class="flex-1 min-w-0">

                                <h3
                                    class="font-bold
                                    text-slate-900"
                                >

                                    ${livro.titulo}

                                </h3>


                                <p
                                    class="text-sm
                                    text-slate-500
                                    mt-1"
                                >

                                    ${livro.autor_livro}

                                </p>


                                <p
                                    class="text-xs
                                    text-slate-400
                                    mt-1"
                                >

                                    ${livro.Genero || "Sem categoria"}

                                </p>


                                <span
                                    class="inline-block
                                    mt-3
                                    text-xs
                                    bg-green-100
                                    text-green-700
                                    px-2 py-1
                                    rounded-full
                                    font-semibold"
                                >

                                    ${livro.quantidade}
                                    disponível(is)

                                </span>

                            </div>

                        </div>

                    `;


                    lista.appendChild(
                        card
                    );

                }
            );


    } catch (erro) {

        console.error(
            "Erro na pesquisa:",
            erro
        );

    }

}



// ==========================================================
// PESQUISAR CATEGORIA
// ==========================================================

function buscarCategoria(
    categoria
) {

    const campo =
        document.getElementById(
            "pesquisaLivro"
        );


    campo.value =
        categoria;


    pesquisarLivros(
        categoria
    );


    window.scrollTo({

        top: 500,

        behavior: "smooth"

    });

}




async function carregarCapasLivros() {
            const lista = document.getElementById("listaLivros");
            if (!lista) return;

            try {
                const resposta = await fetch("http://127.0.0.1:5000/livros");
                const dados = await resposta.json();

                if (!dados.sucesso || !Array.isArray(dados.livros)) {
                    throw new Error("Não foi possível carregar os livros.");
                }

                const livros = dados.livros.slice(0, 6);

                if (livros.length === 0) {
                    lista.innerHTML = `
                        <div class="col-span-full bg-white rounded-2xl shadow-sm p-6 text-center text-slate-500">
                            Nenhum livro cadastrado ainda.
                        </div>
                    `;
                    return;
                }

                lista.innerHTML = livros.map(livro => {
                    const capa = livro.capa || "";
                    const disponivel = String(livro.Disponivel || "").toUpperCase() === "SIM";
                    const titulo = livro.titulo || "Sem título";
                    const autor = livro.autor_livro || "Autor não informado";
                    const genero = livro.Genero || "Sem categoria";

                    return `
                        <article class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition duration-200 border border-slate-100">
                            <div class="h-64 bg-slate-100 flex items-center justify-center overflow-hidden">
                                ${capa ? `
                                    <img
                                        src="${capa}"
                                        alt="Capa de ${titulo.replace(/"/g, '&quot;')}"
                                        class="h-full w-auto max-w-full object-cover"
                                        loading="lazy"
                                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                                    >
                                ` : ""}
                                <div class="${capa ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-slate-400 text-4xl">📚</div>
                            </div>

                            <div class="p-4">
                                <div class="flex items-start justify-between gap-2">
                                    <h3 class="font-bold text-slate-900 line-clamp-2">${titulo}</h3>
                                    <span class="shrink-0 text-[10px] px-2 py-1 rounded-full ${disponivel ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                        ${disponivel ? 'Disponível' : 'Indisponível'}
                                    </span>
                                </div>
                                <p class="text-sm text-slate-500 mt-2 line-clamp-1">${autor}</p>
                                <p class="text-xs text-blue-600 font-semibold mt-2">${genero}</p>
                            </div>
                        </article>
                    `;
                }).join("");

            } catch (erro) {
                console.error("Erro ao carregar capas:", erro);
                lista.innerHTML = `
                    <div class="col-span-full bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-600">
                        Não foi possível carregar os livros.
                    </div>
                `;
            }
        }

        document.addEventListener("DOMContentLoaded", carregarCapasLivros);
   




// ==========================================================
// INICIAR
// ==========================================================

carregarLivros();