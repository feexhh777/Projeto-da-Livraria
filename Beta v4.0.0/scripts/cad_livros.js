
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
            "bg-purple-600 text-white font-bold py-3 px-4 rounded-xl";

    document
        .getElementById("botaoManual")
        .className =
            "bg-slate-200 text-purple-700 hover:bg-purple-300 font-bold py-3 px-4 rounded-xl";

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
            "bg-purple-600 text-white font-bold py-3 px-4 rounded-xl";

    document
        .getElementById("botaoISBN")
        .className =
            "bg-slate-200 text-purple-700 hover:bg-purple-300 font-bold py-3 px-4 rounded-xl";

}


// ==========================================================
// CRIAR CAMPO EDITÁVEL QUANDO NÃO ENCONTRAR DADO
// ==========================================================

function configurarCampoISBN(
    containerId,
    spanId,
    valor,
    tipo = "text",
    placeholder = "Digite o valor"
) {

    const container =
        document.getElementById(containerId);


    if (!container) {

        return;

    }


    // ======================================================
    // REMOVER INPUT MANUAL ANTERIOR
    // ======================================================

    const inputExistente =
        container.querySelector(
            "input[data-campo-isbn='true']"
        );


    if (inputExistente) {

        inputExistente.remove();

    }


    const span =
        document.getElementById(spanId);


    if (!span) {

        return;

    }


    // ======================================================
    // VERIFICAR SE O VALOR É VÁLIDO
    // ======================================================

    const valorValido =
        valor !== null &&
        valor !== undefined &&
        String(valor).trim() !== "" &&
        String(valor).trim().toLowerCase() !== "não informado" &&
        String(valor).trim() !== "-";


    // ======================================================
    // VALOR ENCONTRADO
    // ======================================================

    if (valorValido) {

        span.textContent =
            String(valor).trim();

        span.classList.remove(
            "text-red-600"
        );

        return;

    }


    // ======================================================
    // VALOR NÃO ENCONTRADO
    // ======================================================

    span.textContent =
        "Não informado";


    span.classList.add(
        "text-red-600"
    );


    // ======================================================
    // CRIAR INPUT
    // ======================================================

    const input =
        document.createElement("input");


    input.type =
        tipo;


    input.placeholder =
        placeholder;


    input.dataset.campoIsbn =
        "true";


    input.className =
        "w-full mt-2 border-2 border-orange-400 rounded-xl p-3 " +
        "focus:outline-none focus:border-purple-600";


    if (tipo === "number") {

        input.min = "1";

    }


    container.appendChild(input);

}


// ==========================================================
// PEGAR VALOR DE UM CAMPO ISBN
// ==========================================================

