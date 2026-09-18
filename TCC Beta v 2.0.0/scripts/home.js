
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



// ==========================================================
// INICIAR
// ==========================================================

carregarLivros();
