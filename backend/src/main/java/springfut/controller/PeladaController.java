package springfut.controller;

import org.springframework.web.bind.annotation.*;
import springfut.model.Pelada;
import springfut.repository.PeladaRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;

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

            return ResponseEntity.ok(Map.of("mensagem", "Pelada criada com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("erro", "Erro ao criar pelada: " + e.getMessage()));
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

    @PutMapping
    public void atualizar(@RequestBody Pelada p) { repo.atualizar(p); }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) { repo.deletar(id); }
}
