package springfut.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import springfut.model.Pelada;

import java.util.List;

@Repository
public class PeladaRepository {
    private final JdbcTemplate jdbc;

    public PeladaRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void inserir(Pelada p) {
        jdbc.update("INSERT INTO Pelada (diaSemana, horario, valorTotal, limiteMensalistas, tempoConfMensalista, tempoConfDiarista) VALUES (?, ?, ?, ?, ?, ?)",
                p.getDiaSemana(), p.getHorario(), p.getValorTotal(), p.getLimiteMensalistas(), p.getTempoConfMensalista(), p.getTempoConfDiarista());
    }

    public List<Pelada> listar() {
        return jdbc.query("SELECT * FROM Pelada",
                (rs, rowNum) -> {
                    Pelada p = new Pelada();
                    p.setIdPelada(rs.getInt("idPelada"));
                    p.setDiaSemana(rs.getString("diaSemana"));
                    p.setHorario(rs.getTime("horario").toLocalTime());
                    p.setValorTotal(rs.getDouble("valorTotal"));
                    p.setLimiteMensalistas(rs.getInt("limiteMensalistas"));
                    p.setTempoConfMensalista(rs.getInt("tempoConfMensalista"));
                    p.setTempoConfDiarista(rs.getInt("tempoConfDiarista"));
                    return p;
                });
    }

    public void atualizar(Pelada p) {
        jdbc.update("UPDATE Pelada SET diaSemana=?, horario=?, valorTotal=?, limiteMensalistas=?, tempoConfMensalista=?, tempoConfDiarista=? WHERE idPelada=?",
                p.getDiaSemana(), p.getHorario(), p.getValorTotal(), p.getLimiteMensalistas(), p.getTempoConfMensalista(), p.getTempoConfDiarista(), p.getIdPelada());
    }

    public void deletar(int id) {
        jdbc.update("DELETE FROM Pelada WHERE idPelada=?", id);
    }
}