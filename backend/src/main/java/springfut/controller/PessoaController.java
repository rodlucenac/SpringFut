package springfut.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import springfut.model.Pessoa;
import springfut.repository.PessoaRepository;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pessoas")
public class PessoaController {
    private final PessoaRepository repo;
    private final JdbcTemplate jdbc;

    public PessoaController(PessoaRepository repo, JdbcTemplate jdbc) {
        this.repo = repo;
        this.jdbc = jdbc;
    }

    @PostMapping
    public void criar(@RequestBody Pessoa p) { repo.inserir(p); }

    @GetMapping
    public List<Pessoa> listar() { return repo.listar(); }

    @GetMapping("/{id}")
    public Pessoa buscarPorId(@PathVariable int id) { 
        return repo.buscarPorId(id); 
    }

    @PutMapping("/{id}")
    public void atualizar(@PathVariable int id, @RequestBody Pessoa p) { 
        p.setIdPessoa(id);
        repo.atualizar(p); 
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) { repo.deletar(id); }

    @GetMapping("/jogador/{idJogador}")
    public ResponseEntity<?> buscarPorIdJogador(@PathVariable int idJogador) {
        try {
            // Primeiro buscar o idPessoa do jogador
            String sqlIdPessoa = "SELECT idPessoa FROM Jogador WHERE idJogador = ?";
            Integer idPessoa = jdbc.queryForObject(sqlIdPessoa, Integer.class, idJogador);
            
            // Depois buscar os dados da pessoa
            Pessoa pessoa = repo.buscarPorId(idPessoa);
            if (pessoa != null) {
                return ResponseEntity.ok(pessoa);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao buscar pessoa: " + e.getMessage()));
        }
    }

    @PutMapping("/jogador/{idJogador}")
    public ResponseEntity<?> atualizarPorIdJogador(@PathVariable int idJogador, @RequestBody Pessoa pessoa) {
        try {
            
            String sqlIdPessoa = "SELECT idPessoa FROM Jogador WHERE idJogador = ?";
            Integer idPessoa = jdbc.queryForObject(sqlIdPessoa, Integer.class, idJogador);
            
           
            pessoa.setIdPessoa(idPessoa);
            repo.atualizar(pessoa);
            return ResponseEntity.ok(Map.of("mensagem", "Perfil atualizado com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao atualizar perfil: " + e.getMessage()));
        }
    }

    @DeleteMapping("/jogador/{idJogador}")
    public ResponseEntity<?> excluirPorIdJogador(@PathVariable int idJogador) {
        try {
            // Primeiro buscar o idPessoa do jogador
            String sqlIdPessoa = "SELECT idPessoa FROM Jogador WHERE idJogador = ?";
            Integer idPessoa = jdbc.queryForObject(sqlIdPessoa, Integer.class, idJogador);
            
            // Excluir a pessoa (que excluirá em cascata)
            repo.deletar(idPessoa);
            return ResponseEntity.ok(Map.of("mensagem", "Perfil excluído com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao excluir perfil: " + e.getMessage()));
        }
    }
}