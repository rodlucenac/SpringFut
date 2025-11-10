USE springFut;

DELIMITER $$

-- Função 1: Calcula o valor ainda em aberto para uma rodada,
-- comparando o valor total previsto da pelada com os pagamentos marcados como "Pago".
DROP FUNCTION IF EXISTS fn_valor_faltante_rodada$$
CREATE FUNCTION fn_valor_faltante_rodada(p_idRodada INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE v_total DECIMAL(10,2);
    DECLARE v_pago DECIMAL(10,2);
    DECLARE v_faltante DECIMAL(10,2);

    SELECT pe.valorTotal
      INTO v_total
      FROM Rodada r
      JOIN Pelada pe ON pe.idPelada = r.idPelada
     WHERE r.idRodada = p_idRodada
     LIMIT 1;

    SELECT COALESCE(SUM(pg.valor), 0)
      INTO v_pago
      FROM Pagamento pg
     WHERE pg.idRodada = p_idRodada
       AND pg.status = 'Pago';

    SET v_faltante = v_total - v_pago;
    IF v_faltante < 0 THEN
        SET v_faltante = 0;
    END IF;

    RETURN v_faltante;
END$$

-- Função 2: Classifica a assiduidade de um jogador com base
-- no percentual de inscrições confirmadas.
DROP FUNCTION IF EXISTS fn_classificacao_assiduidade$$
CREATE FUNCTION fn_classificacao_assiduidade(p_idJogador INT)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE v_total INT DEFAULT 0;
    DECLARE v_confirmados INT DEFAULT 0;
    DECLARE v_percent DECIMAL(5,2) DEFAULT 0;

    SELECT COUNT(*)
      INTO v_total
      FROM Inscricao
     WHERE idJogador = p_idJogador;

    IF v_total = 0 THEN
        RETURN 'Sem histórico';
    END IF;

    SELECT COUNT(*)
      INTO v_confirmados
      FROM Inscricao
     WHERE idJogador = p_idJogador
       AND statusConfirmacao = 'Confirmado';

    SET v_percent = (v_confirmados * 100.0) / v_total;

    IF v_percent >= 75 THEN
        RETURN 'Presença Alta';
    ELSEIF v_percent >= 40 THEN
        RETURN 'Presença Regular';
    ELSE
        RETURN 'Presença Baixa';
    END IF;
END$$

DELIMITER ;
