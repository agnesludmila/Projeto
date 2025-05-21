const API_URL = 'http://localhost:8080/postagem';
const perfilImgEl = document.querySelector('.perfil-img');
const nomeUsuarioEl = document.querySelector('.nome-usuario');
const emailUsuarioEl = document.querySelector('.usuario-email');
const listaPostagensEl = document.getElementById('lista-postagens');
const userId = localStorage.getItem('usuarioId');

if (!userId) {
    console.error('Usuário não autenticado.');
}

let postagens = [];

async function carregarPerfil() {
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

async function carregarPostagens() {
    try {
        const res = await fetch(`${API_URL}/todas`);
        if (!res.ok) throw new Error('Erro ao buscar postagens');
        postagens = await res.json(); // salva globalmente

        listaPostagensEl.innerHTML = '';

        if (postagens.length === 0) {
            listaPostagensEl.innerHTML = '<p>Nenhuma postagem encontrada.</p>';
            return;
        }

        postagens.forEach(postagem => {
            const isDono = postagem.usuario?.id === Number(userId);

            const postagemEl = document.createElement('div');
            postagemEl.classList.add('post');

            postagemEl.innerHTML = `
                <div class="post-header">
                   <img src="${postagem.usuario?.fotoPerfil ? `http://localhost:8080${postagem.usuario.fotoPerfil}` : './imgprofile/ImagemProfile.jpg'}" alt="Foto do autor" />
                    <div class="user-info">
                        <span class="name">${postagem.usuario?.nome || 'Desconhecido'}</span>
                        <span class="date">${new Date(postagem.dataCriacao).toLocaleString()}</span>
                    </div>
                </div>

                <h3 class="post-title">${postagem.titulo}</h3>
                <p class="post-description">${postagem.descricao || ''}</p>

                <div class="post-media">
                    <img src="${postagem.caminhoImagem ? `http://localhost:8080${postagem.caminhoImagem}` : './imgprofile/ImagemProfile.jpg'}" alt="Imagem da postagem" />
                </div>
                <div class="post-actions">     
                  <button class="btn-contato"
                        data-postagem-id="${postagem.id}"
                        data-telefone="${postagem.usuario?.telefone || ''}"
                        data-email="${postagem.usuario?.email || ''}">
                        Contato
                  </button>

                </div>

                ${isDono ? `<button class="btn-apagar" data-id="${postagem.id}">Apagar</button>` : ''}
            `;

            listaPostagensEl.appendChild(postagemEl);
        });

        configurarBotoesContato();

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
                        carregarPostagens();
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


function configurarBotoesContato() {
    const modalContato = document.getElementById('modalContato');
    const btnFecharContato = document.getElementById('closeContatoModal');
    const telefoneEl = document.getElementById('modalTelefone');
    const emailEl = document.getElementById('modalEmail');

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-contato')) {
            const telefone = e.target.dataset.telefone || 'Não informado';
            const email = e.target.dataset.email || 'Não informado';

            telefoneEl.textContent = telefone;
            emailEl.textContent = email;

            if (telefone !== 'Não informado') {
                telefoneEl.href = `tel:${telefone.replace(/\D/g, '')}`;
            } else {
                telefoneEl.removeAttribute('href');
            }

            if (email !== 'Não informado') {
                emailEl.href = `mailto:${email}`;
            } else {
                emailEl.removeAttribute('href');
            }

            modalContato.style.display = 'flex';
        }
    });

    btnFecharContato.addEventListener('click', () => {
        modalContato.style.display = 'none';
    });

    modalContato.addEventListener('click', (e) => {
        if (e.target === modalContato) {
            modalContato.style.display = 'none';
        }
    });

}

window.addEventListener('DOMContentLoaded', () => {
    carregarPerfil();
    carregarPostagens();

    const criarBtn = document.getElementById('criarPostBtn');
    criarBtn.addEventListener('click', criarPostagem);
});

async function criarPostagem(event) {
    event.preventDefault(); // evita recarregar a página

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

window.addEventListener('DOMContentLoaded', () => {
    carregarPerfil();
    carregarPostagens();

    const criarBtn = document.getElementById('criarPostBtn');
    criarBtn.addEventListener('click', criarPostagem);
});
