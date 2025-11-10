CREATE DATABASE springFut;
USE springFut;


CREATE TABLE Pessoa (
    idPessoa INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefoneDDD VARCHAR(5),
    telefoneNumero VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255) NOT NULL
);


CREATE TABLE Jogador (
    idJogador INT AUTO_INCREMENT PRIMARY KEY,
    idPessoa INT NOT NULL,
    posicaoPreferida VARCHAR(50),
    FOREIGN KEY (idPessoa) REFERENCES Pessoa(idPessoa)
    ON UPDATE CASCADE

);

-- Atributo multivalorado 
CREATE TABLE JogadorApelido (
    idApelido INT AUTO_INCREMENT PRIMARY KEY,
    idJogador INT NOT NULL,
    apelido VARCHAR(50) NOT NULL,
    FOREIGN KEY (idJogador) REFERENCES Jogador(idJogador)
);


CREATE TABLE Organizador (
    idOrganizador INT AUTO_INCREMENT PRIMARY KEY,
    idPessoa INT NOT NULL,
    cargo VARCHAR(50),
    idOrganizadorDelegado INT NULL,
    FOREIGN KEY (idPessoa) REFERENCES Pessoa(idPessoa)
    ON UPDATE CASCADE,
    FOREIGN KEY (idOrganizadorDelegado) REFERENCES Organizador(idOrganizador)
    ON DELETE SET NULL

);


CREATE TABLE Endereco (
    idEndereco INT AUTO_INCREMENT PRIMARY KEY,
    rua VARCHAR(100),
    numero VARCHAR(10),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    campo VARCHAR(50)
);


CREATE TABLE Pelada (
    idPelada INT AUTO_INCREMENT PRIMARY KEY,
    diaSemana VARCHAR(15),
    horario TIME,
    valorTotal DECIMAL(10,2),
    limiteMensalistas INT,
    tempoConfMensalista INT,
    tempoConfDiarista INT,
    idEndereco INT NULL,
    FOREIGN KEY (idEndereco) REFERENCES Endereco(idEndereco)
    ON DELETE SET NULL
);


CREATE TABLE VinculoJogadorPelada (
    idVinculo INT AUTO_INCREMENT PRIMARY KEY,
    idJogador INT NOT NULL,
    idPelada INT NOT NULL,
    estrelas INT CHECK (estrelas BETWEEN 1 AND 5),
    tipoParticipacao ENUM('Mensalista','Diarista','Fila') NOT NULL,
    papelNaPelada ENUM('Jogador','Organizador') NOT NULL,
    FOREIGN KEY (idJogador) REFERENCES Jogador(idJogador),
    FOREIGN KEY (idPelada) REFERENCES Pelada(idPelada)
);


CREATE TABLE Rodada (
    idRodada INT AUTO_INCREMENT PRIMARY KEY,
    idPelada INT NOT NULL,
    data DATE NOT NULL,
    FOREIGN KEY (idPelada) REFERENCES Pelada(idPelada)
);


CREATE TABLE Inscricao (
    idInscricao INT AUTO_INCREMENT PRIMARY KEY,
    idJogador INT NOT NULL,
    idRodada INT NOT NULL,
    statusConfirmacao ENUM('Confirmado','Ausente','Pendente'),
    dataResposta DATE,
    FOREIGN KEY (idJogador) REFERENCES Jogador(idJogador),
    FOREIGN KEY (idRodada) REFERENCES Rodada(idRodada)
);


CREATE TABLE Partida (
    idPartida INT AUTO_INCREMENT PRIMARY KEY,
    idRodada INT NOT NULL,
    placarTimeA INT DEFAULT 0,
    placarTimeB INT DEFAULT 0,
    FOREIGN KEY (idRodada) REFERENCES Rodada(idRodada)
);


CREATE TABLE Time (
    idTime INT AUTO_INCREMENT PRIMARY KEY,
    idRodada INT NOT NULL,
    cor VARCHAR(20),
    FOREIGN KEY (idRodada) REFERENCES Rodada(idRodada)
);


