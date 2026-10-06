console.log("js carregando");


document.getElementById("loginform").addEventListener("submit", async function(e) {

    e.preventDefault();


    const cpf =
        document.getElementById("usuario").value.trim();

    const senha =
        document.getElementById("senha").value.trim();


    if (cpf === "" || senha === "") {

        alert("Preencha todos os campos!");

        return;

    }


    try {

        const resposta = await fetch(
            "http://127.0.0.1:5000/login",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    cpf: cpf,
                    senha: senha

                })

            }
        );


        const dados = await resposta.json();


        console.log(
            "Resposta do login:",
            dados
        );


        if (resposta.ok) {

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


            window.location.href =
                "home_adm.html";


        } else {

            alert(
                dados.mensagem ||
                "CPF ou senha incorretos."
            );

        }


    } catch (erro) {

        console.error(
            "Erro no login:",
            erro
        );


        alert(
            "Erro ao conectar com o servidor."
        );

    }

});