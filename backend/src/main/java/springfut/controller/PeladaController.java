package springfut.controller;

import org.springframework.dao.DataAccessException;
import org.springframework.web.bind.annotation.*;
import springfut.model.Pelada;
import springfut.repository.PeladaRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/peladas")
public class PeladaController {
    private final PeladaRepository repo;
    private final JdbcTemplate jdbc;

    public PeladaController(PeladaRepository repo, JdbcTemplate jdbc) {
        this.repo = repo;
        this.jdbc = jdbc;
    }

    @PostMapping
    public ResponseEntity<?> criarPelada(@RequestBody Map<String, Object> body) {
        try {
            // O campo 'nome' não é usado na tabela Pelada, mas pode ser usado para customização futura
            String endereco = (String) body.getOrDefault("endereco", "");
            String bairro = (String) body.getOrDefault("bairro", "");
            String diaSemana = (String) body.getOrDefault("diaSemana", "");
            String horario = (String) body.getOrDefault("horario", "");
            int limiteMensalistas = (int) body.getOrDefault("limiteMensalistas", 20);
            double valorTotal = Double.parseDouble(body.getOrDefault("valorTotal", 0).toString());
            int organizadorId = Integer.parseInt(body.getOrDefault("organizadorId", 0).toString());
            Object dataRodadaObj = body.getOrDefault("primeiraRodada", null);

            LocalDate dataPrimeiraRodada;
            if (dataRodadaObj instanceof String dataRodadaStr && !dataRodadaStr.isBlank()) {
                dataPrimeiraRodada = LocalDate.parse(dataRodadaStr);
            } else {
                dataPrimeiraRodada = LocalDate.now();
            }

            // 1. Criar endereço
            String sqlEndereco = "INSERT INTO Endereco (rua, bairro) VALUES (?, ?)";
            jdbc.update(sqlEndereco, endereco, bairro);
            Integer idEndereco = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);

            // 2. Criar pelada
            String sqlPelada = "INSERT INTO Pelada (diaSemana, horario, valorTotal, limiteMensalistas, idEndereco) VALUES (?, ?, ?, ?, ?)";
            jdbc.update(sqlPelada, diaSemana, horario, valorTotal, limiteMensalistas, idEndereco);
            Integer idPelada = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);

            // 3. Vincular organizador como admin da pelada
            String sqlVinculo = "INSERT INTO VinculoJogadorPelada (idJogador, idPelada, estrelas, tipoParticipacao, papelNaPelada) VALUES (?, ?, 5, 'Mensalista', 'Organizador')";
            jdbc.update(sqlVinculo, organizadorId, idPelada);

            // 4. Criar ao menos uma rodada para a nova pelada
            String sqlRodada = "INSERT INTO Rodada (idPelada, data) VALUES (?, ?)";
            jdbc.update(sqlRodada, idPelada, Date.valueOf(dataPrimeiraRodada));

