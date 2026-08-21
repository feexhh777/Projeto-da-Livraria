-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           12.2.2-MariaDB - MariaDB Server
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.14.0.7165
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

-- Copiando estrutura para tabela biblioteca.livros
CREATE TABLE IF NOT EXISTS `livros` (
  `id_livro` int(11) NOT NULL AUTO_INCREMENT,
  `autor_livro` varchar(100) NOT NULL,
  `Genero` varchar(50) NOT NULL,
  `ANO` int(11) DEFAULT NULL,
  `Disponivel` char(3) DEFAULT NULL,
  PRIMARY KEY (`id_livro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela biblioteca.livros: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela biblioteca.registros
CREATE TABLE IF NOT EXISTS `registros` (
  `id_registro` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario_FK` int(11) NOT NULL,
  `id_livro_FK` int(11) NOT NULL,
  `cargo` varchar(50) NOT NULL,
  `data_emprestimo` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id_registro`),
  KEY `id_usuario_FK` (`id_usuario_FK`),
  KEY `id_livro_FK` (`id_livro_FK`),
  CONSTRAINT `FK_registros_usuario_adm` FOREIGN KEY (`id_usuario_FK`) REFERENCES `usuario_adm` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_livro` FOREIGN KEY (`id_livro_FK`) REFERENCES `livros` (`id_livro`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela biblioteca.registros: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela biblioteca.usuario_adm
CREATE TABLE IF NOT EXISTS `usuario_adm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `NOME` varchar(100) NOT NULL,
  `CPF` varchar(20) NOT NULL,
  `Senha` varchar(20) NOT NULL,
  `data_cadastro` date DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Copiando dados para a tabela biblioteca.usuario_adm: ~5 rows (aproximadamente)
INSERT INTO `usuario_adm` (`id`, `NOME`, `CPF`, `Senha`, `data_cadastro`) VALUES
	(1, 'victor', '72471585', 'Escola@2025', '0000-00-00'),
	(2, 'victor', '72471585', 'Escola@2025', '2026-08-11'),
	(3, 'victor', '72471585', 'hthtvdrdrghg', '0000-00-00'),
	(4, 'victor', '72471585', 'traira24', '2026-08-18'),
	(5, 'victor', '27303938746589', 't3tfc qy', '2026-08-18');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
