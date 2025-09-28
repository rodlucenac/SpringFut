package springfut.repository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class TesteRepository {
    private final JdbcTemplate jdbc;

    public TesteRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public int contarPessoas() {
        return jdbc.queryForObject("SELECT COUNT(*) FROM Pessoa", Integer.class);
    }
}