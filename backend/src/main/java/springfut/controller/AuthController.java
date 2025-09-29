package springfut.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final JdbcTemplate jdbc;

    public AuthController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String senha = body.get("senha");
        try {
            // Primeiro, buscar a pessoa
            String sqlPessoa = "SELECT idPessoa, senha FROM Pessoa WHERE email = ?";
            Map<String, Object> pessoa = jdbc.queryForMap(sqlPessoa, email);
            String senhaDb = (String) pessoa.get("senha");
            Integer idPessoa = (Integer) pessoa.get("idPessoa");
            
            if (senhaDb != null && senhaDb.equals(senha)) { // Para produção, use hash!
                // Verificar se existe jogador vinculado
                String sqlJogador = "SELECT idJogador FROM Jogador WHERE idPessoa = ?";
                try {
                    Integer idJogador = jdbc.queryForObject(sqlJogador, Integer.class, idPessoa);
                    return ResponseEntity.ok().body(Map.of("userId", idJogador));
                } catch (Exception e) {
                    // Se não existe jogador, criar automaticamente
                    String sqlCriarJogador = "INSERT INTO Jogador (idPessoa) VALUES (?)";
                    jdbc.update(sqlCriarJogador, idPessoa);
                    Integer novoIdJogador = jdbc.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
                    return ResponseEntity.ok().body(Map.of("userId", novoIdJogador));
                }
            }
            return ResponseEntity.status(401).body(Map.of("erro", "Usuário ou senha inválidos"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("erro", "Usuário ou senha inválidos"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String nome = body.get("nome");
        String email = body.get("email");
        String senha = body.get("senha");
        if (nome == null || email == null || senha == null) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Dados obrigatórios ausentes"));
        }
        try {
            // 1. Cria Pessoa
            String sqlPessoa = "INSERT INTO Pessoa (nome, email, senha) VALUES (?, ?, ?)";
            jdbc.update(sqlPessoa, nome, email, senha);
            Integer idPessoa = jdbc.queryForObject("SELECT idPessoa FROM Pessoa WHERE email = ?", Integer.class, email);
            // 2. Cria Jogador vinculado à Pessoa
            String sqlJogador = "INSERT INTO Jogador (idPessoa) VALUES (?)";
            jdbc.update(sqlJogador, idPessoa);
            return ResponseEntity.ok().body(Map.of("mensagem", "Cadastro realizado com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("erro", "Erro ao cadastrar: " + e.getMessage()));
        }
    }
}
