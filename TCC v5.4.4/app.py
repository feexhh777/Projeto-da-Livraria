from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector


# ==========================================================
# CONFIGURAÇÃO DO FLASK
# ==========================================================

app = Flask(__name__)

# Chave usada para proteger a sessão
app.secret_key = "LEArning_TCC_2026"

# Permitir comunicação com o Front-End
CORS(
    app,
    supports_credentials=True
)


# ==========================================================
# CONEXÃO COM O BANCO
# ==========================================================

def conectar_banco():

    print(
        "Tentando conectar ao MariaDB...",
        flush=True
    )

    conexao = mysql.connector.connect(
        host="127.0.0.1",
        port=3306,
        user="root",
        password="traira24",
        database="biblioteca",
        use_pure=True,
        connection_timeout=10
    )

    print(
        "Conectado ao MariaDB!",
        flush=True
    )

    return conexao


# ==========================================================
# VERIFICAR SE O USUÁRIO ESTÁ LOGADO
# ==========================================================

def verificar_login():

    if "usuario_id" not in session:

        return False

    return True


# ==========================================================
# TESTE DO BANCO
# ==========================================================

@app.route("/teste_banco", methods=["GET"])
def teste_banco():

    conexao = None

    try:

        conexao = conectar_banco()

        return jsonify({
            "sucesso": True,
            "mensagem": "Banco conectado com sucesso!"
        }), 200

    except mysql.connector.Error as erro:

        print(
            "ERRO MYSQL:",
            erro,
            flush=True
        )

        return jsonify({
            "sucesso": False,
            "mensagem": str(erro)
        }), 500

    except Exception as erro:

        print(
            "ERRO:",
            erro,
            flush=True
        )

        return jsonify({
            "sucesso": False,
            "mensagem": str(erro)
        }), 500

    finally:

        if conexao:
            conexao.close()


# ==========================================================
# LOGIN
# ==========================================================

@app.route("/login", methods=["POST"])
def login():

    dados = request.get_json()

    print(
        "Dados de login recebidos:",
        dados,
        flush=True
    )

    if not dados:

        return jsonify({
            "sucesso": False,
            "mensagem": "Nenhum dado foi recebido."
        }), 400


    cpf = dados.get("cpf")
    senha = dados.get("senha")


    if not cpf or not senha:

        return jsonify({
            "sucesso": False,
            "mensagem": "Informe CPF e senha."
        }), 400


    conexao = None
    cursor = None


    try:

        conexao = conectar_banco()

        cursor = conexao.cursor(
            dictionary=True
        )


        sql = """
            SELECT
                id,
                NOME,
                CPF,
                Senha
            FROM usuario_adm
            WHERE CPF = %s
            LIMIT 1
        """


        cursor.execute(
            sql,
            (cpf,)
        )


        usuario = cursor.fetchone()


        if not usuario:

            return jsonify({
                "sucesso": False,
                "mensagem": "CPF ou senha incorretos."
            }), 401


        if str(usuario["Senha"]) != str(senha):

            return jsonify({
                "sucesso": False,
                "mensagem": "CPF ou senha incorretos."
            }), 401


        # ==================================================
        # CRIAR SESSÃO
        # ==================================================

        session["usuario_id"] = usuario["id"]

        session["usuario_nome"] = usuario["NOME"]

        session["usuario_cpf"] = usuario["CPF"]


        print(
            "Login realizado:",
            usuario["NOME"],
            flush=True
        )


        return jsonify({

            "sucesso": True,

            "mensagem":
                "Login realizado com sucesso!",

            "usuario": {

                "id":
                    usuario["id"],

                "nome":
                    usuario["NOME"],

                "cpf":
                    usuario["CPF"]

            }

        }), 200


    except mysql.connector.Error as erro:

        print(
            "ERRO MYSQL NO LOGIN:",
            erro,
            flush=True
        )

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Erro no banco de dados: "
                + str(erro)
        }), 500


    except Exception as erro:

        print(
            "ERRO NO LOGIN:",
            erro,
            flush=True
        )

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Erro interno: "
                + str(erro)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if conexao:
            conexao.close()


# ==========================================================
# LOGOUT
# ==========================================================

@app.route("/logout", methods=["POST"])
def logout():

    session.clear()

    return jsonify({
        "sucesso": True,
        "mensagem": "Logout realizado com sucesso."
    }), 200


# ==========================================================
# VERIFICAR SESSÃO
# ==========================================================

