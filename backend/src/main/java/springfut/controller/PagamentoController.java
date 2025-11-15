package springfut.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfut.model.Inscricao;
import springfut.model.Pagamento;
import springfut.repository.InscricaoRepository;
import springfut.repository.PagamentoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {
    private static final Set<String> FORMAS_VALIDAS = Set.of("PIX", "Dinheiro", "Cartao");
    private static final Set<String> STATUS_VALIDOS = Set.of("Pago", "Pendente", "Atrasado");

    private final PagamentoRepository repo;
    private final InscricaoRepository inscricaoRepository;

    public PagamentoController(PagamentoRepository repo, InscricaoRepository inscricaoRepository) {
        this.repo = repo;
        this.inscricaoRepository = inscricaoRepository;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Pagamento pagamento) {
        ResponseEntity<?> validacao = validarPagamento(pagamento, false);
        if (validacao != null) {
            return validacao;
        }

        if (pagamento.getData() == null) {
            pagamento.setData(LocalDate.now());
        }

        Pagamento criado = repo.inserir(pagamento);
        confirmarInscricaoSePago(criado);
        return ResponseEntity.ok(criado);
    }

    @GetMapping
    public List<Pagamento> listar(
            @RequestParam(value = "idJogador", required = false) Integer idJogador,
            @RequestParam(value = "idRodada", required = false) Integer idRodada
    ) {
        if (idJogador != null) {
            return repo.listarPorJogador(idJogador);
        }
        if (idRodada != null) {
            return repo.listarPorRodada(idRodada);
        }
        return repo.listar();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable int id, @RequestBody Pagamento pagamento) {
        Pagamento existente = repo.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }

        pagamento.setIdPagamento(id);
        ResponseEntity<?> validacao = validarPagamento(pagamento, true);
        if (validacao != null) {
            return validacao;
        }

        if (pagamento.getData() == null) {
            pagamento.setData(LocalDate.now());
        }

        repo.atualizar(pagamento);
        confirmarInscricaoSePago(pagamento);
        return ResponseEntity.ok(Map.of("mensagem", "Pagamento atualizado com sucesso"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable int id) {
        Pagamento existente = repo.buscarPorId(id);
        if (existente == null) {
            return ResponseEntity.notFound().build();
        }
        repo.deletar(id);
        return ResponseEntity.ok(Map.of("mensagem", "Pagamento removido com sucesso"));
    }

    private ResponseEntity<?> validarPagamento(Pagamento pagamento, boolean atualizacao) {
        if (pagamento.getIdJogador() <= 0 || pagamento.getIdRodada() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("erro", "idJogador e idRodada são obrigatórios"));
        }
        if (!repo.existeJogador(pagamento.getIdJogador())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Jogador não encontrado"));
        }
        if (!repo.existeRodada(pagamento.getIdRodada())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Rodada não encontrada"));
        }
        if (!inscricaoRepository.existePorJogadorERodada(pagamento.getIdJogador(), pagamento.getIdRodada())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "É necessário se inscrever antes de pagar"));
        }

        if (pagamento.getValor() <= 0) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Informe um valor válido"));
        }

        if (pagamento.getForma() == null || pagamento.getForma().isBlank()) {
            pagamento.setForma("PIX");
        } else if (!FORMAS_VALIDAS.contains(pagamento.getForma())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Forma de pagamento inválida"));
        }

        if (pagamento.getStatus() == null || pagamento.getStatus().isBlank()) {
            pagamento.setStatus("Pago");
        } else if (!STATUS_VALIDOS.contains(pagamento.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Status de pagamento inválido"));
        }

        return null;
    }

    private void confirmarInscricaoSePago(Pagamento pagamento) {
        if (!"Pago".equalsIgnoreCase(pagamento.getStatus())) {
            return;
        }
        Inscricao inscricao = inscricaoRepository.buscarPorJogadorERodada(
                pagamento.getIdJogador(),
                pagamento.getIdRodada()
        );
        if (inscricao != null && !"Confirmado".equalsIgnoreCase(inscricao.getStatusConfirmacao())) {
            inscricao.setStatusConfirmacao("Confirmado");
            inscricao.setDataResposta(LocalDate.now());
            inscricaoRepository.atualizar(inscricao);
        }
    }
}
