package springfut.controller;

import org.springframework.web.bind.annotation.*;
import springfut.model.Pelada;
import springfut.repository.PeladaRepository;

import java.util.List;

@RestController
@RequestMapping("/api/peladas")
public class PeladaController {
    private final PeladaRepository repo;

    public PeladaController(PeladaRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public void criar(@RequestBody Pelada p) { repo.inserir(p); }

    @GetMapping
    public List<Pelada> listar() { return repo.listar(); }

    @PutMapping
    public void atualizar(@RequestBody Pelada p) { repo.atualizar(p); }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable int id) { repo.deletar(id); }
}
