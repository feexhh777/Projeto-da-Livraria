        console.log("home_adm.html carregado");


        // ==================================================
        // VERIFICAR LOGIN
        // ==================================================

        const usuarioLogado =
            localStorage.getItem("usuario");


        if (!usuarioLogado) {

            alert(
                "Você precisa estar logado como administrador."
            );

            window.location.href =
                "login.html";

        }


        // ==================================================
        // SAIR
        // ==================================================

        function sair() {

            localStorage.removeItem("usuario");

            window.location.href =
                "../area_comun_user/home.html";

        }
