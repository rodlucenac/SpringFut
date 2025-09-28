package springfut.controller;

import org.springframework.web.bind.annotation.*;
import springfut.repository.ConsultaRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {
    private final ConsultaRepository repo;

    public ConsultaController(ConsultaRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/jogadores-posicao")
    public List<Map<String,Object>> jogadoresComPosicao() { return repo.jogadoresComPosicao(); }

    @GetMapping("/peladas-quantidade")
    public List<Map<String,Object>> peladasComQuantidade() { return repo.peladasComQuantidade(); }

    @GetMapping("/rodadas-futuras")
    public List<Map<String,Object>> rodadasFuturas() { return repo.rodadasFuturas(); }

    @GetMapping("/arrecadado-rodada")
    public List<Map<String,Object>> valorArrecadadoPorRodada() { return repo.valorArrecadadoPorRodada(); }
}