CREATE TABLE Pagamento (
    idPagamento INT AUTO_INCREMENT PRIMARY KEY,
    idJogador INT NOT NULL,
    idRodada INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    forma ENUM('PIX','Dinheiro','Cartao'),
    status ENUM('Pago','Pendente','Atrasado'),
    data DATE,
    FOREIGN KEY (idJogador) REFERENCES Jogador(idJogador),
    FOREIGN KEY (idRodada) REFERENCES Rodada(idRodada)
);


CREATE TABLE Estatisticas (
    idEst INT AUTO_INCREMENT PRIMARY KEY,
    idJogador INT NOT NULL,
    idPartida INT NOT NULL,
    gols INT DEFAULT 0,
    assistencias INT DEFAULT 0,
    participacoes INT DEFAULT 0,
    FOREIGN KEY (idJogador) REFERENCES Jogador(idJogador),
    FOREIGN KEY (idPartida) REFERENCES Partida(idPartida)
);


USE springFut; 

INSERT INTO Pessoa (nome, telefoneDDD, telefoneNumero, email, senha) VALUES
('Carlos Silva', '11', '912345678', 'carlos.silva@example.com', 'senha123'),
('João Pereira', '21', '998765432', 'joao.pereira@example.com', 'senha123'),
('Maria Souza', '31', '987654321', 'maria.souza@example.com', 'senha123'),
('Ana Oliveira', '41', '976543210', 'ana.oliveira@example.com', 'senha123'),
('Pedro Santos', '51', '965432109', 'pedro.santos@example.com', 'senha123'),
('Lucas Almeida', '61', '954321098', 'lucas.almeida@example.com', 'senha123'),
('Juliana Costa', '71', '943210987', 'juliana.costa@example.com', 'senha123'),
('Fernanda Lima', '81', '932109876', 'fernanda.lima@example.com', 'senha123'),
('Rodrigo Rocha', '91', '921098765', 'rodrigo.rocha@example.com', 'senha123'),
('Paula Martins', '85', '910987654', 'paula.martins@example.com', 'senha123'),
('Gabriel Fernandes', '62', '900876543', 'gabriel.fernandes@example.com', 'senha123'),
('Camila Ribeiro', '12', '989876543', 'camila.ribeiro@example.com', 'senha123'),
('Marcos Azevedo', '32', '978965432', 'marcos.azevedo@example.com', 'senha123'),
('Beatriz Gomes', '19', '967854321', 'beatriz.gomes@example.com', 'senha123'),
('Felipe Castro', '27', '956743210', 'felipe.castro@example.com', 'senha123'),
('Larissa Cardoso', '48', '945632109', 'larissa.cardoso@example.com', 'senha123'),
('Rafael Moreira', '34', '934521098', 'rafael.moreira@example.com', 'senha123'),
('Patrícia Melo', '44', '923410987', 'patricia.melo@example.com', 'senha123'),
('Thiago Nunes', '14', '912309876', 'thiago.nunes@example.com', 'senha123'),
('Carolina Duarte', '67', '901298765', 'carolina.duarte@example.com', 'senha123'),
('André Pinto', '16', '989187654', 'andre.pinto@example.com', 'senha123'),
('Vanessa Barros', '22', '978076543', 'vanessa.barros@example.com', 'senha123'),
('Eduardo Teixeira', '33', '967965432', 'eduardo.teixeira@example.com', 'senha123'),
('Tatiane Freitas', '28', '956854321', 'tatiane.freitas@example.com', 'senha123'),
('Leonardo Farias', '35', '945743210', 'leonardo.farias@example.com', 'senha123'),
('Isabela Moraes', '45', '934632109', 'isabela.moraes@example.com', 'senha123'),
('Gustavo Cunha', '55', '923521098', 'gustavo.cunha@example.com', 'senha123'),
('Sofia Rezende', '65', '912410987', 'sofia.rezende@example.com', 'senha123'),
('Daniel Carvalho', '75', '901309876', 'daniel.carvalho@example.com', 'senha123'),
('Bruna Monteiro', '85', '990298765', 'bruna.monteiro@example.com', 'senha123');

