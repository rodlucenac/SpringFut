package springfut.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import springfut.model.Pagamento;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class PagamentoRepository {
    private final JdbcTemplate jdbc;

    private final RowMapper<Pagamento> mapper = (rs, rowNum) -> {
        Pagamento pagamento = new Pagamento();
        pagamento.setIdPagamento(rs.getInt("idPagamento"));
        pagamento.setIdJogador(rs.getInt("idJogador"));
        pagamento.setIdRodada(rs.getInt("idRodada"));
        pagamento.setValor(rs.getDouble("valor"));
        pagamento.setForma(rs.getString("forma"));
        pagamento.setStatus(rs.getString("status"));
        Date data = rs.getDate("data");
        if (data != null) {
            pagamento.setData(data.toLocalDate());
        }
        return pagamento;
    };

    public PagamentoRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Pagamento inserir(Pagamento pagamento) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO Pagamento (idJogador, idRodada, valor, forma, status, data) VALUES (?, ?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setInt(1, pagamento.getIdJogador());
            ps.setInt(2, pagamento.getIdRodada());
            ps.setDouble(3, pagamento.getValor());
            ps.setString(4, pagamento.getForma());
            ps.setString(5, pagamento.getStatus());
            ps.setDate(6, pagamento.getData() != null ? Date.valueOf(pagamento.getData()) : null);
            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            pagamento.setIdPagamento(keyHolder.getKey().intValue());
        }
        return pagamento;
    }

    public List<Pagamento> listar() {
        return jdbc.query("SELECT * FROM Pagamento", mapper);
    }

    public List<Pagamento> listarPorJogador(int idJogador) {
        return jdbc.query("SELECT * FROM Pagamento WHERE idJogador = ?", ps -> ps.setInt(1, idJogador), mapper);
    }

    public List<Pagamento> listarPorRodada(int idRodada) {
        return jdbc.query("SELECT * FROM Pagamento WHERE idRodada = ?", ps -> ps.setInt(1, idRodada), mapper);
    }

    public Pagamento buscarPorId(int id) {
        List<Pagamento> pagamentos = jdbc.query("SELECT * FROM Pagamento WHERE idPagamento = ?",
                ps -> ps.setInt(1, id), mapper);
        return pagamentos.isEmpty() ? null : pagamentos.get(0);
    }

    public void atualizar(Pagamento pagamento) {
        jdbc.update(
                "UPDATE Pagamento SET idJogador=?, idRodada=?, valor=?, forma=?, status=?, data=? WHERE idPagamento=?",
                pagamento.getIdJogador(),
                pagamento.getIdRodada(),
                pagamento.getValor(),
                pagamento.getForma(),
                pagamento.getStatus(),
                pagamento.getData() != null ? Date.valueOf(pagamento.getData()) : null,
                pagamento.getIdPagamento()
        );
    }

    public void deletar(int id) {
        jdbc.update("DELETE FROM Pagamento WHERE idPagamento = ?", id);
    }

    public boolean existeJogador(int idJogador) {
        Integer qtd = jdbc.queryForObject("SELECT COUNT(*) FROM Jogador WHERE idJogador = ?", Integer.class, idJogador);
        return qtd != null && qtd > 0;
    }

    public boolean existeRodada(int idRodada) {
        Integer qtd = jdbc.queryForObject("SELECT COUNT(*) FROM Rodada WHERE idRodada = ?", Integer.class, idRodada);
        return qtd != null && qtd > 0;
    }
}
