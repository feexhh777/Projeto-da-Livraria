console.log("cad_livros.js carregando...");

document.getElementById("formlivro").addEventListener("submit", async function(event) {

    event.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const editora = document.getElementById("editora").value.trim();
    const isbn = document.getElementById("isbn").value.trim();
    const genero = document.getElementById("genero").value.trim();
    const ano = document.getElementById("ano").value;
    const quantidade = document.getElementById("quantidade").value;


    // Verificar campos

    if (
        titulo === "" ||
        autor === "" ||
        genero === "" ||
        ano === "" ||
        quantidade === ""
    ) {

        alert("Preencha todos os campos obrigatórios.");

        return;
    }


    const botao = document.getElementById("botaoCadastrar");

    botao.disabled = true;
    botao.textContent = "Cadastrando...";


    try {

        const resposta = await fetch("http://127.0.0.1:5000/cad_livros", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                titulo: titulo,
                autor: autor,
                editora: editora,
                isbn: isbn,
                genero: genero,
                ano: ano,
                quantidade: quantidade

            })

        });


        const dados = await resposta.json();


        if (resposta.ok) {

            document.getElementById("mensagem").textContent =
                dados.mensagem;

            document.getElementById("mensagem").className =
                "text-center font-bold mt-5 text-green-600";


            document.getElementById("formlivro").reset();

            document.getElementById("quantidade").value = 1;


            botao.textContent = "✓ Livro cadastrado!";

            botao.classList.remove("bg-blue-600");
            botao.classList.add("bg-green-600");


            setTimeout(function() {

                botao.textContent = "Cadastrar livro";

                botao.disabled = false;

                botao.classList.remove("bg-green-600");
                botao.classList.add("bg-blue-600");

                document.getElementById("mensagem").textContent = "";

            }, 2000);


        } else {

            alert(dados.mensagem || "Erro ao cadastrar livro.");

            botao.textContent = "Cadastrar livro";
            botao.disabled = false;

        }


    } catch (erro) {

        console.error("Erro:", erro);

        alert(
            "Erro ao conectar com o Flask. " +
            "Verifique se o app.py está rodando."
        );

        botao.textContent = "Cadastrar livro";
        botao.disabled = false;

    }

});
