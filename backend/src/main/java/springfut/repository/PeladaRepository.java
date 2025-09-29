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
        System.out.println("Iniciando exclusão em cascata para pelada ID: " + id);
        
        try {
            // 1. Primeiro, buscar todas as rodadas da pelada
            List<Integer> rodadaIds = jdbc.query(
                "SELECT idRodada FROM Rodada WHERE idPelada = ?",
                ps -> ps.setInt(1, id),
                (rs, rowNum) -> rs.getInt("idRodada")
            );
            System.out.println("Encontradas " + rodadaIds.size() + " rodadas para excluir");
            
            // 2. Para cada rodada, excluir registros relacionados
            for (Integer idRodada : rodadaIds) {
                System.out.println("Excluindo dados da rodada: " + idRodada);
                
                // Excluir estatísticas das partidas da rodada
                jdbc.update("DELETE est FROM Estatisticas est " +
                           "JOIN Partida p ON est.idPartida = p.idPartida " +
                           "WHERE p.idRodada = ?", idRodada);
                
                // Excluir partidas da rodada
                jdbc.update("DELETE FROM Partida WHERE idRodada = ?", idRodada);
                
                // Excluir times da rodada
                jdbc.update("DELETE FROM Time WHERE idRodada = ?", idRodada);
                
                // Excluir pagamentos da rodada
                jdbc.update("DELETE FROM Pagamento WHERE idRodada = ?", idRodada);
                
                // Excluir inscrições da rodada
                jdbc.update("DELETE FROM Inscricao WHERE idRodada = ?", idRodada);
            }
            
            // 3. Excluir rodadas da pelada
            jdbc.update("DELETE FROM Rodada WHERE idPelada = ?", id);
            System.out.println("Rodadas excluídas");
            
            // 4. Excluir vínculos jogador-pelada
            int vinculos = jdbc.update("DELETE FROM VinculoJogadorPelada WHERE idPelada = ?", id);
            System.out.println("Excluídos " + vinculos + " vínculos");
            
            // 5. Buscar e salvar endereço antes de excluir pelada
            List<Integer> enderecoIds = jdbc.query(
                "SELECT idEndereco FROM Pelada WHERE idPelada = ? AND idEndereco IS NOT NULL",
                ps -> ps.setInt(1, id),
                (rs, rowNum) -> rs.getInt("idEndereco")
            );
            
            // 6. Excluir a pelada
            int peladas = jdbc.update("DELETE FROM Pelada WHERE idPelada = ?", id);
            System.out.println("Pelada excluída. Linhas afetadas: " + peladas);
            
            // 7. Excluir endereços órfãos
            for (Integer idEndereco : enderecoIds) {
                int count = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM Pelada WHERE idEndereco = ?", 
                    Integer.class, 
                    idEndereco
                );
                if (count == 0) {
                    jdbc.update("DELETE FROM Endereco WHERE idEndereco = ?", idEndereco);
                    System.out.println("Endereço órfão excluído: " + idEndereco);
                }
            }
            
            System.out.println("Exclusão em cascata concluída com sucesso!");
            
        } catch (Exception e) {
            System.err.println("Erro durante exclusão em cascata: " + e.getMessage());
            throw e;
        }
    }
}