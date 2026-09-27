


console.log("emprestimos.html carregado");


// ==========================================================
// CARREGAR LIVROS DISPONÍVEIS
// ==========================================================

async function carregarLivros() {

    const select =
        document.getElementById("livro");


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


        select.innerHTML = "";


        const opcaoInicial =
            document.createElement("option");


        opcaoInicial.value = "";

        opcaoInicial.textContent =
            "Selecione um livro";


        select.appendChild(
            opcaoInicial
        );


        dados.livros.forEach(
            function(livro) {

                if (
                    livro.Disponivel === "SIM" &&
                    Number(livro.quantidade) > 0
                ) {

                    const opcao =
                        document.createElement(
                            "option"
                        );


                    opcao.value =
                        livro.id_livro;


                    opcao.textContent =
                        livro.titulo +
                        " - " +
                        livro.autor_livro +
                        " (" +
                        livro.quantidade +
                        " disponível(is))";


                    select.appendChild(
                        opcao
                    );

                }

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar livros:",
            erro
        );


        select.innerHTML = "";


        const opcao =
            document.createElement(
                "option"
            );


        opcao.value = "";

        opcao.textContent =
            "Erro ao carregar livros";


        select.appendChild(
            opcao
        );

    }

}



// ==========================================================
// REGISTRAR EMPRÉSTIMO
// ==========================================================

document
    .getElementById("formEmprestimo")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const nomeAluno =
                document
                    .getElementById("nomeAluno")
                    .value
                    .trim();


            const sala =
                document
                    .getElementById("sala")
                    .value
                    .trim();

            const livro =
                document
                    .getElementById("livro")
                    .value;


            const mensagem =
                document.getElementById(
                    "mensagemEmprestimo"
                );


            const botao =
                document.getElementById(
                    "botaoEmprestimo"
                );


            if (
                nomeAluno === "" ||
                sala === "" ||
                livro === ""
            ) {

                mensagem.textContent =
                    "Preencha todos os campos.";


                mensagem.className =
                    "text-center font-bold mt-5 text-red-600";


                return;

            }


            botao.disabled = true;

            botao.textContent =
                "Registrando...";


            try {

                const resposta =
                    await fetch(
                        "http://127.0.0.1:5000/emprestimos",
                        {

                            method: "POST",

                            credentials: "include",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    nome_aluno:
                                        nomeAluno,

                                    sala:
                                        sala,

                                    id_livro:
                                        livro

                                })

                        }
                    );


                const dados =
                    await resposta.json();


                if (!resposta.ok) {

                    throw new Error(
                        dados.mensagem ||
                        "Erro ao registrar empréstimo."
                    );

                }


                mensagem.textContent =
                    dados.mensagem;


                mensagem.className =
                    "text-center font-bold mt-5 text-green-600";


                document
                    .getElementById(
                        "formEmprestimo"
                    )
                    .reset();


                botao.textContent =
                    "✓ Empréstimo registrado";


                botao.classList.remove(
                    "bg-blue-600"
                );


                botao.classList.add(
                    "bg-green-600"
                );


                carregarLivros();

                carregarEmprestimos();


                setTimeout(
                    function() {

                        botao.disabled = false;


                        botao.textContent =
                            "Registrar empréstimo";


                        botao.classList.remove(
                            "bg-green-600"
                        );


                        botao.classList.add(
                            "bg-blue-600"
                        );

                    },
                    2000
                );


            } catch (erro) {

                console.error(
                    "Erro:",
                    erro
                );


                mensagem.textContent =
                    erro.message;


                mensagem.className =
                    "text-center font-bold mt-5 text-red-600";


                botao.disabled = false;

                botao.textContent =
                    "Registrar empréstimo";

            }

        }
    );



// ==========================================================
// CARREGAR EMPRÉSTIMOS
// ==========================================================

async function carregarEmprestimos() {

    const pesquisa =
        document
            .getElementById(
                "pesquisaEmprestimo"
            )
            .value
            .trim();


    const lista =
        document.getElementById(
            "listaEmprestimos"
        );


    try {

        let url =
            "http://127.0.0.1:5000/emprestimos";


        if (pesquisa !== "") {

            url +=
                "?busca=" +
                encodeURIComponent(
                    pesquisa
                );

        }


        const resposta =
            await fetch(
                url,
                {
                    credentials: "include"
                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Erro ao buscar empréstimos."
            );

        }


        lista.innerHTML = "";


        if (
            dados.emprestimos.length === 0
        ) {

            lista.innerHTML = `

                <p
                    class="text-center
                    text-slate-500
                    py-5"
                >

                    Nenhum empréstimo encontrado.

                </p>

            `;

            return;

        }


        dados.emprestimos.forEach(
            function(emprestimo) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "border border-slate-200 " +
                    "rounded-xl p-5 mb-4";


                card.innerHTML = `

                    <div
                        class="flex
                        justify-between
                        items-start
                        gap-4"
                    >

                        <div>

                            <h3
                                class="text-lg
                                font-bold
                                text-slate-900"
                            >

                                📖
                                ${emprestimo.titulo}

                            </h3>


                            <p
                                class="text-slate-600
                                mt-2"
                            >

                                👤
                                <strong>Aluno:</strong>
                                ${emprestimo.nome_aluno}

                            </p>


                            <p
                                class="text-slate-600"
                            >

                                🏫
                                <strong>Sala:</strong>
                                ${emprestimo.sala}

                            </p>

                            <p
                                class="text-slate-600"
                            >

                                📅
                                <strong>Empréstimo:</strong>
                                ${emprestimo.data_emprestimo}

                            </p>

                        </div>


                        <div
                            class="flex
                            flex-col
                            gap-2
                            items-end"
                        >

                            <span
                                class="
                                bg-red-300
                                text-red-800
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-bold"
                            >

                                EMPRESTADO

                            </span>


                            <button
                                onclick="devolverLivro(
                                    ${emprestimo.id_emprestimo}
                                )"
                                class="
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                font-bold
                                px-4
                                py-2
                                rounded-xl"
                            >

                                ✓ Devolver

                            </button>

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
            "Erro:",
            erro
        );


        lista.innerHTML = `

            <p
                class="text-center
                text-red-600
                py-5"
            >

                ${erro.message}

            </p>

        `;

    }

}



// ==========================================================
// DEVOLVER LIVRO
// ==========================================================

async function devolverLivro(
    idEmprestimo
) {

    const confirmar =
        confirm(
            "Confirmar devolução deste livro?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await fetch(
                "http://127.0.0.1:5000/emprestimos/" +
                idEmprestimo +
                "/devolver",
                {

                    method: "PUT",

                    credentials: "include"

                }
            );


        const dados =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Erro ao devolver livro."
            );

        }


        alert(
            dados.mensagem
        );


        // Atualizar livros

        carregarLivros();


        // Atualizar empréstimos

        carregarEmprestimos();


    } catch (erro) {

        console.error(
            "Erro na devolução:",
            erro
        );


        alert(
            erro.message
        );

    }

}



// ==========================================================
// PESQUISA
// ==========================================================

let tempoPesquisaEmprestimo;


document
    .getElementById(
        "pesquisaEmprestimo"
    )
    .addEventListener(
        "input",
        function() {

            clearTimeout(
                tempoPesquisaEmprestimo
            );


            tempoPesquisaEmprestimo =
                setTimeout(
                    function() {

                        carregarEmprestimos();

                    },
                    300
                );

        }
    );



// ==========================================================
// INICIAR
// ==========================================================

carregarLivros();

carregarEmprestimos();

