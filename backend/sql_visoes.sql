-- Visão 1: Agenda operacional das rodadas com organizador e status das inscrições.
-- Semântica: consolida data/hora da rodada, local da pelada, contato do responsável
-- e situação das confirmações para que o organizador acompanhe presença dos jogadores.
CREATE OR REPLACE VIEW vw_agenda_peladas_organizadores AS
SELECT 
    r.idRodada,
    r.data,
    pe.diaSemana,
    pe.horario,
    pe.valorTotal,
    e.rua,
    e.bairro,
    p_org.nome AS nomeOrganizador,
    CONCAT_WS(' ', p_org.telefoneDDD, p_org.telefoneNumero) AS contatoOrganizador,
    COUNT(DISTINCT CASE WHEN i.statusConfirmacao = 'Confirmado' THEN i.idJogador END) AS confirmados,
    COUNT(DISTINCT CASE WHEN i.statusConfirmacao = 'Pendente' THEN i.idJogador END) AS pendentes,
    COUNT(DISTINCT CASE WHEN i.statusConfirmacao = 'Ausente' THEN i.idJogador END) AS ausentes
FROM Rodada r
JOIN Pelada pe ON pe.idPelada = r.idPelada
LEFT JOIN Endereco e ON e.idEndereco = pe.idEndereco
LEFT JOIN VinculoJogadorPelada v_org 
    ON v_org.idPelada = pe.idPelada 
    AND v_org.papelNaPelada = 'Organizador'
LEFT JOIN Jogador j_org ON j_org.idJogador = v_org.idJogador
LEFT JOIN Pessoa p_org ON p_org.idPessoa = j_org.idPessoa
LEFT JOIN Inscricao i ON i.idRodada = r.idRodada
GROUP BY 
    r.idRodada,
    r.data,
    pe.diaSemana,
    pe.horario,
    pe.valorTotal,
    e.rua,
    e.bairro,
    p_org.nome,
    p_org.telefoneDDD,
    p_org.telefoneNumero;

--------------------------------------------------------------
SELECT idRodada,data,diaSemana,horario,valorTotal,
              rua,bairro,nomeOrganizador,contatoOrganizador,
              confirmados,pendentes,ausentes
         FROM vw_agenda_peladas_organizadores
        ORDER BY idRodada

-- Visão 2: Resumo financeiro e esportivo por jogador.
-- Semântica: mostra engajamento em peladas, situação de pagamentos e desempenho
-- individual para apoiar decisões sobre convites, cobrança e escalação.
CREATE OR REPLACE VIEW vw_jogador_resumo_financeiro AS
SELECT 
    j.idJogador,
    p.nome,
    p.email,
    COALESCE(participacao.peladasParticipadas, 0) AS peladasParticipadas,
    COALESCE(pagamentos.rodadasCobradas, 0) AS rodadasCobradas,
    COALESCE(pagamentos.totalPago, 0) AS totalPago,
    COALESCE(pagamentos.totalPendente, 0) AS totalPendente,
    COALESCE(pagamentos.totalAtrasado, 0) AS totalAtrasado,
    COALESCE(avaliacao.mediaEstrelas, 0) AS mediaEstrelas,
    COALESCE(desempenho.totalGols, 0) AS totalGols,
    COALESCE(desempenho.totalAssistencias, 0) AS totalAssistencias
FROM Jogador j
JOIN Pessoa p ON p.idPessoa = j.idPessoa
LEFT JOIN (
    SELECT 
        v.idJogador,
        COUNT(DISTINCT v.idPelada) AS peladasParticipadas
    FROM VinculoJogadorPelada v
    WHERE v.tipoParticipacao IN ('Mensalista', 'Diarista')
    GROUP BY v.idJogador
) participacao ON participacao.idJogador = j.idJogador
LEFT JOIN (
    SELECT 
        pg.idJogador,
        COUNT(DISTINCT pg.idRodada) AS rodadasCobradas,
        SUM(CASE WHEN pg.status = 'Pago' THEN pg.valor ELSE 0 END) AS totalPago,
        SUM(CASE WHEN pg.status = 'Pendente' THEN pg.valor ELSE 0 END) AS totalPendente,
        SUM(CASE WHEN pg.status = 'Atrasado' THEN pg.valor ELSE 0 END) AS totalAtrasado
    FROM Pagamento pg
    GROUP BY pg.idJogador
) pagamentos ON pagamentos.idJogador = j.idJogador
LEFT JOIN (
    SELECT 
        v.idJogador,
        AVG(v.estrelas) AS mediaEstrelas
    FROM VinculoJogadorPelada v
    WHERE v.estrelas IS NOT NULL
    GROUP BY v.idJogador
) avaliacao ON avaliacao.idJogador = j.idJogador
LEFT JOIN (
    SELECT 
        est.idJogador,
        SUM(est.gols) AS totalGols,
        SUM(est.assistencias) AS totalAssistencias
    FROM Estatisticas est
    GROUP BY est.idJogador
) desempenho ON desempenho.idJogador = j.idJogador;
--------------------------------------------------------------
SELECT idJogador,nome,peladasParticipadas,rodadasCobradas,
              totalPago,totalPendente,totalAtrasado,
              mediaEstrelas,totalGols,totalAssistencias
         FROM vw_jogador_resumo_financeiro
        ORDER BY idJogador
        LIMIT 10