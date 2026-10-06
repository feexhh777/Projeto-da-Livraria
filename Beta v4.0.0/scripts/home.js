
console.log("home.html carregado");


// ==========================================================
// CONFIGURAÇÃO
// ==========================================================

const API_URL = "http://127.0.0.1:5000";


// ==========================================================
// CARREGAR LIVROS DISPONÍVEIS
// ==========================================================

async function carregarLivros() {

    const lista =
        document.getElementById(
            "listaLivros"
        );

    if (!lista) return;


    try {

        const resposta =
            await fetch(
                `${API_URL}/livros`
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
                function (livro) {

                    return (
                        String(
                            livro.Disponivel || ""
                        ).toUpperCase() === "SIM" &&
                        Number(
                            livro.quantidade
                        ) > 0
                    );

                }
            );


        // ==================================================
        // NENHUM LIVRO DISPONÍVEL
        // ==================================================

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
                function (livro) {

                    const card =
                        criarCardLivro(
                            livro
                        );


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
// CRIAR CARD DE LIVRO
// ==========================================================

function criarCardLivro(
    livro
) {

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


    const titulo =
        livro.titulo ||
        "Sem título";


    const autor =
        livro.autor_livro ||
        "Autor não informado";


    const genero =
        livro.Genero ||
        "Sem categoria";


    const capa =
        livro.capa ||
        "";


    const quantidade =
        Number(
            livro.quantidade
        ) || 0;


    card.innerHTML = `

        <div class="flex gap-4">

            <!-- CAPA -->

            <div
                class="w-16 h-24
                flex-shrink-0
                bg-gradient-to-br
                from-purple-600
                to-purple-900
                rounded-lg
                flex items-center
                justify-center
                text-white
                text-center
                font-bold
                text-xs
                overflow-hidden"
            >

                ${
                    capa
                    ?
                    `
                        <img
                            src="${capa}"
                            alt="Capa de ${titulo}"
                            class="w-full
                            h-full
                            object-cover"
                            onerror="
                                this.style.display='none';
                            "
                        >
                    `
                    :
                    `📖`
                }

            </div>


            <!-- INFORMAÇÕES -->

            <div
                class="flex-1
                min-w-0"
            >

                <h3
                    class="font-bold
                    text-slate-900
                    truncate"
                >
                    ${titulo}
                </h3>


                <p
                    class="text-sm
                    text-slate-500
                    mt-1
                    truncate"
                >
                    ${autor}
                </p>


                <p
                    class="text-xs
                    text-slate-400
                    mt-1"
                >
                    ${genero}
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
                        ${quantidade}
                        disponível(is)
                    </span>

                </div>

            </div>

        </div>

    `;


    return card;

}


// ==========================================================
// PESQUISA
// ==========================================================

let tempoPesquisa;


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const campoPesquisa =
            document.getElementById(
                "pesquisaLivro"
            );


        if (!campoPesquisa) return;


        campoPesquisa.addEventListener(
            "input",
            function () {

                clearTimeout(
                    tempoPesquisa
                );


                const valor =
                    this.value.trim();


                tempoPesquisa =
                    setTimeout(
                        async function () {

                            if (
                                valor === ""
                            ) {

                                const mensagem =
                                    document.getElementById(
                                        "mensagemPesquisa"
                                    );


                                if (mensagem) {

                                    mensagem.classList.add(
                                        "hidden"
                                    );

                                }


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


    if (!lista) return;


    try {

        const resposta =
            await fetch(
                `${API_URL}/livros?busca=` +
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
                function (livro) {

                    return (
                        String(
                            livro.Disponivel || ""
                        ).toUpperCase() === "SIM" &&
                        Number(
                            livro.quantidade
                        ) > 0
                    );

                }
            );


        // ==================================================
        // MENSAGEM DE PESQUISA
        // ==================================================

        if (mensagem) {

            mensagem.classList.remove(
                "hidden"
            );


            mensagem.textContent =
                resultados.length +
                " livro(s) encontrado(s) para: " +
                termo;

        }


        // ==================================================
        // NENHUM RESULTADO
        // ==================================================

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


        // ==================================================
        // MOSTRAR RESULTADOS
        // ==================================================

        resultados
            .slice(0, 6)
            .forEach(
                function (livro) {

                    const card =
                        criarCardLivro(
                            livro
                        );


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
                Não foi possível realizar a pesquisa.
            </div>

        `;

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


    if (!campo) return;


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
// 3 LIVROS MAIS EMPRESTADOS DA SEMANA
// ==========================================================

async function carregarMaisEmprestadosSemana() {

    // IMPORTANTE:
    // O ID do seu HTML é "top3Semana"

    const lista =
        document.getElementById(
            "top3Semana"
        );


    if (!lista) return;


    try {

        const resposta =
            await fetch(
                `${API_URL}/top3_semana`
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Erro ao carregar o Top 3 da semana."
            );

        }


        lista.innerHTML = "";


        // ==================================================
        // NENHUM EMPRÉSTIMO
        // ==================================================

        if (
            !dados.livros ||
            dados.livros.length === 0
        ) {

            lista.innerHTML = `

                <div
                    class="lg:col-span-3
                    bg-white/10
                    rounded-2xl
                    p-6
                    text-center
                    text-slate-300"
                >

                    <div class="text-4xl mb-3">
                        📚
                    </div>

                    <p class="font-bold">
                        Ainda não há empréstimos nesta semana.
                    </p>

                    <p class="text-sm mt-1">
                        Os livros mais emprestados aparecerão aqui.
                    </p>

                </div>

            `;

            return;

        }


        // ==================================================
        // MOSTRAR OS 3 LIVROS
        // ==================================================

        dados.livros
            .slice(0, 3)
            .forEach(
                function (
                    livro,
                    indice
                ) {

                    const titulo =
                        livro.titulo ||
                        "Sem título";


                    const autor =
                        livro.autor_livro ||
                        "Autor não informado";


                    const genero =
                        livro.Genero ||
                        "Sem categoria";


                    const capa =
                        livro.capa ||
                        "";


                    const totalEmprestimos =
                        Number(
                            livro.total_emprestimos
                        ) || 0;


                    const posicao =
                        indice + 1;


                    // ==================================================
                    // MEDALHA
                    // ==================================================

                    let medalha;


                    if (
                        posicao === 1
                    ) {

                        medalha = "🥇";

                    } else if (
                        posicao === 2
                    ) {

                        medalha = "🥈";

                    } else {

                        medalha = "🥉";

                    }


                    const card =
                        document.createElement(
                            "article"
                        );


                    card.className =
                        "bg-white " +
                        "rounded-2xl " +
                        "shadow-lg " +
                        "overflow-hidden " +
                        "border border-white/10";


                    card.innerHTML = `

                        <!-- CAPA -->

                        <div
                            class="h-56
                            bg-slate-100
                            flex
                            items-center
                            justify-center
                            overflow-hidden"
                        >

                            ${
                                capa
                                ?
                                `
                                    <img
                                        src="${capa}"
                                        alt="Capa de ${titulo}"
                                        class="h-full
                                        w-auto
                                        max-w-full
                                        object-cover"
                                        loading="lazy"
                                        onerror="
                                            this.style.display='none';
                                            this.nextElementSibling.style.display='flex';
                                        "
                                    >
                                `
                                :
                                ""
                            }


                            <div
                                class="${
                                    capa
                                    ? "hidden"
                                    : "flex"
                                }
                                w-full
                                h-full
                                items-center
                                justify-center
                                text-slate-400
                                text-5xl"
                            >
                                📚
                            </div>

                        </div>


                        <!-- INFORMAÇÕES -->

                        <div class="p-5">

                            <div
                                class="flex
                                items-center
                                gap-2
                                mb-2"
                            >

                                <span
                                    class="text-2xl"
                                >
                                    ${medalha}
                                </span>


                                <span
                                    class="text-xs
                                    font-bold
                                    text-purple-600
                                    uppercase"
                                >
                                    ${posicao}º lugar
                                </span>

                            </div>


                            <h3
                                class="font-bold
                                text-lg
                                text-slate-900
                                line-clamp-2"
                            >
                                ${titulo}
                            </h3>


                            <p
                                class="text-sm
                                text-slate-500
                                mt-2
                                line-clamp-1"
                            >
                                ${autor}
                            </p>


                            <p
                                class="text-xs
                                text-slate-400
                                mt-1"
                            >
                                ${genero}
                            </p>


                            <div
                                class="mt-4"
                            >

                                <span
                                    class="inline-block
                                    text-xs
                                    bg-purple-100
                                    text-purple-700
                                    px-3 py-2
                                    rounded-full
                                    font-semibold"
                                >
                                    📚
                                    ${totalEmprestimos}
                                    empréstimo(s)
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
            "Erro ao carregar Top 3:",
            erro
        );


        lista.innerHTML = `

            <div
                class="lg:col-span-3
                bg-red-500/20
                border
                border-red-300/20
                rounded-2xl
                p-6
                text-center
                text-red-200"
            >

                Não foi possível carregar
                os livros mais emprestados.

            </div>

        `;

    }

}


// ==========================================================
// INICIAR A PÁGINA
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarLivros();

        carregarMaisEmprestadosSemana();

    }
);
