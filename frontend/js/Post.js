// ./js/Post.js
const API_URL = 'http://localhost:8080/postagem';
const userId = localStorage.getItem('usuarioId');

// Elementos da página
const listaPostagensEl = document.getElementById('lista-postagens');
const sidebarNomeUsuarioEl = document.querySelector('.sidebar .nome-usuario');
const sidebarEmailUsuarioEl = document.querySelector('.sidebar .usuario-email');
const mainSearchInputEl = document.getElementById('searchInput');
const searchButtonEl = document.getElementById('searchToggle'); // Ícone de lupa
const categoriasDropdownEl = document.getElementById('categoriasDropdown');
const listaCategoriasEl = document.getElementById('listaCategorias');
const feedbackCategoriasEl = document.getElementById('feedbackCategorias');
const modalPublicacaoEl = document.getElementById('modalPublicacao');
const criarPostBtnEl = document.getElementById('criarPostBtn');
const closeModalBtnEl = document.getElementById('closeModalBtn');
const tituloInputEl = document.getElementById('titulo');
const descricaoInputEl = document.getElementById('descricao');
const imagemUploadInputEl = document.getElementById('imagem-upload');
const postBoxEl = document.getElementById('postBox');
const modalContatoEl = document.getElementById('modalContato');
const closeContatoModalBtnEl = document.getElementById('closeContatoModal');
const modalTelefoneEl = document.getElementById('modalTelefone');
const modalEmailEl = document.getElementById('modalEmail');
const modalCategoriasDinamicasEl = document.getElementById('modalCategoriasDinamicas'); // Se ainda for usar um modal separado para todas as tags
const closeModalCategoriasDinamicasBtnEl = document.getElementById('closeModalCategoriasDinamicasBtn');
const logoutButtonEl = document.getElementById('logoutButton');

// Variável global (mantida do seu código)
let postagens = [];

if (!userId && window.location.pathname.includes("Search.html")) {
    console.warn('Usuário não autenticado.');
    // window.location.href = './LoginRegister.html';
}

// Função Debounce para otimizar buscas no input
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

async function carregarPerfil() {
    if (!userId) return;
    try {
        const res = await fetch(`http://localhost:8080/perfil/${userId}`);
        if (!res.ok) throw new Error('Erro ao buscar dados do perfil');
        const data = await res.json();

        if (sidebarNomeUsuarioEl) sidebarNomeUsuarioEl.textContent = data.nome || 'Nome não definido';
        if (sidebarEmailUsuarioEl) sidebarEmailUsuarioEl.textContent = data.email || 'Email não informado';

        document.querySelectorAll('[data-perfil-img]').forEach(img => {
            img.src = data.fotoPerfil
                ? `http://localhost:8080${data.fotoPerfil}?t=${Date.now()}`
                : './imgprofile/ImagemProfile.jpg';
            img.onerror = function () { this.src = 'https://www.svgrepo.com/show/382106/user-alt.svg'; };
        });
    } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        if (sidebarNomeUsuarioEl) sidebarNomeUsuarioEl.textContent = 'Erro ao carregar';
        if (sidebarEmailUsuarioEl) sidebarEmailUsuarioEl.textContent = '';
    }
}