INSERT INTO Jogador (idPessoa, posicaoPreferida) VALUES
(1, 'Goleiro'),
(2, 'Zagueiro'),
(3, 'Atacante'),
(4, 'Meia'),
(5, 'Lateral Direito'),
(6, 'Lateral Esquerdo'),
(7, 'Atacante'),
(8, 'Meia'),
(9, 'Zagueiro'),
(10, 'Atacante'),
(11, 'Meia'),
(12, 'Goleiro'),
(13, 'Zagueiro'),
(14, 'Atacante'),
(15, 'Meia'),
(16, 'Lateral Direito'),
(17, 'Lateral Esquerdo'),
(18, 'Atacante'),
(19, 'Meia'),
(20, 'Zagueiro'),
(21, 'Atacante'),
(22, 'Meia'),
(23, 'Goleiro'),
(24, 'Zagueiro'),
(25, 'Lateral Direito'),
(26, 'Lateral Esquerdo'),
(27, 'Meia'),
(28, 'Atacante'),
(29, 'Zagueiro'),
(30, 'Meia');


INSERT INTO JogadorApelido (idJogador, apelido) VALUES
(1, 'Carlão'),
(2, 'JP'),
(3, 'MariaGol'),
(4, 'Aninha'),
(5, 'Pedrão'),
(6, 'Lu'),
(7, 'Juju'),
(8, 'Fer'),
(9, 'Digo'),
(10, 'Paulinha'),
(11, 'Gabi'),
(12, 'Cami'),
(13, 'Marcão'),
(14, 'Bia'),
(15, 'Lipe'),
(16, 'Lari'),
(17, 'Rafa'),
(18, 'Paty'),
(19, 'Thi'),
(20, 'Carol'),
(21, 'Dé'),
(22, 'Nessa'),
(23, 'Dudu'),
(24, 'Tati'),
(25, 'Leo'),
(26, 'Isa'),
(27, 'Guga'),
(28, 'Sofi'),
(29, 'Dan'),
(30, 'Bru');

INSERT INTO Organizador (idPessoa, cargo, idOrganizadorDelegado) VALUES
(1,  'Administrador', NULL),
(2,  'Auxiliar', 1),
(3,  'Auxiliar', 1),
(4,  'Administrador', NULL),
(5,  'Auxiliar', 4),
(6,  'Auxiliar', 4),
(7,  'Administrador', NULL),
(8,  'Auxiliar', 7),
(9,  'Auxiliar', 7),
(10, 'Administrador', NULL),
(11, 'Auxiliar', 10),
(12, 'Auxiliar', 10),
(13, 'Administrador', NULL),
(14, 'Auxiliar', 13),
(15, 'Auxiliar', 13),
(16, 'Administrador', NULL),
(17, 'Auxiliar', 16),
(18, 'Auxiliar', 16),
(19, 'Administrador', NULL),
(20, 'Auxiliar', 19),
(21, 'Auxiliar', 19),
(22, 'Administrador', NULL),
(23, 'Auxiliar', 22),
(24, 'Auxiliar', 22),
(25, 'Administrador', NULL),
(26, 'Auxiliar', 25),
(27, 'Auxiliar', 25),
(28, 'Administrador', NULL),
(29, 'Auxiliar', 28),
(30, 'Auxiliar', 28);