@app.route("/verificar_login", methods=["GET"])
def verificar_login_rota():

    if not verificar_login():

        return jsonify({
            "sucesso": False,
            "logado": False,
            "mensagem": "Usuário não autenticado."
        }), 401


    return jsonify({

        "sucesso": True,

        "logado": True,

        "usuario": {

            "id":
                session["usuario_id"],

            "nome":
                session["usuario_nome"],

            "cpf":
                session["usuario_cpf"]

        }

    }), 200


# ==========================================================
# CADASTRO DE GESTÃO
# ==========================================================

@app.route("/cad_gestao", methods=["POST"])
def cadastrar_gestao():

    # Somente ADM logado
    if not verificar_login():

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Acesso negado. Faça login como administrador."
        }), 401


    dados = request.get_json()


    print(
        "Dados recebidos:",
        dados,
        flush=True
    )


    if not dados:

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Nenhum dado foi recebido."
        }), 400


    nome = dados.get("nome")
    cpf = dados.get("cpf")
    senha = dados.get("senha")


    if not nome or not cpf or not senha:

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Preencha todos os campos."
        }), 400


    conexao = None
    cursor = None


    try:

        conexao = conectar_banco()

        cursor = conexao.cursor()


        sql = """
            INSERT INTO usuario_adm
            (
                NOME,
                CPF,
                Senha
            )
            VALUES
            (
                %s,
                %s,
                %s
            )
        """


        valores = (
            nome,
            cpf,
            senha
        )


        cursor.execute(
            sql,
            valores
        )


        conexao.commit()


        print(
            "Gestão cadastrada com sucesso!",
            flush=True
        )


        return jsonify({

            "sucesso": True,

            "mensagem":
                "Gestão cadastrada com sucesso!"

        }), 201


    except mysql.connector.Error as erro:

        print(
            "ERRO DO MYSQL:",
            erro,
            flush=True
        )


        if conexao:
            conexao.rollback()


        return jsonify({

            "sucesso": False,

            "mensagem":
                "Erro no banco de dados: "
                + str(erro)

        }), 500


    except Exception as erro:

        print(
            "ERRO:",
            erro,
            flush=True
        )


        if conexao:
            conexao.rollback()


        return jsonify({

            "sucesso": False,

            "mensagem":
                "Erro interno: "
                + str(erro)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if conexao:
            conexao.close()


# ==========================================================
# CADASTRO DE LIVROS
# ==========================================================

@app.route("/cad_livros", methods=["POST"])
def cadastrar_livro():

    # Somente ADM logado
    if not verificar_login():

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Acesso negado. Faça login como administrador."
        }), 401


    dados = request.get_json()


    print(
        "Dados do livro recebidos:",
        dados,
        flush=True
    )


    if not dados:

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Nenhum dado foi recebido."
        }), 400


    titulo = dados.get("titulo")
    autor = dados.get("autor")
    editora = dados.get("editora")
    isbn = dados.get("isbn")
    genero = dados.get("genero")
    ano = dados.get("ano")
    quantidade = dados.get("quantidade")


    if (
        not titulo
        or not autor
        or not genero
        or not ano
        or not quantidade
    ):

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Preencha todos os campos obrigatórios."
        }), 400


    try:

        ano = int(ano)

        quantidade = int(quantidade)

    except (ValueError, TypeError):

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Ano e quantidade devem ser números."
        }), 400


    if quantidade < 1:

        return jsonify({
            "sucesso": False,
            "mensagem":
                "A quantidade deve ser pelo menos 1."
        }), 400


    conexao = None
    cursor = None


    try:

        conexao = conectar_banco()

        cursor = conexao.cursor()


        sql = """
            INSERT INTO livros
            (
                titulo,
                autor_livro,
                editora,
                isbn,
                Genero,
                ANO,
                Disponivel,
                quantidade
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
        """


        valores = (
            titulo,
            autor,
            editora,
            isbn,
            genero,
            ano,
            "SIM",
            quantidade
        )


        cursor.execute(
            sql,
            valores
        )


        conexao.commit()


        print(
            "Livro cadastrado com sucesso!",
            flush=True
        )


        return jsonify({

            "sucesso": True,

            "mensagem":
                "Livro cadastrado com sucesso!"

        }), 201


    except mysql.connector.Error as erro:

        print(
            "ERRO DO MYSQL:",
            erro,
            flush=True
        )


        if conexao:
            conexao.rollback()


        return jsonify({

            "sucesso": False,

            "mensagem":
                "Erro no banco de dados: "
                + str(erro)

        }), 500


    except Exception as erro:

        print(
            "ERRO INTERNO:",
            erro,
            flush=True
        )


        if conexao:
            conexao.rollback()


        return jsonify({

            "sucesso": False,

            "mensagem":
                "Erro interno: "
                + str(erro)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if conexao:
            conexao.close()


# ==========================================================
# LISTAR / PESQUISAR LIVROS
# PÚBLICO
# ==========================================================

@app.route("/livros", methods=["GET"])
def listar_livros():

    conexao = None
    cursor = None


    try:

        busca = request.args.get(
            "busca",
            ""
        ).strip()


        print(
            "Pesquisa recebida:",
            busca,
            flush=True
        )


        conexao = conectar_banco()


        cursor = conexao.cursor(
            dictionary=True
        )


        if busca == "":

            sql = """
                SELECT
                    id_livro,
                    titulo,
                    autor_livro,
                    editora,
                    isbn,
                    Genero,
                    ANO,
                    Disponivel,
                    quantidade
                FROM livros
                ORDER BY titulo ASC
            """


            cursor.execute(sql)


        else:

            sql = """
                SELECT
                    id_livro,
                    titulo,
                    autor_livro,
                    editora,
                    isbn,
                    Genero,
                    ANO,
                    Disponivel,
                    quantidade
                FROM livros
                WHERE
                    titulo LIKE %s
                    OR autor_livro LIKE %s
                    OR Genero LIKE %s
                ORDER BY titulo ASC
            """


            pesquisa = "%" + busca + "%"


            cursor.execute(
                sql,
                (
                    pesquisa,
                    pesquisa,
                    pesquisa
                )
            )


        livros = cursor.fetchall()


        print(
            "Livros encontrados:",
            len(livros),
            flush=True
        )


        return jsonify({

            "sucesso": True,

            "livros": livros

        }), 200


    except mysql.connector.Error as erro:

        print(
            "ERRO MYSQL:",
            erro,
            flush=True
        )


        return jsonify({

            "sucesso": False,

            "mensagem":
                "Erro ao buscar livros: "
                + str(erro)

        }), 500


    except Exception as erro:

        print(
            "ERRO:",
            erro,
            flush=True
        )


        return jsonify({

            "sucesso": False,

            "mensagem":
                "Erro interno: "
                + str(erro)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if conexao:
            conexao.close()


# ==========================================================
# CADASTRAR EMPRÉSTIMO
# ==========================================================

@app.route("/emprestimos", methods=["POST"])
def cadastrar_emprestimo():

    # Somente ADM logado
    if not verificar_login():

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Acesso negado. Faça login como administrador."
        }), 401


    dados = request.get_json()


    print(
        "Dados do empréstimo recebidos:",
        dados,
        flush=True
    )


    if not dados:

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Nenhum dado foi recebido."
        }), 400


    nome_aluno = dados.get("nome_aluno")
    sala = dados.get("sala")
    ano = dados.get("ano")
    id_livro = dados.get("id_livro")


    if (
        not nome_aluno
        or not sala
        or not ano
        or not id_livro
    ):

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Preencha todos os campos."
        }), 400


    conexao = None
    cursor = None


    try:

        conexao = conectar_banco()


        cursor = conexao.cursor(
            dictionary=True
        )


        # ==================================================
        # VERIFICAR LIVRO
        # ==================================================

        sql_livro = """
            SELECT
                id_livro,
                titulo,
                quantidade
            FROM livros
            WHERE id_livro = %s
            FOR UPDATE
        """


        cursor.execute(
            sql_livro,
            (id_livro,)
        )


        livro = cursor.fetchone()


        if not livro:

            conexao.rollback()

            return jsonify({

                "sucesso": False,

                "mensagem":
                    "Livro não encontrado."

            }), 404


        quantidade = livro["quantidade"]


        # ==================================================
        # VERIFICAR DISPONIBILIDADE
        # ==================================================

        if quantidade <= 0:

            conexao.rollback()

            return jsonify({

                "sucesso": False,

                "mensagem":
                    "Este livro não possui exemplares disponíveis."

            }), 400


        # ==================================================
        # CADASTRAR EMPRÉSTIMO
        # ==================================================

        sql_emprestimo = """
            INSERT INTO emprestimos
            (
                id_livro_FK,
                nome_aluno,
                sala,
                ano,
                data_emprestimo
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                NOW()
            )
        """


        cursor.execute(
            sql_emprestimo,
            (
                id_livro,
                nome_aluno,
                sala,
                ano
            )
        )


        # ==================================================
        # DIMINUIR QUANTIDADE
        # ==================================================

        nova_quantidade = quantidade - 1


        if nova_quantidade == 0:

            disponivel = "NAO"

        else:

            disponivel = "SIM"


        sql_atualizar_livro = """
            UPDATE livros
            SET
                quantidade = %s,
                Disponivel = %s
            WHERE id_livro = %s
        """


        cursor.execute(
            sql_atualizar_livro,
            (
                nova_quantidade,
                disponivel,
                id_livro
            )
        )


        # ==================================================
        # CONFIRMAR
        # ==================================================

        conexao.commit()


        print(
            "Empréstimo registrado com sucesso!",
            flush=True
        )


        return jsonify({

            "sucesso": True,

            "mensagem":
                "Empréstimo registrado com sucesso!"

        }), 201


    except mysql.connector.Error as erro:

        print(
            "ERRO DO MYSQL NO EMPRÉSTIMO:",
            erro,
            flush=True
        )


        if conexao:
            conexao.rollback()


        return jsonify({

            "sucesso": False,

            "mensagem":
                "Erro no banco de dados: "
                + str(erro)

        }), 500


    except Exception as erro:

        print(
            "ERRO NO EMPRÉSTIMO:",
            erro,
            flush=True
        )


        if conexao:
            conexao.rollback()


        return jsonify({

            "sucesso": False,

            "mensagem":
                "Erro interno: "
                + str(erro)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if conexao:
            conexao.close()


# ==========================================================
# LISTAR / PESQUISAR EMPRÉSTIMOS
# SOMENTE ADM
# ==========================================================

@app.route("/emprestimos", methods=["GET"])
def listar_emprestimos():

    # Somente ADM logado
    if not verificar_login():

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Acesso negado. Faça login como administrador."
        }), 401


    conexao = None
    cursor = None


    try:

        busca = request.args.get(
            "busca",
            ""
        ).strip()


        print(
            "Pesquisa de empréstimo:",
            busca,
            flush=True
        )


        conexao = conectar_banco()


        cursor = conexao.cursor(
            dictionary=True
        )


        # ==================================================
        # SEM PESQUISA
        # ==================================================

        if busca == "":

            sql = """
                SELECT
                    e.id_emprestimo,
                    e.nome_aluno,
                    e.sala,
                    e.ano,
                    e.data_emprestimo,
                    e.data_devolucao,
                    l.titulo
                FROM emprestimos e
                INNER JOIN livros l
                    ON e.id_livro_FK = l.id_livro
                WHERE e.data_devolucao IS NULL
                ORDER BY e.data_emprestimo DESC
            """


            cursor.execute(sql)


        # ==================================================
        # COM PESQUISA
        # ==================================================

        else:

            sql = """
                SELECT
                    e.id_emprestimo,
                    e.nome_aluno,
                    e.sala,
                    e.ano,
                    e.data_emprestimo,
                    e.data_devolucao,
                    l.titulo
                FROM emprestimos e
                INNER JOIN livros l
                    ON e.id_livro_FK = l.id_livro
                WHERE
                    e.data_devolucao IS NULL
                    AND (
                        e.nome_aluno LIKE %s
                        OR l.titulo LIKE %s
                    )
                ORDER BY e.data_emprestimo DESC
            """


            pesquisa = "%" + busca + "%"


            cursor.execute(
                sql,
                (
                    pesquisa,
                    pesquisa
                )
            )


        emprestimos = cursor.fetchall()


        # ==================================================
        # FORMATAR DATAS
        # ==================================================

        for emprestimo in emprestimos:

            if emprestimo["data_emprestimo"]:

                emprestimo["data_emprestimo"] = (
                    emprestimo["data_emprestimo"]
                    .strftime("%d/%m/%Y %H:%M")
                )


            if emprestimo["data_devolucao"]:

                emprestimo["data_devolucao"] = (
                    emprestimo["data_devolucao"]
                    .strftime("%d/%m/%Y %H:%M")
                )


        print(
            "Empréstimos encontrados:",
            len(emprestimos),
            flush=True
        )


        return jsonify({

            "sucesso": True,

            "emprestimos":
                emprestimos

        }), 200


    except mysql.connector.Error as erro:

        print(
            "ERRO MYSQL AO BUSCAR EMPRÉSTIMOS:",
            erro,
            flush=True
        )


        return jsonify({

            "sucesso": False,

            "mensagem":
                "Erro ao buscar empréstimos: "
                + str(erro)

        }), 500


    except Exception as erro:

        print(
            "ERRO AO BUSCAR EMPRÉSTIMOS:",
            erro,
            flush=True
        )


        return jsonify({

            "sucesso": False,

            "mensagem":
                "Erro interno: "
                + str(erro)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if conexao:
            conexao.close()


# ==========================================================
# DEVOLVER LIVRO
# SOMENTE ADM
# ==========================================================

@app.route(
    "/emprestimos/<int:id_emprestimo>/devolver",
    methods=["PUT"]
)
def devolver_livro(id_emprestimo):

    # Somente ADM logado
    if not verificar_login():

        return jsonify({
            "sucesso": False,
            "mensagem":
                "Acesso negado. Faça login como administrador."
        }), 401


    conexao = None
    cursor = None


    try:

        conexao = conectar_banco()


        cursor = conexao.cursor(
            dictionary=True
        )


        # ==================================================
        # BUSCAR EMPRÉSTIMO
        # ==================================================

        sql_emprestimo = """
            SELECT
                id_emprestimo,
                id_livro_FK,
                data_devolucao
            FROM emprestimos
            WHERE id_emprestimo = %s
            FOR UPDATE
        """


        cursor.execute(
            sql_emprestimo,
            (id_emprestimo,)
        )


        emprestimo = cursor.fetchone()


        if not emprestimo:

            conexao.rollback()

            return jsonify({

                "sucesso": False,

                "mensagem":
                    "Empréstimo não encontrado."

            }), 404


        # ==================================================
        # VERIFICAR SE JÁ FOI DEVOLVIDO
        # ==================================================

        if emprestimo["data_devolucao"] is not None:

            conexao.rollback()

            return jsonify({

                "sucesso": False,

                "mensagem":
                    "Este livro já foi devolvido."

            }), 400


        id_livro = emprestimo["id_livro_FK"]


        # ==================================================
        # REGISTRAR DEVOLUÇÃO
        # ==================================================

        sql_devolucao = """
            UPDATE emprestimos
            SET
                data_devolucao = NOW()
            WHERE id_emprestimo = %s
        """


        cursor.execute(
            sql_devolucao,
            (id_emprestimo,)
        )


        # ==================================================
        # AUMENTAR QUANTIDADE DO LIVRO
        # ==================================================

        sql_livro = """
            SELECT
                quantidade
            FROM livros
            WHERE id_livro = %s
            FOR UPDATE
        """


        cursor.execute(
            sql_livro,
            (id_livro,)
        )


        livro = cursor.fetchone()


        if not livro:

            conexao.rollback()

            return jsonify({

                "sucesso": False,

                "mensagem":
                    "Livro relacionado ao empréstimo não encontrado."

            }), 404


        nova_quantidade = (
            livro["quantidade"] + 1
        )


        sql_atualizar_livro = """
            UPDATE livros
            SET
                quantidade = %s,
                Disponivel = 'SIM'
            WHERE id_livro = %s
        """


        cursor.execute(
            sql_atualizar_livro,
            (
                nova_quantidade,
                id_livro
            )
        )


        # ==================================================
        # CONFIRMAR
        # ==================================================

        conexao.commit()


        print(
            "Livro devolvido com sucesso!",
            flush=True
        )


        return jsonify({

            "sucesso": True,

            "mensagem":
                "Livro devolvido com sucesso!"

        }), 200


    except mysql.connector.Error as erro:

        print(
            "ERRO MYSQL NA DEVOLUÇÃO:",
            erro,
            flush=True
        )


        if conexao:
            conexao.rollback()


        return jsonify({

            "sucesso": False,

            "mensagem":
                "Erro no banco de dados: "
                + str(erro)

        }), 500


    except Exception as erro:

        print(
            "ERRO NA DEVOLUÇÃO:",
            erro,
            flush=True
        )


        if conexao:
            conexao.rollback()


        return jsonify({

            "sucesso": False,

            "mensagem":
                "Erro interno: "
                + str(erro)

        }), 500


    finally:

        if cursor:
            cursor.close()

        if conexao:
            conexao.close()


# ==========================================================
# INICIAR SERVIDOR
# ==========================================================

if __name__ == "__main__":

    print(
        "=========================================="
    )

    print(
        "       SERVIDOR LEARNING INICIANDO"
    )

    print(
        "=========================================="
    )


    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )