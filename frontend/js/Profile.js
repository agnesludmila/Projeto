
const usuario = {
    nome: "Matheus Gonçalves",
    biografia: "Estudante do 5 Periodo de computação",
    email: "matheusgs@aluno.uepb.edu.br",
    telefone: "(83) 99877-7984",
    posts: 12,
    comentarios: 24
};

function preencherPerfil(usuario) {
    document.getElementById("nomeCompleto").textContent = usuario.nome;
    document.getElementById("biografia").textContent = usuario.biografia;

    const emailLink = document.getElementById("emailLink");
    emailLink.textContent = usuario.email;
    emailLink.href = `mailto:${usuario.email}`;

    const telefoneLink = document.getElementById("telefoneLink");
    telefoneLink.textContent = usuario.telefone;
    telefoneLink.href = `tel:${usuario.telefone.replace(/\D/g, "")}`;

    document.getElementById("post-count").textContent = usuario.posts;
    document.getElementById("comment-count").textContent = usuario.comentarios;
}

document.addEventListener("DOMContentLoaded", () => {
    preencherPerfil(usuario);
});