INSERT INTO Endereco (rua, numero, bairro, cidade, campo) VALUES
('Rua das Palmeiras', '101', 'Centro', 'São Paulo', 'Campo A'),
('Av. Brasil', '202', 'Jardins', 'Rio de Janeiro', 'Campo B'),
('Rua Goiás', '303', 'Savassi', 'Belo Horizonte', 'Campo C'),
('Rua da Paz', '404', 'Boa Vista', 'Curitiba', 'Campo D'),
('Av. Independência', '505', 'Moinhos', 'Porto Alegre', 'Campo E'),
('Rua Amazonas', '606', 'Adrianópolis', 'Manaus', 'Campo F'),
('Rua Ceará', '707', 'Asa Sul', 'Brasília', 'Campo G'),
('Av. Paulista', '808', 'Paulista', 'São Paulo', 'Campo H'),
('Rua XV de Novembro', '909', 'Centro', 'Curitiba', 'Campo I'),
('Rua Pernambuco', '111', 'Funcionários', 'Belo Horizonte', 'Campo J'),
('Rua do Comércio', '222', 'Comercial', 'Salvador', 'Campo K'),
('Av. Atlântica', '333', 'Copacabana', 'Rio de Janeiro', 'Campo L'),
('Rua Sergipe', '444', 'Savassi', 'Belo Horizonte', 'Campo M'),
('Rua Maranhão', '555', 'Jardins', 'São Paulo', 'Campo N'),
('Rua João Pessoa', '666', 'Centro', 'Porto Alegre', 'Campo O'),
('Rua Pará', '777', 'Boa Viagem', 'Recife', 'Campo P'),
('Av. Sete de Setembro', '888', 'Centro', 'Curitiba', 'Campo Q'),
('Rua Bahia', '999', 'Jardim América', 'Goiânia', 'Campo R'),
('Rua Santos Dumont', '121', 'Centro', 'Fortaleza', 'Campo S'),
('Av. Beira Mar', '131', 'Meireles', 'Fortaleza', 'Campo T'),
('Rua Paraná', '141', 'Batel', 'Curitiba', 'Campo U'),
('Av. das Torres', '151', 'Jardim das Américas', 'Manaus', 'Campo V'),
('Rua Dom Pedro II', '161', 'Centro', 'Natal', 'Campo W'),
('Rua General Osório', '171', 'Centro', 'Cuiabá', 'Campo X'),
('Av. Fernando Corrêa', '181', 'Coxipó', 'Cuiabá', 'Campo Y'),
('Rua Coronel Fabriciano', '191', 'Centro', 'Uberlândia', 'Campo Z'),
('Rua do Sol', '201', 'Boa Vista', 'Recife', 'Campo AA'),
('Av. Getúlio Vargas', '211', 'Savassi', 'Belo Horizonte', 'Campo AB'),
('Rua Floriano Peixoto', '221', 'Centro', 'Aracaju', 'Campo AC'),
('Rua das Acácias', '231', 'Vila Mariana', 'São Paulo', 'Campo AD');




INSERT INTO Pelada (diaSemana, horario, valorTotal, limiteMensalistas, tempoConfMensalista, tempoConfDiarista, idEndereco) VALUES
('Segunda', '19:00:00', 300.00, 20, 24, 12, 1),
('Terça', '20:00:00', 250.00, 18, 24, 12, 2),
('Quarta', '21:00:00', 280.00, 20, 24, 12, 3),
('Quinta', '19:30:00', 320.00, 22, 24, 12, 4),
('Sexta', '20:30:00', 350.00, 20, 24, 12, 5),
('Sábado', '10:00:00', 400.00, 24, 24, 12, 6),
('Domingo', '09:00:00', 380.00, 20, 24, 12, 7),
('Segunda', '19:15:00', 310.00, 20, 24, 12, 8),
('Terça', '20:15:00', 270.00, 18, 24, 12, 9),
('Quarta', '21:15:00', 260.00, 20, 24, 12, 10),
('Quinta', '19:45:00', 290.00, 22, 24, 12, 11),
('Sexta', '20:45:00', 330.00, 20, 24, 12, 12),
('Sábado', '11:00:00', 420.00, 24, 24, 12, 13),
('Domingo', '08:30:00', 370.00, 20, 24, 12, 14),
('Segunda', '19:00:00', 295.00, 20, 24, 12, 15),
('Terça', '20:00:00', 310.00, 18, 24, 12, 16),
('Quarta', '21:00:00', 285.00, 20, 24, 12, 17),
('Quinta', '19:30:00', 340.00, 22, 24, 12, 18),
('Sexta', '20:30:00', 360.00, 20, 24, 12, 19),
('Sábado', '09:30:00', 410.00, 24, 24, 12, 20),
('Domingo', '10:30:00', 390.00, 20, 24, 12, 21),
('Segunda', '19:10:00', 305.00, 20, 24, 12, 22),
('Terça', '20:10:00', 275.00, 18, 24, 12, 23),
('Quarta', '21:10:00', 295.00, 20, 24, 12, 24),
('Quinta', '19:40:00', 315.00, 22, 24, 12, 25),
('Sexta', '20:40:00', 335.00, 20, 24, 12, 26),
('Sábado', '11:30:00', 430.00, 24, 24, 12, 27),
('Domingo', '08:00:00', 360.00, 20, 24, 12, 28),
('Segunda', '19:20:00', 300.00, 20, 24, 12, 29),
('Terça', '20:20:00', 285.00, 18, 24, 12, 30);

