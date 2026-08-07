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
@app.route('/cad_alunos', methods=['POST'])
def cadastrar_aluno():

    dados = request.get_json()

    nome = dados.get("nome")
    ra = dados.get("ra")
    telefone = dados.get("telefone")


    if not nome or not ra or not telefone:
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
            INSERT INTO usuarios (nome, ra, telefone)
            VALUES (%s, %s, %s)
            """,
            (nome, ra, telefone)
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

