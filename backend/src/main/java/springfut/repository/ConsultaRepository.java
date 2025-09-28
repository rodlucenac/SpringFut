package springfut.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class ConsultaRepository {
    private final JdbcTemplate jdbc;

    public ConsultaRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // Consulta 1: jogadores com posição preferida
    public List<Map<String,Object>> jogadoresComPosicao() {
        return jdbc.queryForList("SELECT j.idJogador, p.nome, j.posicaoPreferida FROM Jogador j JOIN Pessoa p ON j.idPessoa = p.idPessoa");
    }

    // Consulta 2: peladas com nº de jogadores vinculados
    public List<Map<String,Object>> peladasComQuantidade() {
        return jdbc.queryForList("SELECT pe.idPelada, pe.diaSemana, COUNT(v.idJogador) AS totalJogadores FROM Pelada pe LEFT JOIN VinculoJogadorPelada v ON pe.idPelada = v.idPelada GROUP BY pe.idPelada");
    }

    // Consulta 3: rodadas futuras
    public List<Map<String,Object>> rodadasFuturas() {
        return jdbc.queryForList("SELECT r.idRodada, r.data, p.diaSemana FROM Rodada r JOIN Pelada p ON r.idPelada = p.idPelada WHERE r.data > CURDATE()");
    }

    // Consulta 4: valor arrecadado por rodada
    public List<Map<String,Object>> valorArrecadadoPorRodada() {
        return jdbc.queryForList("SELECT r.idRodada, SUM(pg.valor) as total FROM Rodada r JOIN Pagamento pg ON r.idRodada = pg.idRodada GROUP BY r.idRodada");
    }
}