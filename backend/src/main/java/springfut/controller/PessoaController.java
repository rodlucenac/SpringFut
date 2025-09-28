package springfut.controller;

import org.springframework.web.bind.annotation.*;
import springfut.model.Pessoa;
import springfut.repository.PessoaRepository;

import java.util.List;

@RestController
@RequestMapping("/api/pessoas")
public class PessoaController {
    private final PessoaRepository repo;

    public PessoaController(PessoaRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public void criar(@RequestBody Pessoa p) { repo.inserir(p); }

    @GetMapping
    public List<Pessoa> listar() { return repo.listar(); }

    @PutMapping
    public void atualizar(@RequestBody Pessoa p) { repo.atualizar(p); }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) { repo.deletar(id); }
}