function exibirPostagens(lista) {
    if (!listaPostagensEl) {
        console.error("Elemento #lista-postagens não encontrado.");
        return;
    }
    listaPostagensEl.innerHTML = '';

    const template = document.getElementById('postagemTemplate');
    if (!template) {
        console.error('Template #postagemTemplate não encontrado no HTML!');
        listaPostagensEl.innerHTML = '<p style="text-align:center; padding:20px;">Erro: Template de postagem ausente.</p>';
        return;
    }

    if (!lista || lista.length === 0) {
        listaPostagensEl.innerHTML = '<p style="text-align:center; padding:20px;">Nenhuma postagem encontrada.</p>';
        return;
    }

    lista.forEach(postagem => {
        // console.log("Dados da postagem para template:", postagem);

        const clone = template.content.cloneNode(true);
        const postElement = clone.querySelector('.post');

        const imgPerfilEl = postElement.querySelector('.post-template-foto-perfil');
        const nomeUsuarioElClone = postElement.querySelector('.post-template-nome-usuario');
        const dataEl = postElement.querySelector('.post-template-data');
        const tituloEl = postElement.querySelector('.post-template-titulo');
        const descricaoEl = postElement.querySelector('.post-template-descricao');
        const mediaDivEl = postElement.querySelector('.post-template-media');
        const imgPostagemEl = postElement.querySelector('.post-template-caminho-imagem');
        const btnContatoEl = postElement.querySelector('.post-template-btn-contato');
        const postActionsDivEl = postElement.querySelector('.post-actions');

        if(imgPerfilEl) {
            imgPerfilEl.src = postagem.fotoPerfil ? `http://localhost:8080${postagem.fotoPerfil}` : './imgprofile/ImagemProfile.jpg';
            imgPerfilEl.alt = `Foto de ${postagem.nomeUsuario || 'Desconhecido'}`;
            imgPerfilEl.onerror = function() { this.onerror=null; this.src='https://www.svgrepo.com/show/382106/user-alt.svg'; };
        }

        if(nomeUsuarioElClone) nomeUsuarioElClone.textContent = postagem.nomeUsuario || 'Desconhecido';
        if(dataEl && postagem.dataCriacao) dataEl.textContent = new Date(postagem.dataCriacao).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        if(tituloEl) tituloEl.textContent = postagem.titulo;
        if(descricaoEl) descricaoEl.textContent = postagem.descricao || '';

        if (mediaDivEl && imgPostagemEl) {
            if (postagem.caminhoImagem) {
                imgPostagemEl.src = `http://localhost:8080${postagem.caminhoImagem}`;
                imgPostagemEl.alt = `Imagem para ${postagem.titulo}`;
                imgPostagemEl.onerror = function() { this.parentElement.style.display='none'; };
                mediaDivEl.style.display = 'block';
            } else {
                mediaDivEl.style.display = 'none';
            }
        }

        if(btnContatoEl) {
            btnContatoEl.dataset.postagemId = postagem.id;
            btnContatoEl.dataset.contato = postagem.contato || '';
            btnContatoEl.dataset.email = postagem.email || ''; // CORRIGIDO: usa postagem.email (do DTO)
        }

        const isDono = Number(postagem.usuarioId) === Number(userId);
        if (isDono && postActionsDivEl) {
            // Se o template já tiver um botão de apagar (ex: <button class="btn-apagar" style="display:none;">),
            // você pode apenas mostrá-lo e adicionar o listener.
            // Caso contrário, crie-o:
            let btnApagar = postElement.querySelector('.btn-apagar'); // Tenta encontrar no template
            if (!btnApagar) { // Se não existir no template, cria
                btnApagar = document.createElement('button');
                btnApagar.classList.add('btn-apagar');
                btnApagar.innerHTML = '<i class="fas fa-trash-alt"></i> Apagar';
                postActionsDivEl.appendChild(btnApagar);
            }
            btnApagar.style.display = 'inline-block'; // Garante que está visível
            btnApagar.dataset.id = postagem.id;

            // Remove listener antigo para evitar duplicação se o post for re-renderizado
            // (Mais robusto seria clonar o template sem listeners e adicionar aqui)
            // Esta abordagem de adicionar listener diretamente aqui é mais simples para o cloneNode(true)
            // se o botão já não vier com um listener do template.
            // Para esta estrutura, adicionar listener a cada clone é necessário.
            btnApagar.addEventListener('click', async (e) => {
                const postId = e.currentTarget.dataset.id;
                const resultado = await Swal.fire({
                    title: 'Tem certeza?', text: "Deseja apagar esta postagem?", icon: 'warning',
                    showCancelButton: true, confirmButtonColor: 'green', cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim, apagar!', cancelButtonText: 'Cancelar'
                });
                if (resultado.isConfirmed) {
                    try {
                        const resDel = await fetch(`${API_URL}/deletar/${postId}`, {
                            method: 'DELETE', headers: { 'userId': userId }
                        });
                        if (!resDel.ok) {
                            const errMsg = await resDel.text();
                            throw new Error(errMsg || 'Erro ao apagar postagem');
                        }
                        await Swal.fire('Apagado!', 'Postagem apagada com sucesso.', 'success');
                        carregarTodasPostagens();
                    } catch (err) {
                        Swal.fire('Erro!', 'Erro ao apagar postagem: ' + err.message, 'error');
                        console.error(err);
                    }
                }
            });
        } else if (postActionsDivEl) {
            const btnApagarExistente = postElement.querySelector('.btn-apagar');
            if (btnApagarExistente) btnApagarExistente.remove(); // Remove se não for dono
        }
        listaPostagensEl.appendChild(postElement);
    });
    configurarBotoesContato();
}

