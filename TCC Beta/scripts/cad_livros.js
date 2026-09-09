
console.log("cad_livros.js carregando...");


// ==========================================================
// TROCAR PARA ISBN
// ==========================================================

function mostrarISBN() {

    document
        .getElementById("areaISBN")
        .classList.remove("hidden");

    document
        .getElementById("areaManual")
        .classList.add("hidden");

    document
        .getElementById("botaoISBN")
        .className =
            "bg-blue-600 text-white font-bold py-3 px-4 rounded-xl";

    document
        .getElementById("botaoManual")
        .className =
            "bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl";

}


// ==========================================================
// TROCAR PARA MANUAL
// ==========================================================

function mostrarManual() {

    document
        .getElementById("areaISBN")
        .classList.add("hidden");

    document
        .getElementById("areaManual")
        .classList.remove("hidden");

    document
        .getElementById("botaoManual")
        .className =
            "bg-blue-600 text-white font-bold py-3 px-4 rounded-xl";

    document
        .getElementById("botaoISBN")
        .className =
            "bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl";

}


// ==========================================================
// BUSCAR LIVRO PELO ISBN
// ==========================================================

async function buscarISBN() {

    const campoISBN =
        document.getElementById("isbnBusca");

    const isbn =
        campoISBN.value
            .trim()
            .replace(/-/g, "")
            .replace(/\s/g, "");


    const mensagem =
        document.getElementById("mensagemISBN");

    const resultado =
        document.getElementById("resultadoISBN");

    const botao =
        document.getElementById("botaoBuscarISBN");


    // ======================================================
    // VERIFICAR ISBN
    // ======================================================

    if (isbn === "") {

        mensagem.textContent =
            "Digite um ISBN.";

        mensagem.className =
            "text-center font-bold mt-5 text-red-600";

        return;

    }


    // ======================================================
    // INICIAR BUSCA
    // ======================================================

    botao.disabled = true;

    botao.textContent =
        "🔎 Buscando...";


    mensagem.textContent =
        "Consultando informações do livro...";

    mensagem.className =
        "text-center font-bold mt-5 text-blue-600";


    resultado.classList.add("hidden");


    try {

        // ==================================================
        // CONSULTAR FLASK
        // ==================================================

        const resposta = await fetch(
            "http://127.0.0.1:5000/buscar_isbn?isbn=" +
            encodeURIComponent(isbn),
            {
                method: "GET",

                credentials: "include"
            }
        );


        const dados =
            await resposta.json();


        console.log(
            "Resposta da API:",
            dados
        );


        // ==================================================
        // VERIFICAR ERRO
        // ==================================================

        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Livro não encontrado."
            );

        }


        // ==================================================
        // PREENCHER TÍTULO
        // ==================================================

        document
            .getElementById("isbnTitulo")
            .textContent =
                dados.livro.titulo ||
                "Não informado";


        // ==================================================
        // PREENCHER AUTOR
        // ==================================================

        document
            .getElementById("isbnAutor")
            .textContent =
                dados.livro.autor ||
                "Não informado";


        // ==================================================
        // PREENCHER EDITORA
        // ==================================================

        document
            .getElementById("isbnEditora")
            .textContent =
                dados.livro.editora ||
                "Não informado";


        // ==================================================
        // PREENCHER ANO
        // ==================================================

        document
            .getElementById("isbnAno")
            .textContent =
                dados.livro.ano ||
                "Não informado";


        // ==================================================
        // PREENCHER GÊNERO
        // ==================================================

        document
            .getElementById("isbnGenero")
            .textContent =
                dados.livro.genero ||
                "Não informado";


        // ==================================================
        // PREENCHER ISBN
        // ==================================================

        document
            .getElementById("isbnNumero")
            .textContent =
                dados.livro.isbn ||
                isbn;


        // ==================================================
        // MOSTRAR RESULTADO
        // ==================================================

        resultado.classList.remove("hidden");


        mensagem.textContent =
            "✓ Livro encontrado! Confira os dados antes de cadastrar.";

        mensagem.className =
            "text-center font-bold mt-5 text-green-600";


    } catch (erro) {

        console.error(
            "Erro ao buscar ISBN:",
            erro
        );


        mensagem.textContent =
            erro.message ||
            "Erro ao consultar o ISBN.";

        mensagem.className =
            "text-center font-bold mt-5 text-red-600";


    } finally {

        botao.disabled = false;

        botao.textContent =
            "🔎 Buscar livro";

    }

}