INSERT INTO VinculoJogadorPelada (idJogador, idPelada, estrelas, tipoParticipacao, papelNaPelada) VALUES
(1, 1, 5, 'Mensalista', 'Organizador'),
(2, 1, 4, 'Mensalista', 'Jogador'),
(3, 2, 3, 'Diarista', 'Jogador'),
(4, 2, 5, 'Mensalista', 'Organizador'),
(5, 3, 2, 'Fila', 'Jogador'),
(6, 3, 4, 'Mensalista', 'Jogador'),
(7, 4, 5, 'Mensalista', 'Organizador'),
(8, 4, 3, 'Diarista', 'Jogador'),
(9, 5, 2, 'Fila', 'Jogador'),
(10, 5, 4, 'Mensalista', 'Jogador'),
(11, 6, 5, 'Mensalista', 'Organizador'),
(12, 6, 3, 'Diarista', 'Jogador'),
(13, 7, 4, 'Mensalista', 'Jogador'),
(14, 7, 5, 'Mensalista', 'Organizador'),
(15, 8, 2, 'Fila', 'Jogador'),
(16, 8, 4, 'Mensalista', 'Jogador'),
(17, 9, 5, 'Mensalista', 'Organizador'),
(18, 9, 3, 'Diarista', 'Jogador'),
(19, 10, 2, 'Fila', 'Jogador'),
(20, 10, 4, 'Mensalista', 'Jogador'),
(21, 11, 5, 'Mensalista', 'Organizador'),
(22, 11, 3, 'Diarista', 'Jogador'),
(23, 12, 4, 'Mensalista', 'Jogador'),
(24, 12, 5, 'Mensalista', 'Organizador'),
(25, 13, 2, 'Fila', 'Jogador'),
(26, 13, 4, 'Mensalista', 'Jogador'),
(27, 14, 5, 'Mensalista', 'Organizador'),
(28, 14, 3, 'Diarista', 'Jogador'),
(29, 15, 2, 'Fila', 'Jogador'),
(30, 15, 4, 'Mensalista', 'Jogador');

INSERT INTO Rodada (idPelada, data) VALUES
(1, '2025-01-06'),
(2, '2025-01-13'),
(3, '2025-01-20'),
(4, '2025-01-27'),
(5, '2025-02-03'),
(6, '2025-02-10'),
(7, '2025-02-17'),
(8, '2025-02-24'),
(9, '2025-03-03'),
(10, '2025-03-10'),
(11, '2025-03-17'),
(12, '2025-03-24'),
(13, '2025-03-31'),
(14, '2025-04-07'),
(15, '2025-04-14'),
(16, '2025-04-21'),
(17, '2025-04-28'),
(18, '2025-05-05'),
(19, '2025-05-12'),
(20, '2025-05-19'),
(21, '2025-05-26'),
(22, '2025-06-02'),
(23, '2025-06-09'),
(24, '2025-06-16'),
(25, '2025-06-23'),
(26, '2025-06-30'),
(27, '2025-07-07'),
(28, '2025-07-14'),
(29, '2025-07-21'),
(30, '2025-07-28');