async function carregarTodasPostagens() {
    if (!listaPostagensEl) return;
    if (!userId) {
        listaPostagensEl.innerHTML = '<p style="text-align:center; padding:20px;">Faça login para ver as postagens.</p>';
        return;
    }
    listaPostagensEl.innerHTML = '<p style="text-align:center; padding:20px;">Carregando postagens...</p>';
    try {
        const res = await fetch(`${API_URL}/todas`);
        if (!res.ok) throw new Error('Erro ao buscar todas as postagens');
        const postagensRecebidas = await res.json();
        exibirPostagens(postagensRecebidas);
    } catch (err) {
        console.error('Erro ao carregar todas as postagens:', err);
        listaPostagensEl.innerHTML = '<p style="text-align:center; padding:20px;">Erro ao carregar postagens.</p>';
    }
}

async function mostrarCategoriasSugeridas() {
    if (!categoriasDropdownEl || !listaCategoriasEl || !feedbackCategoriasEl) {
        console.error('Elementos HTML para o dropdown de categorias sugeridas não foram encontrados.');
        return;
    }
    listaCategoriasEl.innerHTML = '';
    feedbackCategoriasEl.textContent = 'Carregando sugestões...';
    feedbackCategoriasEl.style.display = 'block';
    categoriasDropdownEl.style.display = 'block';

    try {
        const res = await fetch(`${API_URL}/sugestoes-termos`);
        if (!res.ok) {
            const errorText = await res.text();
            let errorMessage = errorText;
            try { const errorJson = JSON.parse(errorText); errorMessage = errorJson.message || errorJson.error || errorText; } catch (e) {}
            throw new Error(`Erro ${res.status} ao buscar sugestões: ${errorMessage}`);
        }
        const termos = await res.json();

        if (termos && termos.length > 0) {
            feedbackCategoriasEl.style.display = 'none';
            termos.forEach(termo => {
                const li = document.createElement('li');
                li.textContent = termo;
                li.dataset.termo = termo;
                // Adicione classes CSS ou estilos inline conforme preferir
                // Ex: li.classList.add('sugestao-item');
                li.style.padding = '8px 12px';
                li.style.cursor = 'pointer';
                li.style.borderBottom = '1px solid #f0f0f0';
                li.addEventListener('mouseover', () => li.style.backgroundColor = '#f5f5f5');
                li.addEventListener('mouseout', () => li.style.backgroundColor = 'transparent');

                li.addEventListener('click', () => {
                    buscarPostagensPeloTermoSelecionado(termo);
                    categoriasDropdownEl.style.display = 'none';
                });
                listaCategoriasEl.appendChild(li);
            });
        } else {
            feedbackCategoriasEl.textContent = 'Nenhuma sugestão encontrada no momento.';
        }
    } catch (error) {
        console.error("Erro ao carregar categorias sugeridas:", error);
        feedbackCategoriasEl.textContent = 'Erro ao carregar sugestões.';
    }
}

