package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.model.Postagem;
import com.achadosperdidos.backend.model.Usuario;
import com.achadosperdidos.backend.model.Perfil;
import com.achadosperdidos.backend.model.Tag;
import com.achadosperdidos.backend.dto.PostagemDTO;
import com.achadosperdidos.backend.repository.PostagemRepository;
import com.achadosperdidos.backend.repository.UsuarioRepository;
import com.achadosperdidos.backend.repository.TagRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; // Certifique-se que está importado
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/postagem")
public class PostagemController {

    private final PostagemRepository postagemRepository;
    private final UsuarioRepository usuarioRepository;
    private final TagRepository tagRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public PostagemController(PostagemRepository postagemRepository,
                              UsuarioRepository usuarioRepository,
                              TagRepository tagRepository) {
        this.postagemRepository = postagemRepository;
        this.usuarioRepository = usuarioRepository;
        this.tagRepository = tagRepository;
    }

    private static final List<String> STOPWORDS = Arrays.asList(
            "a", "o", "e", "de", "do", "da", "para", "em", "com", "que", "um", "uma",
            "seu", "sua", "foi", "era", "ser", "ter", "não", "mas", "ou", "os", "as",
            "no", "na", "nos", "nas", "dos", "das", "meu", "minha", "pelo", "pela",
            "este", "esta", "isto", "se", "por", "mais", "como", "quando", "sobre",
            "até", "isso", "ele", "ela", "eles", "elas", "nós", "você", "vocês",
            "muito", "já", "sem", "então", "também", "depois", "ainda", "onde",
            "porque", "mesmo", "qual", "sempre", "mim", "lhe", "nossos", "nossas",
            "meus", "minhas", "seus", "suas", "item", "coisa", "achei", "perdi",
            "encontrei", "procuro", "documento"
    );

    private Set<String> extrairTermosChave(String texto) {
        Set<String> termos = new HashSet<>();
        if (texto == null || texto.trim().isEmpty()) {
            return termos;
        }
        String textoParaAnalise = texto.toLowerCase();
        String[] palavras = textoParaAnalise
                .replaceAll("[^\\p{L}\\p{N}\\s'-]", "")
                .replaceAll("\\s+", " ")
                .split("\\s");

        for (String palavra : palavras) {
            String palavraLimpa = palavra.trim().replaceAll("^-|-$", "");
            if (!palavraLimpa.isEmpty() && palavraLimpa.length() > 2 && !STOPWORDS.contains(palavraLimpa)) {
                try {
                    Double.parseDouble(palavraLimpa);
                } catch (NumberFormatException e) {
                    termos.add(palavraLimpa);
                }
            }
        }
        return termos;
    }