INSERT INTO Inscricao (idJogador, idRodada, statusConfirmacao, dataResposta) VALUES
(1, 1, 'Confirmado', '2025-01-05'),
(2, 2, 'Ausente', '2025-01-10'),
(3, 3, 'Confirmado', '2025-01-18'),
(4, 4, 'Pendente', NULL),
(5, 5, 'Confirmado', '2025-02-01'),
(6, 6, 'Confirmado', '2025-02-08'),
(7, 7, 'Ausente', '2025-02-15'),
(8, 8, 'Confirmado', '2025-02-22'),
(9, 9, 'Pendente', NULL),
(10, 10, 'Confirmado', '2025-03-08'),
(11, 11, 'Ausente', '2025-03-15'),
(12, 12, 'Confirmado', '2025-03-22'),
(13, 13, 'Confirmado', '2025-03-29'),
(14, 14, 'Pendente', NULL),
(15, 15, 'Confirmado', '2025-04-12'),
(16, 16, 'Ausente', '2025-04-19'),
(17, 17, 'Confirmado', '2025-04-26'),
(18, 18, 'Confirmado', '2025-05-03'),
(19, 19, 'Ausente', '2025-05-10'),
(20, 20, 'Pendente', NULL),
(21, 21, 'Confirmado', '2025-05-25'),
(22, 22, 'Confirmado', '2025-05-30'),
(23, 23, 'Ausente', '2025-06-06'),
(24, 24, 'Confirmado', '2025-06-13'),
(25, 25, 'Pendente', NULL),
(26, 26, 'Confirmado', '2025-06-28'),
(27, 27, 'Ausente', '2025-07-05'),
(28, 28, 'Confirmado', '2025-07-12'),
(29, 29, 'Confirmado', '2025-07-19'),
(30, 30, 'Ausente', '2025-07-26');

INSERT INTO Partida (idRodada, placarTimeA, placarTimeB) VALUES
(1, 3, 2),
(2, 1, 1),
(3, 4, 2),
(4, 0, 3),
(5, 2, 2),
(6, 5, 1),
(7, 3, 3),
(8, 2, 0),
(9, 1, 4),
(10, 2, 2),
(11, 3, 1),
(12, 4, 3),
(13, 0, 0),
(14, 5, 2),
(15, 1, 3),
(16, 2, 1),
(17, 3, 4),
(18, 2, 2),
(19, 4, 1),
(20, 1, 0),
(21, 3, 3),
(22, 2, 5),
(23, 0, 2),
(24, 4, 4),
(25, 1, 1),
(26, 3, 2),
(27, 5, 3),
(28, 2, 2),
(29, 4, 0),
(30, 3, 1);

INSERT INTO Time (idRodada, cor) VALUES
(1, 'Vermelho'),
(2, 'Azul'),
(3, 'Amarelo'),
(4, 'Verde'),
(5, 'Preto'),
(6, 'Branco'),
(7, 'Laranja'),
(8, 'Roxo'),
(9, 'Cinza'),
(10, 'Rosa'),
(11, 'Vinho'),
(12, 'Azul Claro'),
(13, 'Amarelo Ouro'),
(14, 'Verde Limão'),
(15, 'Preto e Branco'),
(16, 'Azul Marinho'),
(17, 'Vermelho e Preto'),
(18, 'Verde Escuro'),
(19, 'Branco e Azul'),
(20, 'Amarelo Neon'),
(21, 'Cinza Escuro'),
(22, 'Roxo Claro'),
(23, 'Laranja Forte'),
(24, 'Azul Turquesa'),
(25, 'Preto Fosco'),
(26, 'Verde Bandeira'),
(27, 'Vermelho Claro'),
(28, 'Azul e Branco'),
(29, 'Amarelo e Preto'),
(30, 'Branco e Vermelho');

