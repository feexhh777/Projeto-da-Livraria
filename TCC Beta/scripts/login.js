
console.log("login.html carregado");


// ==========================================================
// LOGIN
// ==========================================================

document
    .getElementById("loginform")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const cpf =
                document
                    .getElementById("cpf")
                    .value
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


                const dados =
                    await resposta.json();


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
                // IR PARA HOME DO ADMINISTRADOR
                // ==================================================

                setTimeout(
                    function() {

                        window.location.href =
                            "home_adm.html";

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
