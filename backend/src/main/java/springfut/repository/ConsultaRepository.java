package springfut.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class ConsultaRepository {
    private final JdbcTemplate jdbc;

    public ConsultaRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // ========== CONSULTAS OBRIGATÓRIAS PARA ENTREGA ==========
    
    // CONSULTA 1: Jogadores com suas posições e informações pessoais (JOIN)
    public List<Map<String,Object>> jogadoresComPosicao() {
        String sql = """
            SELECT 
                j.idJogador,
                p.nome,
                p.email,
                j.posicaoPreferida,
                COUNT(v.idPelada) as totalPeladas,
                GROUP_CONCAT(DISTINCT a.apelido) as apelidos
            FROM Jogador j 
            JOIN Pessoa p ON j.idPessoa = p.idPessoa 
            LEFT JOIN VinculoJogadorPelada v ON j.idJogador = v.idJogador
            LEFT JOIN JogadorApelido a ON j.idJogador = a.idJogador
            GROUP BY j.idJogador, p.nome, p.email, j.posicaoPreferida
            ORDER BY p.nome
        """;
        return jdbc.queryForList(sql);
    }

    // CONSULTA 2: Peladas com estatísticas completas (MÚLTIPLOS JOINS + AGREGAÇÃO)
    public List<Map<String,Object>> peladasComEstatisticas() {
        String sql = """
            SELECT 
                pe.idPelada,
                pe.diaSemana,
                pe.horario,
                pe.valorTotal,
                pe.limiteMensalistas,
                e.rua as endereco,
                e.bairro,
                COUNT(DISTINCT v.idJogador) as totalJogadores,
                COUNT(DISTINCT CASE WHEN v.tipoParticipacao = 'Mensalista' THEN v.idJogador END) as mensalistas,
                COUNT(DISTINCT CASE WHEN v.tipoParticipacao = 'Diarista' THEN v.idJogador END) as diaristas,
                COUNT(DISTINCT r.idRodada) as totalRodadas,
                COALESCE(SUM(pg.valor), 0) as totalArrecadado,
                p_org.nome as organizador
            FROM Pelada pe
            LEFT JOIN Endereco e ON pe.idEndereco = e.idEndereco
            LEFT JOIN VinculoJogadorPelada v ON pe.idPelada = v.idPelada
            LEFT JOIN VinculoJogadorPelada v_org ON pe.idPelada = v_org.idPelada AND v_org.papelNaPelada = 'Organizador'
            LEFT JOIN Jogador j_org ON v_org.idJogador = j_org.idJogador
            LEFT JOIN Pessoa p_org ON j_org.idPessoa = p_org.idPessoa
            LEFT JOIN Rodada r ON pe.idPelada = r.idPelada
            LEFT JOIN Pagamento pg ON r.idRodada = pg.idRodada
            GROUP BY pe.idPelada, pe.diaSemana, pe.horario, pe.valorTotal, pe.limiteMensalistas, 
                     e.rua, e.bairro, p_org.nome
            ORDER BY pe.diaSemana, pe.horario
        """;
        return jdbc.queryForList(sql);
    }

    // CONSULTA 3: Ranking de jogadores por participação e desempenho (SUBCONSULTA + JOIN)
    public List<Map<String,Object>> rankingJogadores() {
        String sql = """
            SELECT 
                p.nome,
                j.posicaoPreferida,
                COUNT(DISTINCT v.idPelada) as peladas_participadas,
                COUNT(DISTINCT i.idInscricao) as inscricoes_total,
                COUNT(DISTINCT CASE WHEN i.statusConfirmacao = 'Confirmado' THEN i.idInscricao END) as presencas,
                COALESCE(SUM(est.gols), 0) as total_gols,
                COALESCE(SUM(est.assistencias), 0) as total_assistencias,
                COALESCE(AVG(v.estrelas), 0) as media_estrelas,
                ROUND(
                    (COUNT(DISTINCT CASE WHEN i.statusConfirmacao = 'Confirmado' THEN i.idInscricao END) * 100.0) / 
                    NULLIF(COUNT(DISTINCT i.idInscricao), 0), 2
                ) as percentual_presenca
            FROM Pessoa p
            JOIN Jogador j ON p.idPessoa = j.idPessoa
            LEFT JOIN VinculoJogadorPelada v ON j.idJogador = v.idJogador
            LEFT JOIN Inscricao i ON j.idJogador = i.idJogador
            LEFT JOIN Rodada r ON i.idRodada = r.idRodada
            LEFT JOIN Partida pt ON r.idRodada = pt.idRodada
            LEFT JOIN Estatisticas est ON j.idJogador = est.idJogador AND pt.idPartida = est.idPartida
            GROUP BY p.idPessoa, p.nome, j.posicaoPreferida
            HAVING COUNT(DISTINCT v.idPelada) > 0
            ORDER BY total_gols DESC, total_assistencias DESC, percentual_presenca DESC
        """;
        return jdbc.queryForList(sql);
    }

    // CONSULTA 4: Análise financeira por pelada e período (JOINS + FUNÇÕES DE DATA)
    public List<Map<String,Object>> analiseFinanceira() {
        String sql = """
            SELECT 
                pe.diaSemana,
                pe.valorTotal as valor_pelada,
                COUNT(DISTINCT r.idRodada) as rodadas_realizadas,
                COUNT(DISTINCT pg.idPagamento) as total_pagamentos,
                SUM(CASE WHEN pg.status = 'Pago' THEN pg.valor ELSE 0 END) as valor_recebido,
                SUM(CASE WHEN pg.status = 'Pendente' THEN pg.valor ELSE 0 END) as valor_pendente,
                SUM(CASE WHEN pg.status = 'Atrasado' THEN pg.valor ELSE 0 END) as valor_atrasado,
                ROUND(
                    (SUM(CASE WHEN pg.status = 'Pago' THEN pg.valor ELSE 0 END) * 100.0) / 
                    NULLIF(SUM(pg.valor), 0), 2
                ) as percentual_recebido,
                MAX(r.data) as ultima_rodada,
                MIN(r.data) as primeira_rodada
            FROM Pelada pe
            LEFT JOIN Rodada r ON pe.idPelada = r.idPelada
            LEFT JOIN Pagamento pg ON r.idRodada = pg.idRodada
            WHERE r.data <= CURDATE()
            GROUP BY pe.idPelada, pe.diaSemana, pe.valorTotal
            HAVING COUNT(DISTINCT r.idRodada) > 0
            ORDER BY valor_recebido DESC
        """;
        return jdbc.queryForList(sql);
    }

    // ========== CONSULTAS AUXILIARES ==========

    // CONSULTA 5: Rodadas futuras com detalhes (JOIN simples)
    public List<Map<String,Object>> rodadasFuturas() {
        String sql = """
            SELECT 
                r.idRodada, 
                r.data, 
                p.diaSemana,
                p.horario,
                p.valorTotal,
                e.rua as endereco,
                e.bairro,
                COUNT(i.idJogador) as inscritos
            FROM Rodada r 
            JOIN Pelada p ON r.idPelada = p.idPelada
            LEFT JOIN Endereco e ON p.idEndereco = e.idEndereco
            LEFT JOIN Inscricao i ON r.idRodada = i.idRodada
            WHERE r.data > CURDATE()
            GROUP BY r.idRodada, r.data, p.diaSemana, p.horario, p.valorTotal, e.rua, e.bairro
            ORDER BY r.data
        """;
        return jdbc.queryForList(sql);
    }

    // CONSULTA 6: Valor arrecadado por rodada (GROUP BY + SUM)
    public List<Map<String,Object>> valorArrecadadoPorRodada() {
        String sql = """
            SELECT 
                r.idRodada,
                r.data,
                pe.diaSemana,
                COUNT(pg.idPagamento) as total_pagamentos,
                SUM(pg.valor) as total_arrecadado,
                AVG(pg.valor) as valor_medio,
                COUNT(CASE WHEN pg.status = 'Pago' THEN 1 END) as pagos,
                COUNT(CASE WHEN pg.status = 'Pendente' THEN 1 END) as pendentes
            FROM Rodada r 
            JOIN Pelada pe ON r.idPelada = pe.idPelada
            LEFT JOIN Pagamento pg ON r.idRodada = pg.idRodada
            GROUP BY r.idRodada, r.data, pe.diaSemana
            HAVING SUM(pg.valor) > 0
            ORDER BY total_arrecadado DESC
        """;
        return jdbc.queryForList(sql);
    }

    // ========== CONSULTAS DO ARQUIVO 4_consultas.sql ==========

    // CONSULTA 1 (anti join): Peladas sem organizador associado
    public List<Map<String,Object>> peladasSemOrganizador() {
        String sql = """
            SELECT 
                pe.idPelada,
                pe.diaSemana,
                pe.horario,
                pe.limiteMensalistas
            FROM Pelada pe
            LEFT JOIN VinculoJogadorPelada v
                ON pe.idPelada = v.idPelada
                AND v.papelNaPelada = 'Organizador'
            WHERE v.idVinculo IS NULL
        """;
        return jdbc.queryForList(sql);
    }

    // CONSULTA 2 (full outer join emulado): Perfis de jogador e organizador
    public List<Map<String,Object>> perfisJogadorOrganizador() {
        String sql = """
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
            WHERE j.idPessoa IS NULL
        """;
        return jdbc.queryForList(sql);
    }

    // CONSULTA 3 (subconsulta): Jogadores acima da média geral de avaliação
    public List<Map<String,Object>> jogadoresAcimaMediaAvaliacao() {
        String sql = """
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
            )
        """;
        return jdbc.queryForList(sql);
    }

    // CONSULTA 4 (subconsulta correlacionada): Peladas acima da média arrecadada no mesmo dia
    public List<Map<String,Object>> peladasAcimaMediaArrecadada() {
        String sql = """
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
            )
        """;
        return jdbc.queryForList(sql);
    }
}