INSERT INTO Pagamento (idJogador, idRodada, valor, forma, status, data) VALUES
(1, 1, 20.00, 'PIX', 'Pago', '2025-01-05'),
(2, 2, 18.00, 'Dinheiro', 'Pago', '2025-01-12'),
(3, 3, 22.00, 'Cartao', 'Pendente', NULL),
(4, 4, 20.00, 'PIX', 'Pago', '2025-01-26'),
(5, 5, 19.00, 'Dinheiro', 'Atrasado', '2025-02-02'),
(6, 6, 21.00, 'Cartao', 'Pago', '2025-02-09'),
(7, 7, 20.00, 'PIX', 'Pago', '2025-02-16'),
(8, 8, 18.00, 'Dinheiro', 'Pendente', NULL),
(9, 9, 22.00, 'Cartao', 'Pago', '2025-03-02'),
(10, 10, 20.00, 'PIX', 'Pago', '2025-03-09'),
(11, 11, 19.00, 'Dinheiro', 'Pago', '2025-03-16'),
(12, 12, 21.00, 'Cartao', 'Atrasado', '2025-03-23'),
(13, 13, 20.00, 'PIX', 'Pago', '2025-03-30'),
(14, 14, 18.00, 'Dinheiro', 'Pago', '2025-04-06'),
(15, 15, 22.00, 'Cartao', 'Pendente', NULL),
(16, 16, 20.00, 'PIX', 'Pago', '2025-04-20'),
(17, 17, 19.00, 'Dinheiro', 'Pago', '2025-04-27'),
(18, 18, 21.00, 'Cartao', 'Pago', '2025-05-04'),
(19, 19, 20.00, 'PIX', 'Atrasado', '2025-05-11'),
(20, 20, 18.00, 'Dinheiro', 'Pago', '2025-05-18'),
(21, 21, 22.00, 'Cartao', 'Pago', '2025-05-25'),
(22, 22, 20.00, 'PIX', 'Pendente', NULL),
(23, 23, 19.00, 'Dinheiro', 'Pago', '2025-06-08'),
(24, 24, 21.00, 'Cartao', 'Pago', '2025-06-15'),
(25, 25, 20.00, 'PIX', 'Pago', '2025-06-22'),
(26, 26, 18.00, 'Dinheiro', 'Atrasado', '2025-06-29'),
(27, 27, 22.00, 'Cartao', 'Pago', '2025-07-06'),
(28, 28, 20.00, 'PIX', 'Pago', '2025-07-13'),
(29, 29, 19.00, 'Dinheiro', 'Pago', '2025-07-20'),
(30, 30, 21.00, 'Cartao', 'Pago', '2025-07-27');

INSERT INTO Estatisticas (idJogador, idPartida, gols, assistencias, participacoes) VALUES
(1, 1, 2, 1, 3),
(2, 2, 0, 1, 1),
(3, 3, 1, 0, 1),
(4, 4, 0, 2, 2),
(5, 5, 2, 0, 2),
(6, 6, 3, 1, 4),
(7, 7, 1, 1, 2),
(8, 8, 0, 0, 0),
(9, 9, 2, 1, 3),
(10, 10, 1, 0, 1),
(11, 11, 0, 1, 1),
(12, 12, 2, 2, 4),
(13, 13, 0, 0, 0),
(14, 14, 3, 1, 4),
(15, 15, 1, 0, 1),
(16, 16, 0, 2, 2),
(17, 17, 2, 0, 2),
(18, 18, 1, 1, 2),
(19, 19, 0, 1, 1),
(20, 20, 1, 0, 1),
(21, 21, 2, 2, 4),
(22, 22, 0, 0, 0),
(23, 23, 1, 1, 2),
(24, 24, 2, 0, 2),
(25, 25, 0, 1, 1),
(26, 26, 1, 0, 1),
(27, 27, 3, 1, 4),
(28, 28, 0, 2, 2),
(29, 29, 2, 0, 2),
(30, 30, 1, 1, 2);


