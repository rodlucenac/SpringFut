USE springFut;

DELIMITER $$

-- Tabela de log para acompanhar movimentações financeiras.
CREATE TABLE IF NOT EXISTS PagamentoLog (
    idLog INT AUTO_INCREMENT PRIMARY KEY,
    idPagamento INT NOT NULL,
    idJogador INT,
    idRodada INT,
    valor DECIMAL(10,2),
    status ENUM('Pago','Pendente','Atrasado'),
    dataEvento DATETIME DEFAULT CURRENT_TIMESTAMP,
    observacao VARCHAR(255)
)$$

-- Trigger 1: registra cada novo pagamento na tabela de log para auditoria financeira.
DROP TRIGGER IF EXISTS trg_pagamento_insert_log$$
CREATE TRIGGER trg_pagamento_insert_log
AFTER INSERT ON Pagamento
FOR EACH ROW
BEGIN
    INSERT INTO PagamentoLog (idPagamento, idJogador, idRodada, valor, status, observacao)
    VALUES (NEW.idPagamento, NEW.idJogador, NEW.idRodada, NEW.valor, NEW.status, 'Pagamento registrado');
END$$

-- Trigger 2: garante que toda atualização de status de inscrição ajuste a data de resposta.
DROP TRIGGER IF EXISTS trg_inscricao_status_resposta$$
CREATE TRIGGER trg_inscricao_status_resposta
BEFORE UPDATE ON Inscricao
FOR EACH ROW
BEGIN
    IF NEW.statusConfirmacao = 'Pendente' THEN
        SET NEW.dataResposta = NULL;
    ELSEIF NEW.statusConfirmacao <> OLD.statusConfirmacao AND (NEW.dataResposta IS NULL OR NEW.dataResposta = OLD.dataResposta) THEN
        SET NEW.dataResposta = CURDATE();
    END IF;
END$$

DELIMITER ;
