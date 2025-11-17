package springfut.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    
    private final JdbcTemplate jdbc;

    public DashboardController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // ========== INDICADORES RESUMIDOS ==========
    
    @GetMapping("/indicadores")
    public Map<String, Object> getIndicadores() {
        Map<String, Object> indicadores = new HashMap<>();
        
        // 1. Total de Peladas
        Integer totalPeladas = jdbc.queryForObject(
            "SELECT COUNT(*) FROM Pelada",
            Integer.class
        );
        indicadores.put("totalPeladas", totalPeladas);
        
        // 2. Total de Jogadores Ativos
        Integer jogadoresAtivos = jdbc.queryForObject(
            "SELECT COUNT(DISTINCT idJogador) FROM VinculoJogadorPelada",
            Integer.class
        );
        indicadores.put("jogadoresAtivos", jogadoresAtivos);
        
        // 3. Total de Rodadas Realizadas
        Integer rodadasRealizadas = jdbc.queryForObject(
            "SELECT COUNT(*) FROM Rodada WHERE data <= CURDATE()",
            Integer.class
        );
        indicadores.put("rodadasRealizadas", rodadasRealizadas);
        
        // 4. Total Arrecadado
        BigDecimal totalArrecadado = jdbc.queryForObject(
            "SELECT COALESCE(SUM(valor), 0) FROM Pagamento WHERE status = 'Pago'",
            BigDecimal.class
        );
        indicadores.put("totalArrecadado", totalArrecadado);
        
        // 5. Média de Jogadores por Rodada
        Double mediaJogadoresPorRodada = jdbc.queryForObject(
            """
            SELECT AVG(confirmados) FROM (
                SELECT COUNT(DISTINCT idJogador) as confirmados
                FROM Inscricao
                WHERE statusConfirmacao = 'Confirmado'
                GROUP BY idRodada
            ) subquery
            """,
            Double.class
        );
        indicadores.put("mediaJogadoresPorRodada", mediaJogadoresPorRodada);
        
        // 6. Taxa de Confirmação Geral
        Map<String, Object> taxaConfirmacao = jdbc.queryForMap(
            """
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN statusConfirmacao = 'Confirmado' THEN 1 END) as confirmados,
                ROUND(
                    (COUNT(CASE WHEN statusConfirmacao = 'Confirmado' THEN 1 END) * 100.0) / 
                    COUNT(*), 2
                ) as percentual
            FROM Inscricao
            """
        );
        indicadores.put("taxaConfirmacao", taxaConfirmacao);
        
        // 7. Ticket Médio por Jogador
        BigDecimal ticketMedio = jdbc.queryForObject(
            """
            SELECT COALESCE(AVG(valor), 0)
            FROM Pagamento
            WHERE status = 'Pago'
            """,
            BigDecimal.class
        );
        indicadores.put("ticketMedio", ticketMedio);
        
        // 8. Pelada Mais Popular
        try {
            Map<String, Object> peladaPopular = jdbc.queryForMap(
                """
                SELECT 
                    p.idPelada,
                    p.diaSemana,
                    COUNT(DISTINCT v.idJogador) as totalJogadores
                FROM Pelada p
                JOIN VinculoJogadorPelada v ON p.idPelada = v.idPelada
                GROUP BY p.idPelada, p.diaSemana
                ORDER BY totalJogadores DESC
                LIMIT 1
                """
            );
            indicadores.put("peladaMaisPopular", peladaPopular);
        } catch (Exception e) {
            indicadores.put("peladaMaisPopular", null);
        }
        
        return indicadores;
    }

    // ========== GRÁFICO 1: DISTRIBUIÇÃO POR POSIÇÃO ==========
    
    @GetMapping("/graficos/distribuicao-posicoes")
    public List<Map<String, Object>> getDistribuicaoPosicoes() {
        String sql = """
            SELECT 
                COALESCE(posicaoPreferida, 'Não definida') as posicao,
                COUNT(*) as quantidade
            FROM Jogador
            GROUP BY posicaoPreferida
            ORDER BY quantidade DESC
        """;
        
        return jdbc.query(sql, (rs, rowNum) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("posicao", rs.getString("posicao"));
            item.put("quantidade", rs.getInt("quantidade"));
            return item;
        });
    }

    // ========== GRÁFICO 2: STATUS DE PAGAMENTOS ==========
    
    @GetMapping("/graficos/status-pagamentos")
    public List<Map<String, Object>> getStatusPagamentos() {
        String sql = """
            SELECT 
                status,
                COUNT(*) as quantidade,
                SUM(valor) as valorTotal
            FROM Pagamento
            GROUP BY status
        """;
        
        return jdbc.query(sql, (rs, rowNum) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("status", rs.getString("status"));
            item.put("quantidade", rs.getInt("quantidade"));
            item.put("valorTotal", rs.getBigDecimal("valorTotal"));
            return item;
        });
    }

    // ========== GRÁFICO 3: EVOLUÇÃO DE ARRECADAÇÃO ==========
    
    @GetMapping("/graficos/evolucao-arrecadacao")
    public List<Map<String, Object>> getEvolucaoArrecadacao(
        @RequestParam(required = false) String dataInicio,
        @RequestParam(required = false) String dataFim
    ) {
        StringBuilder sql = new StringBuilder("""
            SELECT 
                DATE_FORMAT(r.data, '%Y-%m') as mes,
                SUM(CASE WHEN p.status = 'Pago' THEN p.valor ELSE 0 END) as valorPago,
                SUM(CASE WHEN p.status = 'Pendente' THEN p.valor ELSE 0 END) as valorPendente,
                COUNT(DISTINCT r.idRodada) as rodadas
            FROM Rodada r
            LEFT JOIN Pagamento p ON r.idRodada = p.idRodada
            WHERE 1=1
        """);
        
        List<Object> params = new ArrayList<>();
        
        if (dataInicio != null) {
            sql.append(" AND r.data >= ?");
            params.add(dataInicio);
        }
        
        if (dataFim != null) {
            sql.append(" AND r.data <= ?");
            params.add(dataFim);
        }
        
        sql.append(" GROUP BY DATE_FORMAT(r.data, '%Y-%m') ORDER BY mes");
        
        return jdbc.query(sql.toString(), ps -> {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
        }, (rs, rowNum) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("mes", rs.getString("mes"));
            item.put("valorPago", rs.getBigDecimal("valorPago"));
            item.put("valorPendente", rs.getBigDecimal("valorPendente"));
            item.put("rodadas", rs.getInt("rodadas"));
            return item;
        });
    }

    // ========== GRÁFICO 4: CONFIRMAÇÕES POR RODADA ==========
    
    @GetMapping("/graficos/confirmacoes-rodada")
    public List<Map<String, Object>> getConfirmacoesPorRodada(
        @RequestParam(defaultValue = "10") int limite
    ) {
        String sql = """
            SELECT 
                r.idRodada,
                DATE_FORMAT(r.data, '%d/%m/%Y') as data,
                p.diaSemana,
                COUNT(CASE WHEN i.statusConfirmacao = 'Confirmado' THEN 1 END) as confirmados,
                COUNT(CASE WHEN i.statusConfirmacao = 'Ausente' THEN 1 END) as ausentes,
                COUNT(CASE WHEN i.statusConfirmacao = 'Pendente' THEN 1 END) as pendentes
            FROM Rodada r
            JOIN Pelada p ON r.idPelada = p.idPelada
            LEFT JOIN Inscricao i ON r.idRodada = i.idRodada
            WHERE r.data <= CURDATE()
            GROUP BY r.idRodada, r.data, p.diaSemana
            ORDER BY r.data DESC
            LIMIT ?
        """;
        
        return jdbc.query(sql, ps -> ps.setInt(1, limite), (rs, rowNum) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("idRodada", rs.getInt("idRodada"));
            item.put("data", rs.getString("data"));
            item.put("diaSemana", rs.getString("diaSemana"));
            item.put("confirmados", rs.getInt("confirmados"));
            item.put("ausentes", rs.getInt("ausentes"));
            item.put("pendentes", rs.getInt("pendentes"));
            return item;
        });
    }

    // ========== GRÁFICO 5: CORRELAÇÃO PELADAS x ESTRELAS ==========
    
    @GetMapping("/graficos/correlacao-peladas-estrelas")
    public List<Map<String, Object>> getCorrelacaoPeladasEstrelas() {
        String sql = """
            SELECT 
                p.nome as jogador,
                COUNT(DISTINCT v.idPelada) as numeroPeladas,
                COALESCE(AVG(v.estrelas), 0) as mediaEstrelas
            FROM Pessoa p
            JOIN Jogador j ON p.idPessoa = j.idPessoa
            LEFT JOIN VinculoJogadorPelada v ON j.idJogador = v.idJogador
            WHERE v.estrelas IS NOT NULL
            GROUP BY p.nome
            HAVING COUNT(DISTINCT v.idPelada) > 0
        """;
        
        return jdbc.query(sql, (rs, rowNum) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("jogador", rs.getString("jogador"));
            item.put("numeroPeladas", rs.getInt("numeroPeladas"));
            item.put("mediaEstrelas", rs.getDouble("mediaEstrelas"));
            return item;
        });
    }

    // ========== GRÁFICO 6: PERFIL TOP 5 JOGADORES (RADAR) ==========
    
    @GetMapping("/graficos/perfil-top-jogadores")
    public List<Map<String, Object>> getPerfilTopJogadores() {
        String sql = """
            SELECT 
                p.nome as jogador,
                COALESCE(SUM(est.gols), 0) as gols,
                COALESCE(SUM(est.assistencias), 0) as assistencias,
                COALESCE(AVG(v.estrelas), 0) as estrelas,
                ROUND(
                    (COUNT(CASE WHEN i.statusConfirmacao = 'Confirmado' THEN 1 END) * 100.0) / 
                    NULLIF(COUNT(i.idInscricao), 0), 2
                ) as presenca,
                COUNT(DISTINCT v.idPelada) as peladas
            FROM Pessoa p
            JOIN Jogador j ON p.idPessoa = j.idPessoa
            LEFT JOIN VinculoJogadorPelada v ON j.idJogador = v.idJogador
            LEFT JOIN Inscricao i ON j.idJogador = i.idJogador
            LEFT JOIN Estatisticas est ON j.idJogador = est.idJogador
            GROUP BY p.nome
            ORDER BY gols DESC, assistencias DESC
            LIMIT 5
        """;
        
        return jdbc.query(sql, (rs, rowNum) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("jogador", rs.getString("jogador"));
            item.put("gols", rs.getInt("gols"));
            item.put("assistencias", rs.getInt("assistencias"));
            item.put("estrelas", rs.getDouble("estrelas"));
            item.put("presenca", rs.getDouble("presenca"));
            item.put("peladas", rs.getInt("peladas"));
            return item;
        });
    }

    // ========== ESTATÍSTICAS DESCRITIVAS ==========
    
    @GetMapping("/estatisticas/descritivas")
    public Map<String, Object> getEstatisticasDescritivas() {
        Map<String, Object> stats = new HashMap<>();
        
        // Estatísticas de Gols
        try {
            Map<String, Object> golsStats = jdbc.queryForMap("""
                SELECT 
                    AVG(gols) as media,
                    STDDEV(gols) as desvio_padrao,
                    MIN(gols) as minimo,
                    MAX(gols) as maximo,
                    VARIANCE(gols) as variancia
                FROM (
                    SELECT COALESCE(SUM(gols), 0) as gols
                    FROM Estatisticas
                    GROUP BY idJogador
                ) subquery
            """);
            stats.put("gols", golsStats);
        } catch (Exception e) {
            stats.put("gols", null);
        }
        
        // Estatísticas de Valores de Pagamento
        try {
            Map<String, Object> pagamentosStats = jdbc.queryForMap("""
                SELECT 
                    AVG(valor) as media,
                    STDDEV(valor) as desvio_padrao,
                    MIN(valor) as minimo,
                    MAX(valor) as maximo,
                    VARIANCE(valor) as variancia
                FROM Pagamento
                WHERE status = 'Pago'
            """);
            stats.put("pagamentos", pagamentosStats);
        } catch (Exception e) {
            stats.put("pagamentos", null);
        }
        
        // Distribuição de Frequência de Presenças
        List<Map<String, Object>> distribuicaoPresenca = jdbc.query("""
            SELECT 
                CASE 
                    WHEN percentual >= 80 THEN '80-100%'
                    WHEN percentual >= 60 THEN '60-79%'
                    WHEN percentual >= 40 THEN '40-59%'
                    WHEN percentual >= 20 THEN '20-39%'
                    ELSE '0-19%'
                END as faixa,
                COUNT(*) as quantidade
            FROM (
                SELECT 
                    j.idJogador,
                    ROUND(
                        (COUNT(CASE WHEN i.statusConfirmacao = 'Confirmado' THEN 1 END) * 100.0) / 
                        NULLIF(COUNT(i.idInscricao), 0), 2
                    ) as percentual
                FROM Jogador j
                LEFT JOIN Inscricao i ON j.idJogador = i.idJogador
                GROUP BY j.idJogador
                HAVING COUNT(i.idInscricao) > 0
            ) subquery
            GROUP BY faixa
            ORDER BY faixa DESC
        """, (rs, rowNum) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("faixa", rs.getString("faixa"));
            item.put("quantidade", rs.getInt("quantidade"));
            return item;
        });
        stats.put("distribuicaoPresenca", distribuicaoPresenca);
        
        return stats;
    }
}

