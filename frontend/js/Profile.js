
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

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("editModal");
    const openBtn = document.getElementById("openModalBtn");
    const closeBtn = document.querySelector(".close-btn");
    const photoInput = document.getElementById("photo-upload");
    const previewImg = document.getElementById("preview-img");


    openBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    photoInput.addEventListener("change", () => {
        const file = photoInput.files[0];
        if (file) {
            previewImg.src = URL.createObjectURL(file);
        }
    });
});

