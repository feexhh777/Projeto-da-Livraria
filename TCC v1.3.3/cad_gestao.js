console.log("JS carregando")
document.getElementById("formcad").addEventListener("submit", async function(event){

    event.preventDefault();


    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;
    
    const resposta = await fetch("http://localhost:5000/cad_gestao", {

        method: "POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            nome: nome,
            cpf: cpf,
            senha: senha
        })

    });


    const dados = await resposta.json();


    document.getElementById("mensagem").innerHTML = dados.mensagem;



    if (resposta.ok) {

        const botao = document.getElementById("mensagem");

        botao.textContent = "✓ Aluno cadastrado!";
        botao.disabled = true;

        botao.classList.remove("bg-blue-500");
        botao.classList.add("bg-green-600");

        document.getElementById("nome").value = "";
        document.getElementById("ra").value = "";
        document.getElementById("telefone").value = "";

        setTimeout(() => {

            botao.textContent = "Cadastrar";
            botao.disabled = false;

            botao.classList.remove("bg-green-600");
            botao.classList.add("bg-blue-500");

    }, 2000);

} else {

    alert(dados.mensagem);

    botao.textContent="cadastrar";
    botao.disabled=false;

    }

});