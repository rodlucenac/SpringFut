USE springFut;

DELIMITER $$

-- Procedimento 1: Atualiza dados básicos de contato da pessoa,
-- permitindo aplicar somente os campos informados.
DROP PROCEDURE IF EXISTS sp_atualizar_contato_pessoa$$
CREATE PROCEDURE sp_atualizar_contato_pessoa(
    IN p_idPessoa INT,
    IN p_nome VARCHAR(100),
    IN p_telefoneDDD VARCHAR(5),
    IN p_telefoneNumero VARCHAR(15),
    IN p_email VARCHAR(100)
)
BEGIN
    UPDATE Pessoa
       SET nome = COALESCE(p_nome, nome),
           telefoneDDD = COALESCE(p_telefoneDDD, telefoneDDD),
           telefoneNumero = COALESCE(p_telefoneNumero, telefoneNumero),
           email = COALESCE(p_email, email)
     WHERE idPessoa = p_idPessoa;

    IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Pessoa não encontrada para atualização';
    END IF;
END$$

-- Procedimento 2: Promove jogadores da fila para mensalistas respeitando
-- o limite de vagas. Necessita cursor para parar a promoção no momento
-- em que as vagas acabam, obedecendo a prioridade ordenada.
DROP PROCEDURE IF EXISTS sp_promover_fila_para_mensalista$$
CREATE PROCEDURE sp_promover_fila_para_mensalista(IN p_idPelada INT)
BEGIN
    DECLARE v_limite INT;
    DECLARE v_atual INT;
    DECLARE v_disponiveis INT;
    DECLARE v_promovidos INT DEFAULT 0;
    DECLARE v_idJogador INT;
    DECLARE v_done INT DEFAULT 0;

    DECLARE cur_fila CURSOR FOR
        SELECT idJogador
          FROM VinculoJogadorPelada
         WHERE idPelada = p_idPelada
           AND tipoParticipacao = 'Fila'
         ORDER BY estrelas DESC, idJogador ASC;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = 1;

    SELECT limiteMensalistas
      INTO v_limite
      FROM Pelada
     WHERE idPelada = p_idPelada
     LIMIT 1;

    IF v_limite IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Pelada não encontrada';
    END IF;

    SELECT COUNT(*)
      INTO v_atual
      FROM VinculoJogadorPelada
     WHERE idPelada = p_idPelada
       AND tipoParticipacao = 'Mensalista';

    SET v_disponiveis = v_limite - v_atual;

    IF v_disponiveis > 0 THEN
        SET v_done = 0;
        OPEN cur_fila;
        read_loop: LOOP
            FETCH cur_fila INTO v_idJogador;
            IF v_done = 1 THEN
                LEAVE read_loop;
            END IF;

            UPDATE VinculoJogadorPelada
               SET tipoParticipacao = 'Mensalista'
             WHERE idPelada = p_idPelada
               AND idJogador = v_idJogador
               AND tipoParticipacao = 'Fila';

            IF ROW_COUNT() > 0 THEN
                SET v_promovidos = v_promovidos + 1;
                SET v_disponiveis = v_disponiveis - 1;
            END IF;

            IF v_disponiveis = 0 THEN
                LEAVE read_loop;
            END IF;
        END LOOP;
        CLOSE cur_fila;
    ELSE
        SET v_disponiveis = 0;
    END IF;

    SELECT v_promovidos AS jogadores_promovidos,
           v_disponiveis AS vagas_restantes;
END$$

DELIMITER ;
