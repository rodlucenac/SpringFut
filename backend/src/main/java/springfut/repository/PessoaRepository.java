package springfut.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import springfut.model.Pessoa;

import java.util.List;

@Repository
public class PessoaRepository {
    private final JdbcTemplate jdbc;

    public PessoaRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void inserir(Pessoa p) {
        jdbc.update("INSERT INTO Pessoa (nome, telefoneDDD, telefoneNumero, email, senha) VALUES (?, ?, ?, ?, ?)",
                p.getNome(), p.getTelefoneDDD(), p.getTelefoneNumero(), p.getEmail(), p.getSenha());
    }

    public List<Pessoa> listar() {
        return jdbc.query("SELECT * FROM Pessoa",
                (rs, rowNum) -> {
                    Pessoa p = new Pessoa();
                    p.setIdPessoa(rs.getInt("idPessoa"));
                    p.setNome(rs.getString("nome"));
                    p.setTelefoneDDD(rs.getString("telefoneDDD"));
                    p.setTelefoneNumero(rs.getString("telefoneNumero"));
                    p.setEmail(rs.getString("email"));
                    p.setSenha(rs.getString("senha"));
                    return p;
                });
    }

    public Pessoa buscarPorId(int id) {
        List<Pessoa> pessoas = jdbc.query("SELECT * FROM Pessoa WHERE idPessoa = ?",
                ps -> ps.setInt(1, id),
                (rs, rowNum) -> {
                    Pessoa p = new Pessoa();
                    p.setIdPessoa(rs.getInt("idPessoa"));
                    p.setNome(rs.getString("nome"));
                    p.setTelefoneDDD(rs.getString("telefoneDDD"));
                    p.setTelefoneNumero(rs.getString("telefoneNumero"));
                    p.setEmail(rs.getString("email"));
                    // Não retornar senha por segurança
                    p.setSenha(null);
                    return p;
                });
        return pessoas.isEmpty() ? null : pessoas.get(0);
    }

    public void atualizar(Pessoa p) {
        String sql = "UPDATE Pessoa SET nome=?, telefoneDDD=?, telefoneNumero=?, email=?" + 
                     (p.getSenha() != null && !p.getSenha().isEmpty() ? ", senha=?" : "") + 
                     " WHERE idPessoa=?";
        
        if (p.getSenha() != null && !p.getSenha().isEmpty()) {
            jdbc.update(sql, p.getNome(), p.getTelefoneDDD(), p.getTelefoneNumero(), 
                       p.getEmail(), p.getSenha(), p.getIdPessoa());
        } else {
            jdbc.update(sql, p.getNome(), p.getTelefoneDDD(), p.getTelefoneNumero(), 
                       p.getEmail(), p.getIdPessoa());
        }
    }

    public void deletar(int id) {
        // Primeiro, buscar o idJogador correspondente à pessoa
        List<Integer> jogadorIds = jdbc.query(
            "SELECT idJogador FROM Jogador WHERE idPessoa = ?",
            ps -> ps.setInt(1, id),
            (rs, rowNum) -> rs.getInt("idJogador")
        );
        
        // Se existe jogador vinculado, fazer exclusão em cascata
        for (Integer idJogador : jogadorIds) {
            // 1. Excluir vínculos do jogador com peladas
            jdbc.update("DELETE FROM VinculoJogadorPelada WHERE idJogador = ?", idJogador);
            
            // 2. Excluir apelidos do jogador
            jdbc.update("DELETE FROM JogadorApelido WHERE idJogador = ?", idJogador);
            
            // 3. Excluir estatísticas do jogador (se houver)
            jdbc.update("DELETE FROM Estatisticas WHERE idJogador = ?", idJogador);
            
            // 4. Excluir inscrições do jogador (se houver)
            jdbc.update("DELETE FROM Inscricao WHERE idJogador = ?", idJogador);
            
            // 5. Excluir pagamentos do jogador (se houver)
            jdbc.update("DELETE FROM Pagamento WHERE idJogador = ?", idJogador);
            
            // 6. Excluir o jogador
            jdbc.update("DELETE FROM Jogador WHERE idJogador = ?", idJogador);
        }
        
        // 7. Excluir organizadores vinculados à pessoa
        jdbc.update("DELETE FROM Organizador WHERE idPessoa = ?", id);
        
        // 8. Finalmente, excluir a pessoa
        jdbc.update("DELETE FROM Pessoa WHERE idPessoa = ?", id);
    }
}