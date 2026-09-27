console.log("cad_gestao.js carregado");


document.getElementById("formcad").addEventListener("submit", async function(event) {

    event.preventDefault();


    // ==========================================
    // PEGAR OS CAMPOS
    // ==========================================

    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const senha = document.getElementById("senha").value.trim();


    const botao = document.getElementById("btnCadastrar");
    const mensagem = document.getElementById("mensagem");


    // ==========================================
    // VALIDAR CAMPOS
    // ==========================================

    if (!nome || !cpf || !senha) {

        mensagem.textContent = "Preencha todos os campos.";
        mensagem.className = "text-red-600";

        return;
    }


    // ==========================================
    // DESABILITAR BOTÃO
    // ==========================================

    botao.disabled = true;
    botao.textContent = "Cadastrando...";


    try {

        // ======================================
        // ENVIAR PARA O FLASK
        // ======================================

        const resposta = await fetch("http://127.0.0.1:5000/cad_gestao", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nome: nome,
                cpf: cpf,
                senha: senha
            })

        });


        // ======================================
        // RECEBER RESPOSTA
        // ======================================

        const dados = await resposta.json();


        console.log("Resposta do Flask:", dados);


        // ======================================
        // CADASTRO REALIZADO
        // ======================================

        if (resposta.ok) {

            mensagem.textContent = dados.mensagem;
            mensagem.className = "text-green-600";


            botao.textContent = "✓ Cadastrado!";
            botao.classList.remove("bg-blue-500");
            botao.classList.add("bg-green-600");


            // Limpar campos

            document.getElementById("nome").value = "";
            document.getElementById("cpf").value = "";
            document.getElementById("senha").value = "";


            // Voltar botão ao normal

            setTimeout(function() {

                botao.textContent = "Cadastrar";
                botao.disabled = false;

                botao.classList.remove("bg-green-600");
                botao.classList.add("bg-blue-500");

                mensagem.textContent = "";

            }, 2000);


        } else {

            // ==================================
            // ERRO RETORNADO PELO FLASK
            // ==================================

            mensagem.textContent = dados.mensagem;
            mensagem.className = "text-red-600";

            botao.textContent = "Cadastrar";
            botao.disabled = false;

        }


    } catch (erro) {

        // ======================================
        // FLASK NÃO RESPONDEU
        // ======================================

        console.error("Erro:", erro);

        mensagem.textContent = "Erro ao conectar com o servidor.";
        mensagem.className = "text-red-600";

        botao.textContent = "Cadastrar";
        botao.disabled = false;

    }

});