package com.achadosperdidos.usuarios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // permite requisições do front (localhost:5500, etc)
@RestController
@RequestMapping("/usuarios")
public class usuarioController {

    @Autowired
    private usuarioRepository usuarioRepository;

    // CREATE
    @PostMapping
    public usuarioCadastro criar(@RequestBody usuarioCadastro usuario) {
        return usuarioRepository.save(usuario);
    }

    // READ ALL
    @GetMapping
    public List<usuarioCadastro> listar() {
        return usuarioRepository.findAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<usuarioCadastro> buscar(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<usuarioCadastro> atualizar(@PathVariable Long id, @RequestBody usuarioCadastro novoUsuario) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNome(novoUsuario.getNome());
                    usuario.setEmail(novoUsuario.getEmail());
                    usuario.setSenha(novoUsuario.getSenha());
                    return ResponseEntity.ok(usuarioRepository.save(usuario));
                }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204
        }
        return ResponseEntity.notFound().build(); // 404
    }
}
