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