// ==========================================================
// CONFIRMAR CADASTRO POR ISBN
// ==========================================================

async function cadastrarPorISBN() {

    const titulo =
        document
            .getElementById("isbnTitulo")
            .textContent
            .trim();


    const autor =
        document
            .getElementById("isbnAutor")
            .textContent
            .trim();


    const editora =
        document
            .getElementById("isbnEditora")
            .textContent
            .trim();


    const ano =
        document
            .getElementById("isbnAno")
            .textContent
            .trim();


    const genero =
        document
            .getElementById("isbnGenero")
            .textContent
            .trim();


    const isbn =
        document
            .getElementById("isbnNumero")
            .textContent
            .trim();


    const quantidade =
        document
            .getElementById("quantidadeISBN")
            .value;


    const botao =
        document
            .getElementById("botaoCadastrarISBN");


    const mensagem =
        document
            .getElementById("mensagemCadastroISBN");


    // ======================================================
    // VERIFICAR SE EXISTE LIVRO
    // ======================================================

    if (
        titulo === "" ||
        titulo === "-"
    ) {

        alert(
            "Primeiro busque um livro pelo ISBN."
        );

        return;

    }


    // ======================================================
    // VERIFICAR QUANTIDADE
    // ======================================================

    if (
        quantidade === "" ||
        Number(quantidade) < 1
    ) {

        alert(
            "Informe uma quantidade válida."
        );

        return;

    }


    // ======================================================
    // PREPARAR BOTÃO
    // ======================================================

    botao.disabled = true;

    botao.textContent =
        "💾 Cadastrando...";


    mensagem.textContent =
        "Salvando livro no banco de dados...";

    mensagem.className =
        "text-center font-bold mt-4 text-blue-600";


    try {

        // ==================================================
        // ENVIAR PARA O FLASK
        // ==================================================

        const resposta = await fetch(
            "http://127.0.0.1:5000/cad_livros",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                credentials: "include",

                body: JSON.stringify({

                    titulo: titulo,

                    autor:
                        autor === "Não informado"
                            ? ""
                            : autor,

                    editora:
                        editora === "Não informado"
                            ? ""
                            : editora,

                    isbn: isbn,

                    genero:
                        genero === "Não informado"
                            ? ""
                            : genero,

                    ano:
                        ano === "Não informado"
                            ? ""
                            : ano,

                    quantidade:
                        Number(quantidade)

                })

            }
        );


        const dados =
            await resposta.json();


        console.log(
            "Resposta do cadastro:",
            dados
        );


        // ==================================================
        // CADASTRO REALIZADO
        // ==================================================

        if (resposta.ok) {

            mensagem.textContent =
                "✓ Livro cadastrado com sucesso!";

            mensagem.className =
                "text-center font-bold mt-4 text-green-600";


            botao.textContent =
                "✓ Cadastrado!";


            botao.classList.remove(
                "bg-green-600",
                "hover:bg-green-700"
            );


            botao.classList.add(
                "bg-blue-600"
            );


            // ==============================================
            // LIMPAR APÓS 2 SEGUNDOS
            // ==============================================

            setTimeout(function() {

                document
                    .getElementById("resultadoISBN")
                    .classList.add("hidden");


                document
                    .getElementById("isbnBusca")
                    .value = "";


                document
                    .getElementById("quantidadeISBN")
                    .value = 1;


                mensagem.textContent = "";


                botao.textContent =
                    "✓ Confirmar cadastro";


                botao.disabled = false;


                botao.classList.remove(
                    "bg-blue-600"
                );


                botao.classList.add(
                    "bg-green-600"
                );


            }, 2000);


        } else {

            // ==============================================
            // ERRO DO FLASK
            // ==============================================

            mensagem.textContent =
                dados.mensagem ||
                "Erro ao cadastrar livro.";

            mensagem.className =
                "text-center font-bold mt-4 text-red-600";


            botao.textContent =
                "✓ Confirmar cadastro";

            botao.disabled = false;

        }


    } catch (erro) {

        console.error(
            "Erro ao cadastrar livro:",
            erro
        );


        mensagem.textContent =
            "Erro ao conectar com o Flask. " +
            "Verifique se o servidor está rodando.";

        mensagem.className =
            "text-center font-bold mt-4 text-red-600";


        botao.textContent =
            "✓ Confirmar cadastro";

        botao.disabled = false;

    }

}


