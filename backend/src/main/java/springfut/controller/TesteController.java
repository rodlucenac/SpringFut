package springfut.controller;

import org.springframework.web.bind.annotation.RestController;

import springfut.repository.TesteRepository;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/teste")
public class TesteController {
    private final TesteRepository repo;

    public TesteController(TesteRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/pessoas")
    public String contarPessoas() {
        return "Total de pessoas: " + repo.contarPessoas();
    }
}
