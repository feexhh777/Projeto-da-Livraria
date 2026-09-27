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
  `data_emprestimo` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_devolucao` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_emprestimo`),
  KEY `FK_emprestimos_livro` (`id_livro_FK`),
  CONSTRAINT `FK_emprestimos_livro` FOREIGN KEY (`id_livro_FK`) REFERENCES `livros` (`id_livro`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela biblioteca.emprestimos: ~0 rows (aproximadamente)

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela biblioteca.livros: ~7 rows (aproximadamente)
INSERT IGNORE INTO `livros` (`id_livro`, `titulo`, `autor_livro`, `editora`, `isbn`, `Genero`, `ANO`, `Disponivel`, `quantidade`) VALUES
	(1, '1984', 'george orwell', 'pandora', '123123123', 'realidade', 1949, 'SIM', 7),
	(2, '1984', 'george orwell', 'pantora', '123456789101', 'realidade', 1949, 'SIM', 7),
	(3, 'Fantastic Mr. Fox', 'Roald Dahl', 'Puffin', '9780140328721', 'Animals, Hunger, Open Library Staff Picks', 1988, 'SIM', 1),
	(4, 'Fantastic Mr. Fox', 'Roald Dahl', 'Puffin', '9780140328721', 'Animals, Hunger, Open Library Staff Picks', 1988, 'SIM', 1),
	(5, 'Fantastic Mr. Fox', 'Roald Dahl', 'Puffin', '9780140328721', 'Animals, Hunger, Open Library Staff Picks', 1988, 'SIM', 8),
	(6, 'The Hunger Games', 'Suzanne Collins', 'Scholastic Press', '9780439023481', 'severe poverty, starvation, oppression', 2008, 'SIM', 1),
	(7, 'Nineteen Eighty-Four', 'George Orwell', 'pandora', '9788535914849', 'distopia', 1949, 'SIM', 1);

-- Copiando estrutura para tabela biblioteca.usuario_adm
CREATE TABLE IF NOT EXISTS `usuario_adm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `NOME` varchar(100) NOT NULL,
  `CPF` varchar(14) NOT NULL DEFAULT '000.000.000-00',
  `Senha` varchar(20) NOT NULL,
  `data_cadastro` date DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela biblioteca.usuario_adm: ~0 rows (aproximadamente)
INSERT IGNORE INTO `usuario_adm` (`id`, `NOME`, `CPF`, `Senha`, `data_cadastro`) VALUES
	(1, 'admin', '12312312312', 'traira24', '2026-09-12');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
