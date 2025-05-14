package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.model.Perfil;
import com.achadosperdidos.backend.repository.PerfilRepository;
import com.achadosperdidos.backend.model.Usuario;
import com.achadosperdidos.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/perfil")
public class PerfilController {

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/criar")
    public ResponseEntity<Perfil> criarPerfil(@RequestBody Perfil perfil) {
        Usuario usuario = usuarioRepository.findById(perfil.getUsuario().getId()).orElse(null);

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        perfil.setUsuario(usuario);
        Perfil perfilCriado = perfilRepository.save(perfil);

        return ResponseEntity.status(HttpStatus.CREATED).body(perfilCriado);
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<Perfil> atualizarPerfil(@PathVariable Long id, @RequestBody Perfil perfilAtualizado) {

        Perfil perfil = perfilRepository.findById(id).orElse(null);

        if (perfil == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        perfil.setBiografia(perfilAtualizado.getBiografia());
        perfil.setFotoPerfil(perfilAtualizado.getFotoPerfil());

        Perfil perfilSalvo = perfilRepository.save(perfil);

        return ResponseEntity.ok(perfilSalvo);
    }
}