function obterValorCampoISBN(
    containerId,
    spanId
) {

    const container =
        document.getElementById(containerId);


    if (!container) {

        return "";

    }


    const input =
        container.querySelector(
            "input[data-campo-isbn='true']"
        );


    // ======================================================
    // SE EXISTIR CAMPO MANUAL
    // ======================================================

    if (input) {

        return input.value.trim();

    }


    // ======================================================
    // PEGAR VALOR ENCONTRADO
    // ======================================================

    const span =
        document.getElementById(spanId);


    if (!span) {

        return "";

    }


    const valor =
        span.textContent.trim();


    if (
        valor === "" ||
        valor === "-" ||
        valor.toLowerCase() === "não informado"
    ) {

        return "";

    }


    return valor;

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
        // VERIFICAR RETORNO
        // ==================================================

        if (!dados.livro) {

            throw new Error(
                "A API não retornou os dados do livro."
            );

        }


        const livro =
            dados.livro;


        // ==================================================
        // TÍTULO
        // ==================================================

        configurarCampoISBN(
            "campoTituloISBN",
            "isbnTitulo",
            livro.titulo,
            "text",
            "Digite o título do livro"
        );


        // ==================================================
        // AUTOR
        // ==================================================

        configurarCampoISBN(
            "campoAutorISBN",
            "isbnAutor",
            livro.autor,
            "text",
            "Digite o autor do livro"
        );


        // ==================================================
        // EDITORA
        // ==================================================

        configurarCampoISBN(
            "campoEditoraISBN",
            "isbnEditora",
            livro.editora,
            "text",
            "Digite a editora do livro"
        );


        // ==================================================
        // ANO
        // ==================================================

        configurarCampoISBN(
            "campoAnoISBN",
            "isbnAno",
            livro.ano,
            "number",
            "Digite o ano de publicação"
        );


        // ==================================================
        // GÊNERO
        // ==================================================

        configurarCampoISBN(
            "campoGeneroISBN",
            "isbnGenero",
            livro.genero,
            "text",
            "Digite o gênero do livro"
        );


        // ==================================================
        // ISBN
        // ==================================================

        document
            .getElementById("isbnNumero")
            .textContent =
                livro.isbn ||
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

    // ======================================================
    // PEGAR DADOS
    // ======================================================

    const titulo =
        obterValorCampoISBN(
            "campoTituloISBN",
            "isbnTitulo"
        );


    const autor =
        obterValorCampoISBN(
            "campoAutorISBN",
            "isbnAutor"
        );


    const editora =
        obterValorCampoISBN(
            "campoEditoraISBN",
            "isbnEditora"
        );


    const ano =
        obterValorCampoISBN(
            "campoAnoISBN",
            "isbnAno"
        );


    const genero =
        obterValorCampoISBN(
            "campoGeneroISBN",
            "isbnGenero"
        );


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
    // VALIDAR TÍTULO
    // ======================================================

    if (titulo === "") {

        alert(
            "Preencha o título do livro."
        );

        return;

    }


    // ======================================================
    // VALIDAR AUTOR
    // ======================================================

    if (autor === "") {

        alert(
            "Preencha o autor do livro."
        );

        return;

    }


    // ======================================================
    // VALIDAR GÊNERO
    // ======================================================

    if (genero === "") {

        alert(
            "Preencha o gênero do livro."
        );

        return;

    }


    // ======================================================
    // VALIDAR ANO
    // ======================================================

    if (ano === "") {

        alert(
            "Preencha o ano do livro."
        );

        return;

    }


    // ======================================================
    // VALIDAR QUANTIDADE
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
        // ENVIAR PARA FLASK
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


        console.log(
            "Resposta do cadastro:",
            dados
        );


        // ==================================================
        // SUCESSO
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


                restaurarCamposISBN();


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
// RESTAURAR CAMPOS ISBN
// ==========================================================

function restaurarCamposISBN() {

    const campos = [

        {
            container: "campoTituloISBN",
            span: "isbnTitulo"
        },

        {
            container: "campoAutorISBN",
            span: "isbnAutor"
        },

        {
            container: "campoEditoraISBN",
            span: "isbnEditora"
        },

        {
            container: "campoAnoISBN",
            span: "isbnAno"
        },

        {
            container: "campoGeneroISBN",
            span: "isbnGenero"
        }

    ];


    campos.forEach(function(campo) {

        const container =
            document.getElementById(
                campo.container
            );


        if (!container) {

            return;

        }


        const input =
            container.querySelector(
                "input[data-campo-isbn='true']"
            );


        if (input) {

            input.remove();

        }


        const span =
            document.getElementById(
                campo.span
            );


        if (span) {

            span.textContent =
                "-";

            span.classList.remove(
                "text-red-600"
            );

        }

    });


    const isbnNumero =
        document.getElementById(
            "isbnNumero"
        );


    if (isbnNumero) {

        isbnNumero.textContent =
            "-";

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
                // ENVIAR PARA FLASK
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
                        "bg-purple-600",
                        "hover:bg-purple-700"
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
                            "bg-purple-600",
                            "hover:bg-purple-700"
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

