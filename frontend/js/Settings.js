const userId = localStorage.getItem('usuarioId');

const perfilImgEl = document.querySelector('.perfil-img');
const nomeUsuarioEl = document.querySelector('.nome-usuario');
const emailUsuarioEl = document.querySelector('.usuario-email');

async function carregarPerfil() {
    if (!userId) {
        console.error('Usuário não autenticado.');
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/perfil/${userId}`);
        if (!res.ok) throw new Error('Erro ao buscar dados do perfil');
        const data = await res.json();

        nomeUsuarioEl.textContent = data.nome || 'Nome não definido';
        emailUsuarioEl.textContent = data.email || 'Email não informado';

        perfilImgEl.src = data.fotoPerfil
            ? `http://localhost:8080${data.fotoPerfil}?t=${Date.now()}`
            : './imgprofile/ImagemProfile.jpg';

    } catch (err) {
        console.error('Erro ao carregar perfil:', err);
    }
}

// Chama ao carregar a página
window.addEventListener('DOMContentLoaded', carregarPerfil);
