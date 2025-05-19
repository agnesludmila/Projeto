const API_URL = 'http://localhost:8080/postagem';
const perfilImgEl = document.querySelector('.perfil-img');
const nomeUsuarioEl = document.querySelector('.nome-usuario');
const emailUsuarioEl = document.querySelector('.usuario-email');
const listaPostagensEl = document.getElementById('lista-postagens');
const userId = localStorage.getItem('usuarioId');

if (!userId) {
    console.error('Usuário não autenticado.');
}

// Função para carregar o perfil do usuário logado
async function carregarPerfil() {
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

// Função para carregar todas as postagens
async function carregarPostagens() {
    try {
        const res = await fetch(`${API_URL}/todas`);
        if (!res.ok) throw new Error('Erro ao buscar postagens');
        const postagens = await res.json();

        listaPostagensEl.innerHTML = ''; // limpa antes de adicionar

        if (postagens.length === 0) {
            listaPostagensEl.innerHTML = '<p>Nenhuma postagem encontrada.</p>';
            return;
        }

        postagens.forEach(postagem => {
            const isDono = postagem.usuario?.id === Number(userId);
            console.log('Postagem de:', postagem.usuario?.id, ' | Usuário logado:', userId);

            const postagemEl = document.createElement('div');
            postagemEl.classList.add('postagem');

            postagemEl.innerHTML = `
                <h3>${postagem.titulo}</h3>
                <p>${postagem.descricao || ''}</p>
                <div>
                    <img src="${postagem.caminhoImagem ? `http://localhost:8080${postagem.caminhoImagem}` : './imgprofile/ImagemProfile.jpg'}"
                         alt="Imagem da postagem" style="max-width: 200px; max-height: 150px;" />
                </div>
                <p><strong>Autor:</strong> ${postagem.usuario?.nome || 'Desconhecido'}</p>
                <p><small>Criado em: ${new Date(postagem.dataCriacao).toLocaleString()}</small></p>
                ${isDono ? `<button class="btn-apagar" data-id="${postagem.id}">Apagar</button>` : ''}
            `;

            listaPostagensEl.appendChild(postagemEl);
        });

        // Adicionar evento de clique para todos os botões "Apagar"
        document.querySelectorAll('.btn-apagar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('Tem certeza que deseja apagar esta postagem?')) {
                    try {
                        const resDel = await fetch(`${API_URL}/deletar/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'userId': userId
                            }
                        });
                        if (!resDel.ok) {
                            const errMsg = await resDel.text();
                            throw new Error(errMsg || 'Erro ao apagar postagem');
                        }
                        alert('Postagem apagada com sucesso!');
                        carregarPostagens(); // Recarregar lista após apagar
                    } catch (err) {
                        alert('Erro ao apagar postagem: ' + err.message);
                        console.error(err);
                    }
                }
            });
        });

    } catch (err) {
        console.error('Erro ao carregar postagens:', err);
    }
}

// Função para criar uma postagem usando multipart/form-data
async function criarPostagem() {
    const tituloInput = document.getElementById('titulo');
    const descricaoInput = document.getElementById('descricao');
    const imagemInput = document.getElementById('imagem-upload');

    const titulo = tituloInput.value.trim();
    const descricao = descricaoInput.value.trim();

    if (!titulo) {
        alert('Título é obrigatório!');
        return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("usuarioId", userId);

    if (imagemInput.files.length > 0) {
        formData.append("imagem", imagemInput.files[0]);
    }

    try {
        const res = await fetch(`${API_URL}/criar`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || 'Erro ao criar postagem');
        }

        // Limpar o formulário e fechar o modal
        tituloInput.value = '';
        descricaoInput.value = '';
        imagemInput.value = '';
        document.getElementById('modalPublicacao').style.display = 'none';

        alert('Postagem criada com sucesso!');
        carregarPostagens();

    } catch (err) {
        alert('Erro ao criar postagem: ' + err.message);
        console.error('Erro ao criar postagem:', err);
    }
}

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
    carregarPerfil();
    carregarPostagens();

    const criarBtn = document.getElementById('criarPostBtn');
    criarBtn.addEventListener('click', criarPostagem);
});
