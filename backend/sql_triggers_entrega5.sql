USE springFut;

DELIMITER $$

-- Trigger 1: Demonstração de trigger AFTER INSERT na tabela Pagamento.
-- Nota: A auditoria de pagamentos é feita diretamente consultando a tabela Pagamento,
-- não sendo necessária uma tabela de log separada, pois a tabela Pagamento já contém
-- todas as informações necessárias para auditoria financeira.
DROP TRIGGER IF EXISTS trg_pagamento_insert_log$$
CREATE TRIGGER trg_pagamento_insert_log
AFTER INSERT ON Pagamento
FOR EACH ROW
BEGIN
    -- Trigger criado para demonstração. A auditoria é feita consultando
    -- diretamente a tabela Pagamento, que já contém todos os dados necessários.
    -- Este trigger pode ser usado para validações adicionais ou notificações.
    -- Exemplo: Poderia enviar notificação, validar regras de negócio, etc.
    SET @trigger_executado = 1;
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
