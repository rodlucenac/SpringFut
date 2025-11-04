-- Consulta 1 (anti join): Peladas sem organizador associado
SELECT 
    pe.idPelada,
    pe.diaSemana,
    pe.horario,
    pe.limiteMensalistas
FROM Pelada pe
LEFT JOIN VinculoJogadorPelada v
    ON pe.idPelada = v.idPelada
    AND v.papelNaPelada = 'Organizador'
WHERE v.idVinculo IS NULL;

-- Consulta 2 (full outer join emulado): Perfis de jogador e organizador
SELECT 
    j.idPessoa,
    p.nome,
    j.idJogador,
    o.idOrganizador,
    CASE 
        WHEN o.idOrganizador IS NOT NULL THEN 'Jogador e Organizador'
        ELSE 'Apenas Jogador'
    END AS papel
FROM Jogador j
LEFT JOIN Organizador o ON j.idPessoa = o.idPessoa
JOIN Pessoa p ON p.idPessoa = j.idPessoa

UNION ALL

SELECT 
    o.idPessoa,
    p.nome,
    NULL AS idJogador,
    o.idOrganizador,
    'Apenas Organizador' AS papel
FROM Organizador o
LEFT JOIN Jogador j ON j.idPessoa = o.idPessoa
JOIN Pessoa p ON p.idPessoa = o.idPessoa
WHERE j.idPessoa IS NULL;

-- Consulta 3 (subconsulta): Jogadores acima da média geral de avaliação
SELECT 
    p.nome,
    j.idJogador,
    ROUND(AVG(v.estrelas), 2) AS mediaEstrelas
FROM Jogador j
JOIN Pessoa p ON p.idPessoa = j.idPessoa
JOIN VinculoJogadorPelada v ON v.idJogador = j.idJogador
GROUP BY p.nome, j.idJogador
HAVING AVG(v.estrelas) > (
    SELECT AVG(estrelas)
    FROM VinculoJogadorPelada
    WHERE estrelas IS NOT NULL
);

-- Consulta 4 (subconsulta correlacionada): Peladas acima da média arrecadada no mesmo dia
SELECT 
    pe.idPelada,
    pe.diaSemana,
    COALESCE(SUM(CASE WHEN pg.status = 'Pago' THEN pg.valor ELSE 0 END), 0) AS totalPago
FROM Pelada pe
JOIN Rodada r ON r.idPelada = pe.idPelada
LEFT JOIN Pagamento pg ON pg.idRodada = r.idRodada
GROUP BY pe.idPelada, pe.diaSemana
HAVING COALESCE(SUM(CASE WHEN pg.status = 'Pago' THEN pg.valor ELSE 0 END), 0) > (
    SELECT COALESCE(AVG(totalPorPelada), 0)
    FROM (
        SELECT 
            pe2.idPelada,
            COALESCE(SUM(CASE WHEN pg2.status = 'Pago' THEN pg2.valor ELSE 0 END), 0) AS totalPorPelada
        FROM Pelada pe2
        JOIN Rodada r2 ON r2.idPelada = pe2.idPelada
        LEFT JOIN Pagamento pg2 ON pg2.idRodada = r2.idRodada
        WHERE pe2.diaSemana = pe.diaSemana
        GROUP BY pe2.idPelada
    ) totais
);