async function buscarPostagensPeloTermoSelecionado(termo) {
    if (!listaPostagensEl) return;
    listaPostagensEl.innerHTML = `<p style="text-align:center; padding:20px;">Buscando postagens sobre "${termo}"...</p>`;
    if (mainSearchInputEl && mainSearchInputEl.value !== termo) { // Atualiza o input se a busca veio de um clique
        mainSearchInputEl.value = termo;
    }

    try {
        const encodedTermo = encodeURIComponent(termo);
        const res = await fetch(`${API_URL}/por-termo/${encodedTermo}`);
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Erro ${res.status} ao buscar postagens por termo: ${errorText}`);
        }
        const postagensEncontradas = await res.json();
        exibirPostagens(postagensEncontradas);
    } catch (error) {
        console.error(`Erro ao buscar postagens por termo "${termo}":`, error);
        listaPostagensEl.innerHTML = `<p style="text-align:center; padding:20px;">Erro ao buscar postagens sobre "${termo}".</p>`;
        Swal.fire('Erro', `Não foi possível buscar postagens: ${error.message}`, 'error');
    }
}

function configurarBotoesContato() {
    if (!modalContatoEl || !closeContatoModalBtnEl || !modalTelefoneEl || !modalEmailEl) return;
    document.addEventListener('click', function (e) {
        const targetButton = e.target.closest('.btn-contato');
        if (targetButton) {
            const contato = targetButton.dataset.contato || 'Não informado';
            const email = targetButton.dataset.email || 'Não informado';
            modalTelefoneEl.textContent = contato;
            modalEmailEl.textContent = email;
            if (contato !== 'Não informado' && contato.replace(/\D/g, '').length > 0) {
                modalTelefoneEl.href = `tel:${contato.replace(/\D/g, '')}`;
            } else {
                modalTelefoneEl.removeAttribute('href');
                modalTelefoneEl.textContent = 'Não informado';
            }
            if (email !== 'Não informado' && email.includes('@')) {
                modalEmailEl.href = `mailto:${email}`;
            } else {
                modalEmailEl.removeAttribute('href');
                modalEmailEl.textContent = 'Não informado';
            }
            modalContatoEl.style.display = 'flex';
        }
    });
    if(closeContatoModalBtnEl) {
        closeContatoModalBtnEl.addEventListener('click', () => {
            modalContatoEl.style.display = 'none';
        });
    }
    if(modalContatoEl) {
        modalContatoEl.addEventListener('click', (e) => {
            if (e.target === modalContatoEl) {
                modalContatoEl.style.display = 'none';
            }
        });
    }
}

async function criarPostagemHandler(event) {
    event.preventDefault();
    if (!userId) {
        Swal.fire('Login Necessário', 'Você precisa estar logado para criar uma postagem.', 'info');
        return;
    }
    if (!tituloInputEl || !descricaoInputEl || !imagemUploadInputEl) {
        Swal.fire('Erro de Interface', 'Elementos do formulário de postagem não encontrados.', 'error');
        return;
    }
    const titulo = tituloInputEl.value.trim();
    const descricao = descricaoInputEl.value.trim();
    if (!titulo) {
        Swal.fire('Atenção!', 'O título é obrigatório!', 'warning');
        return;
    }
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("usuarioId", String(userId));
    const categoriaSelecionadaEl = document.getElementById('categoriaPost'); // Supondo que você adicionou este select no HTML
    if (categoriaSelecionadaEl && categoriaSelecionadaEl.value) {
        formData.append("categoriaId", categoriaSelecionadaEl.value);
    }
    if (imagemUploadInputEl.files.length > 0) {
        formData.append("imagem", imagemUploadInputEl.files[0]);
    }
    try {
        const res = await fetch(`${API_URL}/criar`, { method: 'POST', body: formData });
        if (!res.ok) {
            const errorMsg = await res.text();
            throw new Error(errorMsg || 'Erro ao criar postagem');
        }
        tituloInputEl.value = '';
        descricaoInputEl.value = '';
        if (imagemUploadInputEl) imagemUploadInputEl.value = '';
        if (categoriaSelecionadaEl) categoriaSelecionadaEl.value = ''; // Limpa o select de categoria
        if (modalPublicacaoEl) modalPublicacaoEl.style.display = 'none';

        Swal.fire('Sucesso!', 'Postagem criada com sucesso!', 'success');
        carregarTodasPostagens();
    } catch (err) {
        Swal.fire('Erro!', `Erro ao criar postagem: ${err.message}`, 'error');
        console.error('Erro ao criar postagem:', err);
    }
}

function handleLogout() {
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('token');
    Swal.fire('Deslogado', 'Você foi desconectado com sucesso.', 'success').then(() => {
        window.location.href = './LoginRegister.html';
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggleBtn && sidebar) {
        menuToggleBtn.addEventListener('click', () => sidebar.classList.toggle('active'));
    }

    if (userId) {
        await carregarPerfil();
        await carregarTodasPostagens();
        if(mainSearchInputEl) mainSearchInputEl.style.display = 'block';
        if(searchButtonEl) searchButtonEl.style.display = 'block';
    } else {
        if(listaPostagensEl) listaPostagensEl.innerHTML = '<p style="text-align:center; padding:20px;">Bem-vindo! Faça <a href="./LoginRegister.html">login</a> ou <a href="./LoginRegister.html">registre-se</a> para interagir.</p>';
        if(postBoxEl) postBoxEl.style.display = 'none';
        if(mainSearchInputEl) mainSearchInputEl.style.display = 'none';
        if(searchButtonEl) searchButtonEl.style.display = 'none';
        if(document.querySelector('.menu-link svg[fill="white"]')) {
            document.querySelectorAll('.sidebar .menu-lateral li').forEach(li => {
                const link = li.querySelector('a');
                if (link && (link.href.includes('Profile.html') || link.href.includes('Settings.html'))) {
                    li.style.display = 'none';
                }
                if (link && link.id === 'logoutButton') {
                    li.style.display = 'none';
                }
            });
            const loginRegisterLink = document.querySelector('a.menu-link[href="./LoginRegister.html"]:not(#logoutButton)');
            if (loginRegisterLink && loginRegisterLink.parentElement.tagName === 'LI') {
                loginRegisterLink.parentElement.style.display = 'list-item';
            }
        }
    }

    if (postBoxEl) {
        postBoxEl.addEventListener('click', () => {
            if (!userId) {
                Swal.fire('Login Necessário', 'Você precisa estar logado para criar uma publicação.', 'info');
                return;
            }
            if(modalPublicacaoEl) modalPublicacaoEl.style.display = 'flex';
        });
    }
    if (closeModalBtnEl && modalPublicacaoEl) {
        closeModalBtnEl.addEventListener('click', () => modalPublicacaoEl.style.display = 'none');
    }
    if (criarPostBtnEl) {
        criarPostBtnEl.addEventListener('click', criarPostagemHandler);
    }

    // Lógica de busca por digitação e Enter
    if (mainSearchInputEl && userId) {
        mainSearchInputEl.addEventListener('focus', mostrarCategoriasSugeridas);

        const debouncedSearchOnInput = debounce((term) => {
            if (term === '') {
                mostrarCategoriasSugeridas();
            } else {
                buscarPostagensPeloTermoSelecionado(term);
                if (categoriasDropdownEl) categoriasDropdownEl.style.display = 'none';
            }
        }, 700); // Atraso de 700ms para o debounce

        mainSearchInputEl.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim().toLowerCase();
            debouncedSearchOnInput(searchTerm);
        });

        mainSearchInputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Previne qualquer comportamento padrão do Enter
                const searchTerm = mainSearchInputEl.value.trim();
                // Cancela qualquer busca debounced (se o debounce retornasse um ID de timeout, limparíamos aqui)
                // Como não retorna, a busca por Enter será imediata.
                if (searchTerm) {
                    buscarPostagensPeloTermoSelecionado(searchTerm);
                    if (categoriasDropdownEl) categoriasDropdownEl.style.display = 'none';
                } else {
                    // Se Enter com campo vazio, pode recarregar todas ou manter dropdown (se visível)
                    carregarTodasPostagens();
                    if (categoriasDropdownEl) categoriasDropdownEl.style.display = 'none';
                }
            }
        });
    }

    // Listener para o botão de busca (ícone de lupa)
    if(searchButtonEl && mainSearchInputEl && userId) {
        searchButtonEl.addEventListener('click', () => {
            const searchTerm = mainSearchInputEl.value.trim();
            if(searchTerm) {
                buscarPostagensPeloTermoSelecionado(searchTerm);
                if (categoriasDropdownEl) categoriasDropdownEl.style.display = 'none';
            } else {
                // Se o campo estiver vazio e clicar na lupa, mostra as sugestões
                mostrarCategoriasSugeridas();
            }
        });
    }

    // Fechar dropdown de categorias quando clicar fora
    document.addEventListener('click', (e) => {
        if (categoriasDropdownEl && categoriasDropdownEl.style.display === 'block') {
            const searchWrapper = e.target.closest('.search-wrapper'); // Seu input e dropdown devem estar dentro de .search-wrapper
            if (!searchWrapper) {
                categoriasDropdownEl.style.display = 'none';
            }
        }
    });

    // Modal de Categorias Dinâmicas (geral, se usado)
    if (closeModalCategoriasDinamicasBtnEl && modalCategoriasDinamicasEl) {
        closeModalCategoriasDinamicasBtnEl.addEventListener('click', () => {
            modalCategoriasDinamicasEl.style.display = 'none';
        });
        modalCategoriasDinamicasEl.addEventListener('click', (event) => {
            if (event.target === modalCategoriasDinamicasEl) {
                modalCategoriasDinamicasEl.style.display = 'none';
            }
        });
    }

    const limparBuscaButtonPrincipalEl = document.getElementById('limparBuscaButtonPrincipal');
    if (limparBuscaButtonPrincipalEl && userId) {
        limparBuscaButtonPrincipalEl.addEventListener('click', () => {
            if (mainSearchInputEl) mainSearchInputEl.value = '';
            carregarTodasPostagens();
            if (categoriasDropdownEl) categoriasDropdownEl.style.display = 'none';
        });
    }

    if(logoutButtonEl) {
        if (userId) {
            logoutButtonEl.parentElement.style.display = 'list-item';
            const loginRegisterLink = document.querySelector('a.menu-link[href="./LoginRegister.html"]:not(#logoutButton)');
            if (loginRegisterLink && loginRegisterLink.parentElement.tagName === 'LI') {
                loginRegisterLink.parentElement.style.display = 'none';
            }
        } else {
            logoutButtonEl.parentElement.style.display = 'none';
        }
        logoutButtonEl.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    } else {
        if(!userId) {
            const loginLink = document.querySelector('a.menu-link[href="./LoginRegister.html"]');
            if(loginLink && loginLink.parentElement.tagName === 'LI') {
                loginLink.parentElement.style.display = 'list-item';
            }
        }
    }
});