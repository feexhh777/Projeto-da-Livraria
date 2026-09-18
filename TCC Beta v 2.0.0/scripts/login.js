console.log("login.html carregado");

// ==========================================================
// MÁSCARA DO CPF
// ==========================================================

const campoCpf = document.getElementById("cpf");

campoCpf.addEventListener("input", function () {


// Remove tudo que não for número
let valor = this.value.replace(/\D/g, "");

// Limita a 11 números
valor = valor.substring(0, 11);

// Aplica a máscara
if (valor.length > 9) {

    valor = valor.replace(
        /^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/,
        "$1.$2.$3-$4"
    );

} else if (valor.length > 6) {

    valor = valor.replace(
        /^(\d{3})(\d{3})(\d{0,3}).*/,
        "$1.$2.$3"
    );

} else if (valor.length > 3) {

    valor = valor.replace(
        /^(\d{3})(\d{0,3}).*/,
        "$1.$2"
    );

}

this.value = valor;

});

// ==========================================================
// LOGIN
// ==========================================================

document
.getElementById("loginform")
.addEventListener(
"submit",
async function(event) {


        event.preventDefault();


        // ==================================================
        // PEGAR CAMPOS
        // ==================================================

        const cpf =
            document
                .getElementById("cpf")
                .value
                .replace(/\D/g, "")
                .trim();


        const senha =
            document
                .getElementById("senha")
                .value
                .trim();


        const mensagem =
            document.getElementById(
                "mensagemLogin"
            );


        const botao =
            document.getElementById(
                "botaoLogin"
            );


        // ==================================================
        // VALIDAR CAMPOS
        // ==================================================

        if (
            cpf === "" ||
            senha === ""
        ) {

            mensagem.textContent =
                "Preencha todos os campos.";

            mensagem.className =
                "text-center font-bold mt-5 text-red-600";

            return;

        }


        // ==================================================
        // VALIDAR TAMANHO DO CPF
        // ==================================================

        if (cpf.length !== 11) {

            mensagem.textContent =
                "Digite um CPF válido.";

            mensagem.className =
                "text-center font-bold mt-5 text-red-600";

            return;

        }


        botao.disabled = true;

        botao.textContent =
            "Entrando...";


        try {


            // ==================================================
            // ENVIAR LOGIN PARA O FLASK
            // ==================================================

            const resposta =
                await fetch(
                    "http://127.0.0.1:5000/login",
                    {

                        method: "POST",

                        credentials: "include",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                cpf: cpf,

                                senha: senha

                            })

                    }
                );


            console.log(
                "CHEGOU NA RESPOSTA DO LOGIN"
            );

            console.log(
                "Status:",
                resposta.status
            );


            const dados =
                await resposta.json();


            console.log(
                "DADOS RECEBIDOS:",
                dados
            );

            console.log(
                "SUCESSO:",
                dados.sucesso
            );


            // ==================================================
            // VERIFICAR RESPOSTA
            // ==================================================

            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    "Erro ao realizar login."
                );

            }


            if (!dados.sucesso) {

                throw new Error(
                    dados.mensagem ||
                    "CPF ou senha incorretos."
                );

            }


            console.log(
                "Login realizado:",
                dados.usuario
            );


            // ==================================================
            // SALVAR DADOS DO USUÁRIO
            // ==================================================

            localStorage.setItem(
                "usuario",
                dados.usuario.nome
            );


            localStorage.setItem(
                "usuario_id",
                dados.usuario.id
            );


            localStorage.setItem(
                "usuario_cpf",
                dados.usuario.cpf
            );


            console.log(
                "Dados do usuário salvos no localStorage."
            );


            // ==================================================
            // MOSTRAR SUCESSO
            // ==================================================

            mensagem.textContent =
                "Login realizado com sucesso!";

            mensagem.className =
                "text-center font-bold mt-5 text-green-600";


            botao.textContent =
                "✓ Login realizado";


            botao.classList.remove(
                "from-blue-600",
                "to-blue-700"
            );


            botao.classList.add(
                "bg-green-600"
            );


            // ==================================================
            // REDIRECIONAR
            // ==================================================

            console.log(
                "VAI REDIRECIONAR AGORA"
            );


            setTimeout(
                function() {

                    window.location.href =
                        "../area_adm/home_adm.html";

                },
                500
            );


        } catch (erro) {

            console.error(
                "Erro no login:",
                erro
            );


            mensagem.textContent =
                erro.message;


            mensagem.className =
                "text-center font-bold mt-5 text-red-600";


            botao.disabled = false;

            botao.textContent =
                "Entrar";

        }

    }
);

