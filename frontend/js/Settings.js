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

        document.querySelectorAll('[data-perfil-img]').forEach(img => {
            img.src = data.fotoPerfil
                ? `http://localhost:8080${data.fotoPerfil}?t=${Date.now()}`
                : './imgprofile/ImagemProfile.jpg';

            img.onerror = function () {
                this.src = 'https://www.svgrepo.com/show/382106/user-alt.svg';
            };
        });
    } catch (err) {
        console.error('Erro ao carregar perfil:', err);
    }
}

function abrirAba(nome) {
    const paineis = document.querySelectorAll('.painel');
    paineis.forEach(painel => painel.classList.add('oculto'));

    const abaAtiva = document.getElementById(`aba-${nome}`);
    if (abaAtiva) {
        abaAtiva.classList.remove('oculto');
    }
}

function encerrarConta() {
    if (confirm('Tem certeza que deseja encerrar sua conta?')) {
        fetch('/api/encerrar-conta', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                if (res.ok) {
                    alert('Conta encerrada com sucesso.');
                    window.location.href = '/';
                } else {
                    alert('Erro ao encerrar conta.');
                }
            });
    }
}

function hibernarConta() {
    if (confirm('Tem certeza que deseja colocar sua conta em hibernação? Você poderá reativá-la ao fazer login novamente.')) {
        fetch('/api/hibernar-conta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                if (res.ok) {
                    alert('Conta colocada em hibernação temporariamente.');
                    // Opcional: redirecionar ou atualizar página
                } else {
                    alert('Erro ao colocar conta em hibernação.');
                }
            });
    }
}

// Efeitos sonoros simples
const audioClick = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3'); // Som exemplo

function toggleEfeitosSonoros() {
    const checkbox = document.getElementById('efeitosToggle');
    localStorage.setItem('efeitosSonorosAtivos', checkbox.checked ? 'true' : 'false');
}

// Aplica efeito sonoro no clique dos links
document.addEventListener('click', e => {
    if (localStorage.getItem('efeitosSonorosAtivos') === 'true' && e.target.tagName === 'A') {
        audioClick.currentTime = 0;
        audioClick.play();
    }
});


window.addEventListener('DOMContentLoaded', () => {
    const ativo = localStorage.getItem('efeitosSonorosAtivos') === 'true';
    const checkbox = document.getElementById('efeitosToggle');
    checkbox.checked = ativo;
    checkbox.addEventListener('change', toggleEfeitosSonoros);
});

// Chama ao carregar a página
window.addEventListener('DOMContentLoaded', carregarPerfil);
