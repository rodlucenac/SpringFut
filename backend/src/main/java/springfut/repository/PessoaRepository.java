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

    public void atualizar(Pessoa p) {
        jdbc.update("UPDATE Pessoa SET nome=?, telefoneDDD=?, telefoneNumero=?, email=?, senha=? WHERE idPessoa=?",
                p.getNome(), p.getTelefoneDDD(), p.getTelefoneNumero(), p.getEmail(), p.getSenha(), p.getIdPessoa());
    }

    public void deletar(int id) {
        jdbc.update("DELETE FROM Pessoa WHERE idPessoa=?", id);
    }
}