// ==========================================================
// CADASTRO MANUAL
// ==========================================================

const formulario =
    document.getElementById("formlivro");


if (formulario) {

    formulario.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // ==============================================
            // PEGAR DADOS
            // ==============================================

            const titulo =
                document
                    .getElementById("titulo")
                    .value
                    .trim();


            const autor =
                document
                    .getElementById("autor")
                    .value
                    .trim();


            const editora =
                document
                    .getElementById("editora")
                    .value
                    .trim();


            const isbn =
                document
                    .getElementById("isbn")
                    .value
                    .trim();


            const genero =
                document
                    .getElementById("genero")
                    .value
                    .trim();


            const ano =
                document
                    .getElementById("ano")
                    .value;


            const quantidade =
                document
                    .getElementById("quantidade")
                    .value;


            const mensagem =
                document
                    .getElementById("mensagem");


            const botao =
                document
                    .getElementById("botaoCadastrar");


            // ==============================================
            // VALIDAR
            // ==============================================

            if (
                titulo === "" ||
                autor === "" ||
                genero === "" ||
                ano === "" ||
                quantidade === ""
            ) {

                alert(
                    "Preencha todos os campos obrigatórios."
                );

                return;

            }


            if (
                Number(quantidade) < 1
            ) {

                alert(
                    "A quantidade deve ser pelo menos 1."
                );

                return;

            }


            // ==============================================
            // DESABILITAR BOTÃO
            // ==============================================

            botao.disabled = true;

            botao.textContent =
                "Cadastrando...";


            try {

                // ==========================================
                // ENVIAR PARA O FLASK
                // ==========================================

                const resposta =
                    await fetch(
                        "http://127.0.0.1:5000/cad_livros",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            credentials: "include",

                            body: JSON.stringify({

                                titulo:
                                    titulo,

                                autor:
                                    autor,

                                editora:
                                    editora,

                                isbn:
                                    isbn,

                                genero:
                                    genero,

                                ano:
                                    ano,

                                quantidade:
                                    Number(quantidade)

                            })

                        }
                    );


                const dados =
                    await resposta.json();


                // ==========================================
                // SUCESSO
                // ==========================================

                if (resposta.ok) {

                    mensagem.textContent =
                        dados.mensagem ||
                        "Livro cadastrado com sucesso!";

                    mensagem.className =
                        "text-center font-bold mt-5 text-green-600";


                    document
                        .getElementById("formlivro")
                        .reset();


                    document
                        .getElementById("quantidade")
                        .value = 1;


                    botao.textContent =
                        "✓ Livro cadastrado!";


                    botao.classList.remove(
                        "bg-blue-600"
                    );


                    botao.classList.add(
                        "bg-green-600"
                    );


                    setTimeout(function() {

                        botao.textContent =
                            "Cadastrar livro";

                        botao.disabled =
                            false;


                        botao.classList.remove(
                            "bg-green-600"
                        );


                        botao.classList.add(
                            "bg-blue-600"
                        );


                        mensagem.textContent =
                            "";

                    }, 2000);


                } else {

                    // ======================================
                    // ERRO
                    // ======================================

                    alert(
                        dados.mensagem ||
                        "Erro ao cadastrar livro."
                    );


                    botao.textContent =
                        "Cadastrar livro";

                    botao.disabled =
                        false;

                }


            } catch (erro) {

                console.error(
                    "Erro:",
                    erro
                );


                alert(
                    "Erro ao conectar com o Flask. " +
                    "Verifique se o app.py está rodando."
                );


                botao.textContent =
                    "Cadastrar livro";

                botao.disabled =
                    false;

            }

        }
    );

}
