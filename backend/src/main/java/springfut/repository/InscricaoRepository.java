package springfut.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import springfut.model.Inscricao;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Types;
import java.util.List;

@Repository
public class InscricaoRepository {
    private final JdbcTemplate jdbc;

    private final RowMapper<Inscricao> mapper = (rs, rowNum) -> {
        Inscricao inscricao = new Inscricao();
        inscricao.setIdInscricao(rs.getInt("idInscricao"));
        inscricao.setIdJogador(rs.getInt("idJogador"));
        inscricao.setIdRodada(rs.getInt("idRodada"));
        inscricao.setStatusConfirmacao(rs.getString("statusConfirmacao"));

        Date dataResposta = rs.getDate("dataResposta");
        if (dataResposta != null) {
            inscricao.setDataResposta(dataResposta.toLocalDate());
        }
        return inscricao;
    };

    public InscricaoRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Inscricao inserir(Inscricao inscricao) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO Inscricao (idJogador, idRodada, statusConfirmacao, dataResposta) VALUES (?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, inscricao.getIdJogador());
            ps.setInt(2, inscricao.getIdRodada());
            ps.setString(3, inscricao.getStatusConfirmacao());

            if (inscricao.getDataResposta() != null) {
                ps.setDate(4, Date.valueOf(inscricao.getDataResposta()));
            } else {
                ps.setNull(4, Types.DATE);
            }

            return ps;
        }, keyHolder);

        if (keyHolder.getKey() != null) {
            inscricao.setIdInscricao(keyHolder.getKey().intValue());
        }
        return inscricao;
    }

    public List<Inscricao> listar() {
        return jdbc.query("SELECT * FROM Inscricao", mapper);
    }

    public List<Inscricao> listarPorRodada(int idRodada) {
        return jdbc.query("SELECT * FROM Inscricao WHERE idRodada = ?", ps -> ps.setInt(1, idRodada), mapper);
    }

    public List<Inscricao> listarPorJogador(int idJogador) {
        return jdbc.query("SELECT * FROM Inscricao WHERE idJogador = ?", ps -> ps.setInt(1, idJogador), mapper);
    }

    public Inscricao buscarPorId(int id) {
        List<Inscricao> inscricoes = jdbc.query(
                "SELECT * FROM Inscricao WHERE idInscricao = ?",
                ps -> ps.setInt(1, id),
                mapper
        );
        return inscricoes.isEmpty() ? null : inscricoes.get(0);
    }

    public void atualizar(Inscricao inscricao) {
        jdbc.update(
                "UPDATE Inscricao SET idJogador=?, idRodada=?, statusConfirmacao=?, dataResposta=? WHERE idInscricao=?",
                inscricao.getIdJogador(),
                inscricao.getIdRodada(),
                inscricao.getStatusConfirmacao(),
                inscricao.getDataResposta() != null ? Date.valueOf(inscricao.getDataResposta()) : null,
                inscricao.getIdInscricao()
        );
    }

    public void deletar(int id) {
        jdbc.update("DELETE FROM Inscricao WHERE idInscricao = ?", id);
    }

    public boolean existePorJogadorERodada(int idJogador, int idRodada) {
        return queryExiste("SELECT COUNT(*) FROM Inscricao WHERE idJogador = ? AND idRodada = ?", idJogador, idRodada);
    }

    public boolean existeJogador(int idJogador) {
        return queryExiste("SELECT COUNT(*) FROM Jogador WHERE idJogador = ?", idJogador);
    }

    public boolean existeRodada(int idRodada) {
        return queryExiste("SELECT COUNT(*) FROM Rodada WHERE idRodada = ?", idRodada);
    }

    private boolean queryExiste(String sql, Object... parametros) {
        Integer quantidade = jdbc.queryForObject(sql, Integer.class, parametros);
        return quantidade != null && quantidade > 0;
    }
}
