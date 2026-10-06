const usuario = localStorage.getItem("usuario");
const usuarioId = localStorage.getItem("usuario_id");
const usuarioCpf = localStorage.getItem("usuario_cpf");

if (!usuario || !usuarioId || !usuarioCpf) {
    window.location.href = "../area_comum_user/login.html";
}