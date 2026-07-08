CREATE DATABASE  IF NOT EXISTS `evse` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `evse`;

--
-- criando estrutura da tabela `conta_energia`
--

--
-- criando estrutura da tabela `users`
--

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `forgot_token` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- inserindo dados na tabela `users`
--

LOCK TABLES `users` WRITE;

INSERT INTO `users` VALUES (1,'zezinho','zezinho@sdde.com','$2y$10$1hpQQum9dhlkdPF4vjPWUeB3x7au2djteoUJiY3vZNTSrSgerUASq',NULL,'2023-04-14 07:51:58','2023-04-19 10:09:27',NULL);

UNLOCK TABLES;


DROP TABLE IF EXISTS `conta_energia`;

CREATE TABLE `conta_energia` (
  `id_conta_energia` int NOT NULL AUTO_INCREMENT COMMENT 'PK da conta de energia',
  `dataVencimento` date NOT NULL COMMENT 'data de vencimento da conta de energia',
  `valor` float NOT NULL COMMENT 'valor da conta de energia',
  `kw` int NOT NULL COMMENT 'kw total consumido no mês informado pelo usuario',
  `usuario_id_usuario` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_conta_energia`,`usuario_id_usuario`),
  UNIQUE KEY `dataVencimento_UNIQUE` (`dataVencimento`),
  KEY `fk_conta_energia_usuario_idx` (`usuario_id_usuario`),
  CONSTRAINT `fk_conta_energia_usuario` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- inserindo dados na tabela `conta_energia`
--

LOCK TABLES `conta_energia` WRITE;

INSERT INTO `conta_energia` 
VALUES 
  (1,'2022-01-30',453.86,388,1,NULL,NULL)
  ,(2,'2022-02-28',448.7,407,1,NULL,NULL)
  ,(3,'2022-03-30',505.28,404,1,NULL,NULL)
  ,(4,'2022-04-30',332.51,251,1,NULL,NULL)
  ,(5,'2022-05-30',312.39,292,1,NULL,NULL)
  ,(6,'2022-06-30',296.19,282,1,NULL,NULL)
  ,(7,'2022-07-30',286.08,283,1,NULL,NULL)
  ,(8,'2022-08-30',279.71,296,1,NULL,NULL)
  ,(9,'2022-09-30',167.32,159,1,NULL,NULL)
  ,(10,'2022-10-30',223.27,225,1,NULL,NULL)
  ,(11,'2022-11-30',311.7,330,1,NULL,NULL)
  ,(12,'2022-12-30',336.71,362,1,NULL,NULL);

UNLOCK TABLES;

--
-- criando estrutura da tabela `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;

CREATE TABLE `password_resets` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`),
  KEY `password_resets_token_index` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- inserindo dados na tabela `password_resets`
--

LOCK TABLES `password_resets` WRITE;
UNLOCK TABLES;


--
-- criando estrutura da tabela `tipo_produto`
--

DROP TABLE IF EXISTS `tipo_produto`;

CREATE TABLE `tipo_produto` (
  `id_tipo_produto` int NOT NULL COMMENT 'pk do tipo produto',
  `nome` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Armazena o tipo de produto, ex.: se é um fio, inversor, placa solar etc',
  PRIMARY KEY (`id_tipo_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- inserindo dados na tabela `tipo_produto`
--

LOCK TABLES `tipo_produto` WRITE;

INSERT INTO `tipo_produto` 
  VALUES (1,'placa solar')
  ,(2,'inversor')
  ,(3,'cabo eletrico');

UNLOCK TABLES;

--
-- criando estrutura da tabela `produto`
--

DROP TABLE IF EXISTS `produto`;

CREATE TABLE `produto` (
  `id_produto` int unsigned NOT NULL COMMENT 'pk do produto',
  `nome` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'nome produto ex.: fio 6mm, placa solar 470w',
  `descricao` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'descrição do produto ex.: preço do metro do fio 6mm, 1 modulo de placa solar 470w com 22% de efiencia e 25 anos de garantia.',
  `preco` float NOT NULL COMMENT 'preco do produto',
  `tipo_produto_id_tipo_produto` int NOT NULL COMMENT 'codigo que informa qual o tipo do produto, se é uma placa solar, inversor, fio etc.',
  `potencia` int unsigned DEFAULT NULL COMMENT 'potencia do produto caso tenha',
  PRIMARY KEY (`id_produto`,`tipo_produto_id_tipo_produto`),
  KEY `fk_produto_tipo_produto1_idx` (`tipo_produto_id_tipo_produto`),
  CONSTRAINT `fk_produto_tipo_produto1` FOREIGN KEY (`tipo_produto_id_tipo_produto`) REFERENCES `tipo_produto` (`id_tipo_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- inserindo dados na tabela `produto`
--

LOCK TABLES `produto` WRITE;

INSERT INTO `produto` 
VALUES 
  (1,'placa solar 550w',NULL,1399.65,1,550),
  (2,'placa solar 470w',NULL,1180.47,1,470),
  (3,'inversor 3000w',NULL,3000,2,3000),
  (4,'cabo eletrico 6 mm - 1 metro','6mm',10,3,NULL),
  (5,'cabo eletrico 5 mm - 1 metro','5mm',9,3,NULL),
  (6,'cabo eletrico 4 mm - 1 metro','4mm',8,3,NULL),
  (7,'inversor 5000w',NULL,5000,2,5000);

UNLOCK TABLES;

--
-- criando estrutura da tabela `usuario_carrinho_produto`
--

DROP TABLE IF EXISTS `usuario_carrinho_produto`;

CREATE TABLE `usuario_carrinho_produto` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT 'pk da tabela',
  `usuario_id_usuario` int unsigned NOT NULL COMMENT 'fk codigo do usuario/cliente que comprou o produto',
  `produto_id_produto` int unsigned NOT NULL COMMENT 'fk codigo do produto que foi comprado',
  `quantidade` int NOT NULL COMMENT 'numero de produtos comprados. ex.: 7 placa solares, 10 metros fio 6mm etc.',
  `valorTotalProduto` float NOT NULL COMMENT 'valor total do produto não considerando o valor da mão de obra. formula quantidade *  preço no momento da compra',
  `valorMaoDeObra` float NOT NULL COMMENT 'Valor da mao de obra cobrada pelo profissional que ira instalar o produto\n',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE_usuario_carrinho_produto` (`usuario_id_usuario`,`produto_id_produto`),
  KEY `fk_usuario_x_produto_produto1_idx` (`produto_id_produto`) /*!80000 INVISIBLE */,
  KEY `fk_usuario_x_produto_usuario1_idx` (`usuario_id_usuario`),
  CONSTRAINT `fk_usuario_x_produto_produto1` FOREIGN KEY (`produto_id_produto`) REFERENCES `produto` (`id_produto`),
  CONSTRAINT `fk_usuario_x_produto_usuario1` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- inserindo dados na tabela `usuario_carrinho_produto`
--

LOCK TABLES `usuario_carrinho_produto` WRITE;

INSERT INTO `usuario_carrinho_produto` 
VALUES 
  (1,1,1,6,8397.9,300,'2023-04-15 15:48:23','2023-04-15 15:48:23')
  ,(2,1,3,1,3000,1000,'2023-04-16 14:20:19','2023-04-16 14:20:19')
  ,(3,1,4,50,500,50,'2023-04-19 11:06:20','2023-04-19 11:06:20');

UNLOCK TABLES;
