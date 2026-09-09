-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           12.3.2-MariaDB - MariaDB Server
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.17.0.7270
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para biblioteca
CREATE DATABASE IF NOT EXISTS `biblioteca` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `biblioteca`;

-- Copiando estrutura para tabela biblioteca.emprestimos
CREATE TABLE IF NOT EXISTS `emprestimos` (
  `id_emprestimo` int(11) NOT NULL AUTO_INCREMENT,
  `id_livro_FK` int(11) NOT NULL,
  `nome_aluno` varchar(100) NOT NULL,
  `sala` varchar(20) NOT NULL,
  `ano` varchar(20) NOT NULL,
  `data_emprestimo` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_devolucao` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_emprestimo`),
  KEY `FK_emprestimos_livro` (`id_livro_FK`),
  CONSTRAINT `FK_emprestimos_livro` FOREIGN KEY (`id_livro_FK`) REFERENCES `livros` (`id_livro`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela biblioteca.emprestimos: ~4 rows (aproximadamente)
INSERT INTO `emprestimos` (`id_emprestimo`, `id_livro_FK`, `nome_aluno`, `sala`, `ano`, `data_emprestimo`, `data_devolucao`) VALUES
	(1, 1, 'victor', '3b', '3', '2026-08-22 02:59:35', '2026-08-22 13:51:59'),
	(2, 2, 'victor', '3b', '3', '2026-08-22 13:52:19', NULL),
	(3, 2, 'abreu', '7c', '7', '2026-08-24 20:27:20', NULL),
	(4, 4, 'victor', '3b', '3', '2026-08-29 00:30:09', NULL);

-- Copiando estrutura para tabela biblioteca.livros
CREATE TABLE IF NOT EXISTS `livros` (
  `id_livro` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `autor_livro` varchar(100) NOT NULL,
  `editora` varchar(100) DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `Genero` varchar(50) NOT NULL,
  `ANO` int(11) DEFAULT NULL,
  `Disponivel` char(3) DEFAULT NULL,
  `quantidade` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_livro`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela biblioteca.livros: ~5 rows (aproximadamente)
INSERT INTO `livros` (`id_livro`, `titulo`, `autor_livro`, `editora`, `isbn`, `Genero`, `ANO`, `Disponivel`, `quantidade`) VALUES
	(1, '1984', 'george orwell', 'pandora', '123123123', 'realidade', 1949, 'SIM', 7),
	(2, '1984', 'george orwell', 'pantora', '123456789101', 'realidade', 1949, 'SIM', 5),
	(3, 'Fantastic Mr. Fox', 'Roald Dahl', 'Puffin', '9780140328721', 'Animals, Hunger, Open Library Staff Picks', 1988, 'SIM', 1),
	(4, 'Fantastic Mr. Fox', 'Roald Dahl', 'Puffin', '9780140328721', 'Animals, Hunger, Open Library Staff Picks', 1988, 'NAO', 0),
	(5, 'Fantastic Mr. Fox', 'Roald Dahl', 'Puffin', '9780140328721', 'Animals, Hunger, Open Library Staff Picks', 1988, 'SIM', 8);

-- Copiando estrutura para tabela biblioteca.usuario_adm
CREATE TABLE IF NOT EXISTS `usuario_adm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `NOME` varchar(100) NOT NULL,
  `CPF` varchar(20) NOT NULL,
  `Senha` varchar(20) NOT NULL,
  `data_cadastro` date DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela biblioteca.usuario_adm: ~9 rows (aproximadamente)
INSERT INTO `usuario_adm` (`id`, `NOME`, `CPF`, `Senha`, `data_cadastro`) VALUES
	(1, 'victor', '72471585', 'Escola@2025', '0000-00-00'),
	(2, 'victor', '72471585', 'Escola@2025', '2026-08-11'),
	(3, 'victor', '72471585', 'hthtvdrdrghg', '0000-00-00'),
	(4, 'victor', '72471585', 'traira24', '2026-08-18'),
	(5, 'victor', '27303938746589', 't3tfc qy', '2026-08-18'),
	(6, 'ivony', '183642467829', 'bhjm bj', '2026-08-21'),
	(7, 'ivony', '183642467829', 'bnjmnu', '2026-08-21'),
	(8, 'ivony', '183642467829', 'yhnbvfhn', '2026-08-21'),
	(9, 'ivony', '183642467829', 'viado', '2026-08-21'),
	(10, 'victor', '123123123', 'traira24', '2026-08-22');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
