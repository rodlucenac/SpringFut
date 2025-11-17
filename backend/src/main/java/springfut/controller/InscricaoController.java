package springfut.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfut.model.Inscricao;
import springfut.repository.InscricaoRepository;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/inscricoes")
public class InscricaoController {
    private static final Set<String> STATUS_VALIDOS = Set.of("Confirmado", "Ausente", "Pendente");

    private final InscricaoRepository repo;

    public InscricaoController(InscricaoRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Inscricao inscricao) {
        if (inscricao.getIdJogador() <= 0 || inscricao.getIdRodada() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("erro", "idJogador e idRodada são obrigatórios"));
        }

        if (!repo.existeJogador(inscricao.getIdJogador())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Jogador não encontrado"));
        }

        if (!repo.existeRodada(inscricao.getIdRodada())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Rodada não encontrada"));
        }

        if (repo.existePorJogadorERodada(inscricao.getIdJogador(), inscricao.getIdRodada())) {
            return ResponseEntity.status(409).body(Map.of("erro", "Jogador já possui inscrição para essa rodada"));
        }

        if (inscricao.getStatusConfirmacao() == null || inscricao.getStatusConfirmacao().isBlank()) {
            inscricao.setStatusConfirmacao("Pendente");
        } else if (!STATUS_VALIDOS.contains(inscricao.getStatusConfirmacao())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Status inválido"));
        }

        ajustarDataResposta(inscricao, null);

        Inscricao criada = repo.inserir(inscricao);
        return ResponseEntity.ok(criada);
    }

    @GetMapping
    public List<Inscricao> listar(
            @RequestParam(value = "idRodada", required = false) Integer idRodada,
            @RequestParam(value = "idJogador", required = false) Integer idJogador
    ) {
        if (idRodada != null) {
            return repo.listarPorRodada(idRodada);
        }
        if (idJogador != null) {
            return repo.listarPorJogador(idJogador);
        }
        return repo.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable int id) {
        Inscricao inscricao = repo.buscarPorId(id);
        if (inscricao == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(inscricao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable int id, @RequestBody Inscricao inscricao) {
        Inscricao existente = repo.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        if (inscricao.getIdJogador() <= 0 || inscricao.getIdRodada() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("erro", "idJogador e idRodada são obrigatórios"));
        }

        if (!repo.existeJogador(inscricao.getIdJogador())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Jogador não encontrado"));
        }

        if (!repo.existeRodada(inscricao.getIdRodada())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Rodada não encontrada"));
        }

        if (inscricao.getStatusConfirmacao() == null || inscricao.getStatusConfirmacao().isBlank()) {
            inscricao.setStatusConfirmacao(existente.getStatusConfirmacao());
        } else if (!STATUS_VALIDOS.contains(inscricao.getStatusConfirmacao())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Status inválido"));
        }

        ajustarDataResposta(inscricao, existente);

        inscricao.setIdInscricao(id);
        repo.atualizar(inscricao);
        return ResponseEntity.ok(Map.of("mensagem", "Inscrição atualizada com sucesso"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable int id) {
        Inscricao existente = repo.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        repo.deletar(id);
        return ResponseEntity.ok(Map.of("mensagem", "Inscrição removida com sucesso"));
    }

    private void ajustarDataResposta(Inscricao inscricao, Inscricao existente) {
        String statusAtual = inscricao.getStatusConfirmacao();

        if ("Pendente".equalsIgnoreCase(statusAtual)) {
            inscricao.setDataResposta(null);
            return;
        }

        if (existente == null || existente.getStatusConfirmacao() == null) {
            inscricao.setDataResposta(LocalDate.now());
            return;
        }

        if (!existente.getStatusConfirmacao().equals(statusAtual)) {
            inscricao.setDataResposta(LocalDate.now());
        } else {
            inscricao.setDataResposta(existente.getDataResposta());
        }
    }

    // ========== TRIGGER: trg_inscricao_status_resposta ==========
    
    @GetMapping("/demonstrar-trigger")
    public ResponseEntity<?> demonstrarTrigger() {
        return ResponseEntity.ok(Map.of(
            "trigger", "trg_inscricao_status_resposta",
            "descricao", "Atualiza automaticamente a dataResposta quando o status muda",
            "tipo", "BEFORE UPDATE",
            "tabela", "Inscricao",
            "regras", Arrays.asList(
                "Se status = 'Pendente' → dataResposta = NULL",
                "Se status mudou → dataResposta = CURDATE()"
            ),
            "efeito", "Garante consistência: dataResposta só existe para status confirmado/ausente",
            "exemplo", "Ao mudar de Pendente para Confirmado, a data é preenchida automaticamente"
        ));
    }

    @GetMapping("/{id}/historico-status")
    public ResponseEntity<?> getHistoricoStatus(@PathVariable int id) {
        try {
            Inscricao inscricao = repo.buscarPorId(id);
            
            if (inscricao == null) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(Map.of(
                "inscricao", inscricao,
                "explicacao", "A dataResposta foi atualizada automaticamente pelo trigger quando o status mudou",
                "trigger", "trg_inscricao_status_resposta"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("erro", e.getMessage()));
        }
    }
}
