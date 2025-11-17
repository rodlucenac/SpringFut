package springfut.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import springfut.model.Inscricao;
import springfut.model.Pagamento;
import springfut.repository.InscricaoRepository;
import springfut.repository.PagamentoRepository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {
    private static final Set<String> FORMAS_VALIDAS = Set.of("PIX", "Dinheiro", "Cartao");
    private static final Set<String> STATUS_VALIDOS = Set.of("Pago", "Pendente", "Atrasado");

    private final PagamentoRepository repo;
    private final InscricaoRepository inscricaoRepository;
    private final JdbcTemplate jdbc;

    public PagamentoController(PagamentoRepository repo, InscricaoRepository inscricaoRepository, JdbcTemplate jdbc) {
        this.repo = repo;
        this.inscricaoRepository = inscricaoRepository;
        this.jdbc = jdbc;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Pagamento pagamento) {
        ResponseEntity<?> validacao = validarPagamento(pagamento, false);
        if (validacao != null) {
            return validacao;
        }

        if (pagamento.getData() == null) {
            pagamento.setData(LocalDate.now());
        }

        Pagamento criado = repo.inserir(pagamento);
        confirmarInscricaoSePago(criado);
        return ResponseEntity.ok(criado);
    }

    @GetMapping
    public List<Pagamento> listar(
            @RequestParam(value = "idJogador", required = false) Integer idJogador,
            @RequestParam(value = "idRodada", required = false) Integer idRodada
    ) {
        if (idJogador != null) {
            return repo.listarPorJogador(idJogador);
        }
        if (idRodada != null) {
            return repo.listarPorRodada(idRodada);
        }
        return repo.listar();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable int id, @RequestBody Pagamento pagamento) {
        Pagamento existente = repo.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        pagamento.setIdPagamento(id);
        ResponseEntity<?> validacao = validarPagamento(pagamento, true);
        if (validacao != null) {
            return validacao;
        }

        if (pagamento.getData() == null) {
            pagamento.setData(LocalDate.now());
        }

        repo.atualizar(pagamento);
        confirmarInscricaoSePago(pagamento);
        return ResponseEntity.ok(Map.of("mensagem", "Pagamento atualizado com sucesso"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable int id) {
        Pagamento existente = repo.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        repo.deletar(id);
        return ResponseEntity.ok(Map.of("mensagem", "Pagamento removido com sucesso"));
    }

    private ResponseEntity<?> validarPagamento(Pagamento pagamento, boolean atualizacao) {
        if (pagamento.getIdJogador() <= 0 || pagamento.getIdRodada() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("erro", "idJogador e idRodada são obrigatórios"));
        }
        if (!repo.existeJogador(pagamento.getIdJogador())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Jogador não encontrado"));
        }
        if (!repo.existeRodada(pagamento.getIdRodada())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Rodada não encontrada"));
        }
        if (!inscricaoRepository.existePorJogadorERodada(pagamento.getIdJogador(), pagamento.getIdRodada())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "É necessário se inscrever antes de pagar"));
        }

        if (pagamento.getValor() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Informe um valor válido"));
        }

        if (pagamento.getForma() == null || pagamento.getForma().isBlank()) {
            pagamento.setForma("PIX");
        } else if (!FORMAS_VALIDAS.contains(pagamento.getForma())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Forma de pagamento inválida"));
        }

        if (pagamento.getStatus() == null || pagamento.getStatus().isBlank()) {
            pagamento.setStatus("Pago");
        } else if (!STATUS_VALIDOS.contains(pagamento.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Status de pagamento inválido"));
        }

        return null;
    }

    private void confirmarInscricaoSePago(Pagamento pagamento) {
        if (!"Pago".equalsIgnoreCase(pagamento.getStatus())) {
            return;
        }
        Inscricao inscricao = inscricaoRepository.buscarPorJogadorERodada(
                pagamento.getIdJogador(),
                pagamento.getIdRodada()
        );
        if (inscricao != null && !"Confirmado".equalsIgnoreCase(inscricao.getStatusConfirmacao())) {
            inscricao.setStatusConfirmacao("Confirmado");
            inscricao.setDataResposta(LocalDate.now());
            inscricaoRepository.atualizar(inscricao);
        }
    }

    // ========== TRIGGER: trg_pagamento_insert_log ==========
    // Auditoria de pagamentos consultando diretamente a tabela Pagamento
    
    @GetMapping("/logs")
    public ResponseEntity<?> listarLogsAuditoria(
        @RequestParam(required = false) Integer idJogador,
        @RequestParam(required = false) Integer idRodada
    ) {
        try {
            // Consulta diretamente a tabela Pagamento para auditoria
            // Não é necessária tabela PagamentoLog, pois Pagamento já contém todos os dados
            StringBuilder sql = new StringBuilder(
                "SELECT " +
                "p.idPagamento, " +
                "p.idJogador, " +
                "p.idRodada, " +
                "p.valor, " +
                "p.status, " +
                "p.forma, " +
                "p.data, " +
                "CONCAT(pe.nome, ' - ', r.data) AS observacao " +
                "FROM Pagamento p " +
                "LEFT JOIN Jogador j ON j.idJogador = p.idJogador " +
                "LEFT JOIN Pessoa pe ON pe.idPessoa = j.idPessoa " +
                "LEFT JOIN Rodada r ON r.idRodada = p.idRodada " +
                "WHERE 1=1"
            );
            List<Object> params = new ArrayList<>();
            
            if (idJogador != null) {
                sql.append(" AND p.idJogador = ?");
                params.add(idJogador);
            }
            
            if (idRodada != null) {
                sql.append(" AND p.idRodada = ?");
                params.add(idRodada);
            }
            
            sql.append(" ORDER BY p.data DESC, p.idPagamento DESC");
            
            List<Map<String, Object>> logs = jdbc.query(
                sql.toString(),
                ps -> {
                    for (int i = 0; i < params.size(); i++) {
                        ps.setObject(i + 1, params.get(i));
                    }
                },
                (rs, rowNum) -> {
                    Map<String, Object> log = new HashMap<>();
                    log.put("idLog", rs.getInt("idPagamento")); // Usando idPagamento como idLog para compatibilidade
                    log.put("idPagamento", rs.getInt("idPagamento"));
                    log.put("idJogador", rs.getInt("idJogador"));
                    log.put("idRodada", rs.getInt("idRodada"));
                    log.put("valor", rs.getBigDecimal("valor"));
                    log.put("status", rs.getString("status"));
                    log.put("forma", rs.getString("forma"));
                    // Converter data para timestamp para compatibilidade com frontend
                    java.sql.Date dataSql = rs.getDate("data");
                    if (dataSql != null) {
                        log.put("dataEvento", java.sql.Timestamp.valueOf(dataSql.toLocalDate().atStartOfDay()));
                    } else {
                        log.put("dataEvento", null);
                    }
                    log.put("observacao", rs.getString("observacao") != null ? rs.getString("observacao") : "Pagamento registrado");
                    return log;
                }
            );
            
            return ResponseEntity.ok(logs);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("erro", "Erro ao buscar auditoria de pagamentos: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName())));
        }
    }

    @GetMapping("/demonstrar-trigger")
    public ResponseEntity<?> demonstrarTrigger() {
        return ResponseEntity.ok(Map.of(
            "trigger", "trg_pagamento_insert_log",
            "descricao", "Trigger AFTER INSERT na tabela Pagamento (demonstração)",
            "tipo", "AFTER INSERT",
            "tabela", "Pagamento",
            "efeito", "Pode ser usado para validações adicionais ou notificações",
            "auditoria", "A auditoria de pagamentos é feita consultando diretamente a tabela Pagamento, que já contém todos os dados necessários",
            "visualizacao", "GET /api/pagamentos/logs"
        ));
    }
}