    @PostMapping(path = "/criar", consumes = "multipart/form-data")
    @Transactional
    public ResponseEntity<?> criarPostagem(@RequestParam("titulo") String titulo,
                                           @RequestParam("descricao") String descricao,
                                           @RequestParam("usuarioId") Long usuarioId,
                                           @RequestParam(value = "imagem", required = false) MultipartFile imagem) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado com ID: " + usuarioId);
        }

        Usuario usuario = usuarioOpt.get();
        Postagem postagem = new Postagem();
        postagem.setTitulo(titulo);
        postagem.setDescricao(descricao);
        postagem.setUsuario(usuario);
        postagem.setDataCriacao(LocalDateTime.now());

        if (imagem != null && !imagem.isEmpty()) {
            try {
                String basePath = System.getProperty("user.dir");
                Path diretorioUploadAbsoluto = Paths.get(basePath, this.uploadDir).toAbsolutePath();
                Files.createDirectories(diretorioUploadAbsoluto);

                String nomeArquivoOriginal = StringUtils.cleanPath(Objects.requireNonNull(imagem.getOriginalFilename()));
                String extensao = nomeArquivoOriginal.contains(".") ? nomeArquivoOriginal.substring(nomeArquivoOriginal.lastIndexOf(".")) : ".jpg";
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
                String nomeArquivoUnico = "post_" + usuarioId + "_" + timestamp + "_" + UUID.randomUUID().toString().substring(0, 6) + extensao;

                Path caminhoArquivo = diretorioUploadAbsoluto.resolve(nomeArquivoUnico);
                Files.copy(imagem.getInputStream(), caminhoArquivo, StandardCopyOption.REPLACE_EXISTING);
                postagem.setCaminhoImagem(this.uploadDir.startsWith("/") ? this.uploadDir + "/" + nomeArquivoUnico : "/" + this.uploadDir + "/" + nomeArquivoUnico);

            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Erro crítico ao salvar imagem: " + e.getMessage());
            }
        }

        String textoParaAnalise = titulo + " " + (descricao != null ? descricao : "");
        Set<String> nomesDasTags = extrairTermosChave(textoParaAnalise);

        for (String nomeTag : nomesDasTags) {
            Tag tag = tagRepository.findByNomeIgnoreCase(nomeTag)
                    .orElseGet(() -> {
                        Tag novaTag = new Tag(nomeTag);
                        return tagRepository.save(novaTag);
                    });
            postagem.addTag(tag);
        }

        Postagem postagemSalva = postagemRepository.save(postagem);

        Perfil perfil = usuario.getPerfil();
        if (perfil != null) {
            perfil.setQntPosts(perfil.getQntPosts() + 1);
            // O @Transactional geralmente cuida de salvar o 'usuario' se 'perfil' faz parte do seu agregado
            // e as relações de cascade estão corretas. Se não, salve explicitamente:
            // usuarioRepository.save(usuario);
        }

        return ResponseEntity.ok(new PostagemDTO(postagemSalva));
    }

    @GetMapping("/todas")
    public ResponseEntity<List<PostagemDTO>> listarPostagens() {
        List<Postagem> postagens = postagemRepository.findAll();
        List<PostagemDTO> dtos = postagens.stream()
                .map(PostagemDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/deletar/{id}")
    @Transactional // Garante que todas as operações de banco de dados sejam atômicas
    public ResponseEntity<?> deletarPostagem(@PathVariable Long id, @RequestHeader("userId") Long userIdReq) {
        Optional<Postagem> postagemOpt = postagemRepository.findById(id);
        if (postagemOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Postagem não encontrada");
        }

        Postagem postagem = postagemOpt.get();

        if (postagem.getUsuario() == null || !postagem.getUsuario().getId().equals(userIdReq)) {
            return ResponseEntity.status(403).body("Você não tem permissão para apagar esta postagem");
        }

        // Decrementa a contagem de posts do usuário
        Usuario usuarioDaPostagem = postagem.getUsuario();
        if (usuarioDaPostagem != null && usuarioDaPostagem.getPerfil() != null) {
            Perfil perfilDoUsuario = usuarioDaPostagem.getPerfil();
            perfilDoUsuario.setQntPosts(Math.max(0, perfilDoUsuario.getQntPosts() - 1));
            // A anotação @Transactional deve persistir a mudança no perfil se ele for parte
            // do agregado Usuario. Caso contrário, você pode precisar salvar o usuário/perfil explicitamente.
            // usuarioRepository.save(usuarioDaPostagem); // Descomente se necessário
        }

        // Guarda uma cópia das tags associadas ANTES de desassociá-las ou deletar a postagem
        Set<Tag> tagsAssociadas = new HashSet<>(postagem.getTags());

        // O JPA/Hibernate removerá as entradas na tabela de junção 'postagem_tag'
        // automaticamente quando a postagem for deletada, devido à forma como a relação
        // ManyToMany é geralmente gerenciada pelo proprietário da relação (Postagem, neste caso,
        // pois ela define @JoinTable).
        // Não é estritamente necessário limpar postagem.getTags() antes de deletar,
        // mas se você tiver lógica em Postagem.removeTag() que atualiza o outro lado,
        // seria bom chamá-la. Para simplificar, vamos confiar na deleção em cascata da junção.

        postagemRepository.delete(postagem); // Deleta a postagem e as suas associações na tabela de junção

        // Agora, verifica e deleta as tags que se tornaram órfãs
        for (Tag tag : tagsAssociadas) {
            // Verifica se a tag ainda existe (pode ter sido deletada por outra operação)
            // e se não está mais associada a nenhuma outra postagem.
            if (tag.getId() != null && !postagemRepository.existsByTags_Id(tag.getId())) {
                tagRepository.delete(tag);
            }
        }

        return ResponseEntity.ok("Postagem deletada com sucesso e tags órfãs removidas.");
    }
}