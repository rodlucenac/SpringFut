package springfut.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfut.repository.ConsultaRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {
    private final ConsultaRepository repo;
    private final JdbcTemplate jdbc;

    public ConsultaController(ConsultaRepository repo, JdbcTemplate jdbc) {
        this.repo = repo;
        this.jdbc = jdbc;
    }

    // ========== CONSULTAS OBRIGATÓRIAS PARA ENTREGA ==========

    @GetMapping("/jogadores-posicao")
    public List<Map<String,Object>> jogadoresComPosicao() { 
        return repo.jogadoresComPosicao(); 
    }

    @GetMapping("/peladas-estatisticas")
    public List<Map<String,Object>> peladasComEstatisticas() { 
        return repo.peladasComEstatisticas(); 
    }

    @GetMapping("/ranking-jogadores")
    public List<Map<String,Object>> rankingJogadores() { 
        return repo.rankingJogadores(); 
    }

    @GetMapping("/analise-financeira")
    public List<Map<String,Object>> analiseFinanceira() { 
        return repo.analiseFinanceira(); 
    }

    // ========== CONSULTAS AUXILIARES ==========

    @GetMapping("/rodadas-futuras")
    public List<Map<String,Object>> rodadasFuturas() { 
        return repo.rodadasFuturas(); 
    }

    @GetMapping("/arrecadado-rodada")
    public List<Map<String,Object>> valorArrecadadoPorRodada() { 
        return repo.valorArrecadadoPorRodada(); 
    }

    // ========== FUNÇÃO SQL: fn_valor_faltante_rodada ==========
    
    @GetMapping("/rodadas/{idRodada}/valor-faltante")
    public ResponseEntity<?> getValorFaltante(@PathVariable int idRodada) {
        try {
            String sql = "SELECT fn_valor_faltante_rodada(?) AS valorFaltante";
            
            BigDecimal valorFaltante = jdbc.queryForObject(
                sql, 
                BigDecimal.class, 
                idRodada
            );
            
            // Buscar valor total da pelada para contexto
            String sqlTotal = """
                SELECT p.valorTotal 
                FROM Rodada r 
                JOIN Pelada p ON p.idPelada = r.idPelada 
                WHERE r.idRodada = ?
            """;
            
            BigDecimal valorTotal = jdbc.queryForObject(
                sqlTotal, 
                BigDecimal.class, 
                idRodada
            );
            
            BigDecimal valorPago = valorTotal.subtract(valorFaltante);
            double percentualPago = valorTotal.compareTo(BigDecimal.ZERO) > 0 
                ? valorPago.multiply(BigDecimal.valueOf(100))
                           .divide(valorTotal, 2, RoundingMode.HALF_UP)
                           .doubleValue()
                : 0.0;
            
            return ResponseEntity.ok(Map.of(
                "idRodada", idRodada,
                "valorTotal", valorTotal,
                "valorPago", valorPago,
                "valorFaltante", valorFaltante,
                "percentualPago", percentualPago
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("erro", "Erro ao calcular valor faltante: " + e.getMessage()));
        }
    }

    // ========== VIEWS ==========
    
    @GetMapping("/views/agenda-peladas")
    public ResponseEntity<?> getAgendaPeladas(
        @RequestParam(required = false) String dataInicio,
        @RequestParam(required = false) String dataFim
    ) {
        try {
            StringBuilder sql = new StringBuilder(
                "SELECT * FROM vw_agenda_peladas_organizadores WHERE 1=1"
            );
            List<Object> params = new ArrayList<>();
            
            if (dataInicio != null) {
                sql.append(" AND data >= ?");
                params.add(LocalDate.parse(dataInicio));
            }
            
            if (dataFim != null) {
                sql.append(" AND data <= ?");
                params.add(LocalDate.parse(dataFim));
            }
            
            sql.append(" ORDER BY data, horario");
            
            List<Map<String, Object>> agenda = jdbc.query(
                sql.toString(),
                ps -> {
                    for (int i = 0; i < params.size(); i++) {
                        ps.setObject(i + 1, params.get(i));
                    }
                },
                (rs, rowNum) -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("idRodada", rs.getInt("idRodada"));
                    // Converter Date para String ISO
                    java.sql.Date dataSql = rs.getDate("data");
                    item.put("data", dataSql != null ? dataSql.toString() : null);
                    item.put("diaSemana", rs.getString("diaSemana"));
                    // Converter Time para String
                    java.sql.Time horarioSql = rs.getTime("horario");
                    item.put("horario", horarioSql != null ? horarioSql.toString() : null);
                    item.put("valorTotal", rs.getBigDecimal("valorTotal"));
                    item.put("rua", rs.getString("rua"));
                    item.put("bairro", rs.getString("bairro"));
                    item.put("nomeOrganizador", rs.getString("nomeOrganizador"));
                    item.put("contatoOrganizador", rs.getString("contatoOrganizador"));
                    item.put("confirmados", rs.getInt("confirmados"));
                    item.put("pendentes", rs.getInt("pendentes"));
                    item.put("ausentes", rs.getInt("ausentes"));
                    return item;
                }
            );
            
            return ResponseEntity.ok(agenda);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("erro", "Erro ao buscar agenda: " + e.getMessage()));
        }
    }

    @GetMapping("/views/jogador-resumo")
    public ResponseEntity<?> getResumoJogadores(
        @RequestParam(required = false) Integer idJogador
    ) {
        try {
            StringBuilder sql = new StringBuilder(
                "SELECT * FROM vw_jogador_resumo_financeiro WHERE 1=1"
            );
            List<Object> params = new ArrayList<>();
            
            if (idJogador != null) {
                sql.append(" AND idJogador = ?");
                params.add(idJogador);
            }
            
            sql.append(" ORDER BY totalGols DESC, totalAssistencias DESC");
            
            List<Map<String, Object>> resumos = jdbc.query(
                sql.toString(),
                ps -> {
                    for (int i = 0; i < params.size(); i++) {
                        ps.setObject(i + 1, params.get(i));
                    }
                },
                (rs, rowNum) -> {
                    Map<String, Object> resumo = new HashMap<>();
                    resumo.put("idJogador", rs.getInt("idJogador"));
                    resumo.put("nome", rs.getString("nome"));
                    resumo.put("email", rs.getString("email"));
                    resumo.put("peladasParticipadas", rs.getInt("peladasParticipadas"));
                    resumo.put("rodadasCobradas", rs.getInt("rodadasCobradas"));
                    resumo.put("totalPago", rs.getBigDecimal("totalPago"));
                    resumo.put("totalPendente", rs.getBigDecimal("totalPendente"));
                    resumo.put("totalAtrasado", rs.getBigDecimal("totalAtrasado"));
                    resumo.put("mediaEstrelas", rs.getBigDecimal("mediaEstrelas"));
                    resumo.put("totalGols", rs.getInt("totalGols"));
                    resumo.put("totalAssistencias", rs.getInt("totalAssistencias"));
                    return resumo;
                }
            );
            
            return ResponseEntity.ok(resumos);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("erro", "Erro ao buscar resumos: " + e.getMessage()));
        }
    }
}