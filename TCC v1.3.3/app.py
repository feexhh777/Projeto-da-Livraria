from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)


# Conexão com banco
def conectar_banco():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="lea",
        database="biblioteca"
    )


# Cadastro de alunos
@app.route('/cad_gestao', methods=['POST'])
def cadastrar_gestao():

    dados = request.get_json()

    nome = dados.get("nome")
    cpf = dados.get("cpf")
    senha = dados.get("senha")


    if not nome or not cpf or not senha:
        return jsonify({
            "sucesso": False,
            "mensagem": "Preencha todos os campos."
        }), 400


    conexao = None
    cursor = None


    try:

        conexao = conectar_banco()
        cursor = conexao.cursor()


        cursor.execute(
            """
            INSERT INTO usuario_adm  (nome, cpf, senha)
            VALUES (%s, %s, %s)
            """,
            (nome, cpf, senha)
        )


        conexao.commit()


        return jsonify({
            "sucesso": True,
            "mensagem": "Aluno cadastrado com sucesso!"
        }), 201

# esse except me explique ta dando erro aqui gpt
    except mysql.connector.Error as erro:

        print("Erro no banco:", erro)

        return jsonify({
            "sucesso": False,
            "mensagem": "Erro ao cadastrar aluno."
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conexao:
            conexao.close()



# Iniciar servidor
if __name__ == "__main__":
    app.run(
        host="localhost",
        port=5000,
        debug=True
    )