            return ResponseEntity.ok(Map.of("mensagem", "Pelada criada com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("erro", "Erro ao criar pelada: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable int id) {
        try {
            String sql = "SELECT p.*, e.rua, e.bairro FROM Pelada p " +
                        "LEFT JOIN Endereco e ON p.idEndereco = e.idEndereco " +
                        "WHERE p.idPelada = ?";
            
            List<Map<String, Object>> resultado = jdbc.query(sql, ps -> ps.setInt(1, id), (rs, rowNum) -> {
                Map<String, Object> pelada = new java.util.HashMap<>();
                pelada.put("idPelada", rs.getInt("idPelada"));
                pelada.put("diaSemana", rs.getString("diaSemana"));
                pelada.put("horario", rs.getTime("horario"));
                pelada.put("valorTotal", rs.getDouble("valorTotal"));
                pelada.put("limiteMensalistas", rs.getInt("limiteMensalistas"));
                pelada.put("tempoConfMensalista", rs.getInt("tempoConfMensalista"));
                pelada.put("tempoConfDiarista", rs.getInt("tempoConfDiarista"));
                pelada.put("endereco", rs.getString("rua"));
                pelada.put("bairro", rs.getString("bairro"));
                return pelada;
            });
            
            if (resultado.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(resultado.get(0));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("erro", "Erro ao buscar pelada: " + e.getMessage()));
        }
    }

    @GetMapping
    public List<Pelada> listar(@RequestParam(value = "organizadorId", required = false) Integer organizadorId) {
        if (organizadorId != null) {
            // Busca apenas peladas onde o usuário é organizador (VinculoJogadorPelada com papelNaPelada = 'Organizador')
            String sql = "SELECT p.* FROM Pelada p " +
                         "JOIN VinculoJogadorPelada v ON v.idPelada = p.idPelada " +
                         "WHERE v.idJogador = ? AND v.papelNaPelada = 'Organizador'";
            return jdbc.query(sql, ps -> ps.setInt(1, organizadorId), (rs, rowNum) -> {
                Pelada pelada = new Pelada();
                pelada.setIdPelada(rs.getInt("idPelada"));
                pelada.setDiaSemana(rs.getString("diaSemana"));
                pelada.setHorario(rs.getTime("horario").toLocalTime());
                pelada.setValorTotal(rs.getDouble("valorTotal"));
                pelada.setLimiteMensalistas(rs.getInt("limiteMensalistas"));
                pelada.setTempoConfMensalista(rs.getInt("tempoConfMensalista"));
                pelada.setTempoConfDiarista(rs.getInt("tempoConfDiarista"));
                return pelada;
            });
        } else {
            return repo.listar();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable int id, @RequestBody Map<String, Object> body) {
        try {
            String diaSemana = (String) body.getOrDefault("diaSemana", "");
            String horario = (String) body.getOrDefault("horario", "");
            int limiteMensalistas = (int) body.getOrDefault("limiteMensalistas", 20);
            double valorTotal = Double.parseDouble(body.getOrDefault("valorTotal", 0).toString());
            int organizadorId = Integer.parseInt(body.getOrDefault("organizadorId", 0).toString());

            // Verificar se o usuário é o organizador da pelada
            String sqlVerificacao = "SELECT COUNT(*) FROM VinculoJogadorPelada " +
                                  "WHERE idPelada = ? AND idJogador = ? AND papelNaPelada = 'Organizador'";
            int count = jdbc.queryForObject(sqlVerificacao, Integer.class, id, organizadorId);
            
            if (count == 0) {
                return ResponseEntity.status(403).body(Map.of("erro", "Apenas o organizador pode editar esta pelada"));
            }

            // Atualizar pelada
            String sqlPelada = "UPDATE Pelada SET diaSemana=?, horario=?, valorTotal=?, limiteMensalistas=? WHERE idPelada=?";
            jdbc.update(sqlPelada, diaSemana, horario, valorTotal, limiteMensalistas, id);

            // Atualizar endereço se fornecido
            if (body.containsKey("endereco") || body.containsKey("bairro")) {
                String endereco = (String) body.getOrDefault("endereco", "");
                String bairro = (String) body.getOrDefault("bairro", "");
                
                // Buscar idEndereco da pelada
                String sqlBuscarEndereco = "SELECT idEndereco FROM Pelada WHERE idPelada = ?";
                Integer idEndereco = jdbc.queryForObject(sqlBuscarEndereco, Integer.class, id);
                
                if (idEndereco != null) {
                    String sqlEndereco = "UPDATE Endereco SET rua=?, bairro=? WHERE idEndereco=?";
                    jdbc.update(sqlEndereco, endereco, bairro, idEndereco);
                }
            }

            return ResponseEntity.ok(Map.of("mensagem", "Pelada atualizada com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("erro", "Erro ao atualizar pelada: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable int id) {
        try {
            System.out.println("Tentando excluir pelada com ID: " + id);
            repo.deletar(id);
            System.out.println("Pelada excluída com sucesso!");
            return ResponseEntity.ok(Map.of("mensagem", "Pelada excluída com sucesso!"));
        } catch (Exception e) {
            System.err.println("Erro ao excluir pelada: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400).body(Map.of("erro", "Erro ao excluir pelada: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/rodadas")
    public ResponseEntity<?> listarRodadas(@PathVariable int id) {
        try {
            String sql = "SELECT idRodada, data FROM Rodada WHERE idPelada = ? ORDER BY data";
            List<Map<String, Object>> rodadas = jdbc.query(sql, ps -> ps.setInt(1, id), (rs, rowNum) -> {
                Map<String, Object> rodada = new java.util.HashMap<>();
                rodada.put("idRodada", rs.getInt("idRodada"));
                java.sql.Date data = rs.getDate("data");
                rodada.put("data", data != null ? data.toLocalDate() : null);
                return rodada;
            });
            return ResponseEntity.ok(rodadas);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("erro", "Erro ao listar rodadas: " + e.getMessage()));
        }
    }

    // ========== PROCEDIMENTO SQL: sp_promover_fila_para_mensalista ==========
    
    @PostMapping("/{idPelada}/promover-fila")
    public ResponseEntity<?> promoverFilaParaMensalista(@PathVariable int idPelada) {
        try {
            String sql = "CALL sp_promover_fila_para_mensalista(?)";
            
            List<Map<String, Object>> resultado = jdbc.query(
                sql,
                ps -> ps.setInt(1, idPelada),
                (rs, rowNum) -> {
                    Map<String, Object> map = new HashMap<>();
                    // A procedure pode retornar valores via SELECT ou OUT parameters
                    // Ajustar conforme a implementação real da procedure
                    try {
                        map.put("jogadoresPromovidos", rs.getInt("jogadores_promovidos"));
                        map.put("vagasRestantes", rs.getInt("vagas_restantes"));
                    } catch (Exception e) {
                        // Se a procedure não retorna resultados, usar valores padrão
                        map.put("jogadoresPromovidos", 0);
                        map.put("vagasRestantes", 0);
                    }
                    return map;
                }
            );
            
            if (resultado.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "mensagem", "Nenhum jogador promovido",
                    "jogadoresPromovidos", 0,
                    "vagasRestantes", 0
                ));
            }
            
            Map<String, Object> dados = resultado.get(0);
            
            return ResponseEntity.ok(Map.of(
                "mensagem", "Promoção realizada com sucesso",
                "jogadoresPromovidos", dados.get("jogadoresPromovidos"),
                "vagasRestantes", dados.get("vagasRestantes")
            ));
            
        } catch (DataAccessException e) {
            if (e.getMessage().contains("Pelada não encontrada")) {
                return ResponseEntity.status(404)
                    .body(Map.of("erro", "Pelada não encontrada"));
            }
            return ResponseEntity.status(500)
                .body(Map.of("erro", "Erro ao promover jogadores: " + e.getMessage()));
        }
    }
}
