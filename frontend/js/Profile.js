const API_URL = 'http://localhost:8080/perfil';
const userId = localStorage.getItem('usuarioId');
import { exibirNotificacao } from './notificacao.js';

if (!userId) throw new Error("Usuário não autenticado.");

const nomeCompletoEl = document.getElementById('nomeCompleto');
const biografiaEl = document.getElementById('biografia');
const emailLinkEl = document.getElementById('emailLink');
const telefoneLinkEl = document.getElementById('telefoneLink');
const postCountEl = document.getElementById('post-count');
const commentCountEl = document.getElementById('comment-count');

const modal = document.getElementById('editModal');
const openModalBtn = document.getElementById('openModalBtn');
const saveBtn = document.querySelector('.save-btn');

const inputNome = document.getElementById('nome');
const inputEmail = document.getElementById('email');
const inputBio = document.getElementById('biografiaid');
const inputTelefone = document.getElementById('telefone');
const photoUploadInp = document.getElementById('photo-upload');
const previewImgMain = document.getElementById('preview-img');
const previewImgModal = document.getElementById('preview-img-modal');

let selectedFile = null;

window.addEventListener('DOMContentLoaded', carregarPerfil);

openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
});

photoUploadInp.addEventListener('change', () => {
    const file = photoUploadInp.files[0];
    if (!file) return;
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = e => previewImgModal.src = e.target.result;
    reader.readAsDataURL(file);
});

saveBtn.addEventListener('click', async () => {
    try {
        let fotoUrl = previewImgMain.src;
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const uploadResp = await fetch(`${API_URL}/${userId}/foto`, {
                method: 'POST',
                body: formData
            });
            if (!uploadResp.ok) throw new Error('Falha no upload da foto');
            const uploadData = await uploadResp.json();
            fotoUrl = uploadData.url;
        }

        const payload = {
            nome: inputNome.value.trim(),
            telefone: inputTelefone.value.trim(),
            biografia: inputBio.value.trim(),
            fotoPerfil: fotoUrl
        };

        const resp = await fetch(`${API_URL}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!resp.ok) {
            const err = await resp.text();
            throw new Error(err || 'Erro ao atualizar perfil');
        }

        modal.style.display = 'none';
        selectedFile = null;
        exibirNotificacao('Perfil atualizado com sucesso!', true);
        await carregarPerfil();
    } catch (err) {
        exibirNotificacao(err.message, false);
    }
});

async function carregarPerfil() {
    try {
        const res = await fetch(`${API_URL}/${userId}`);
        if (!res.ok) throw new Error('Erro ao buscar dados');
        const data = await res.json();

        nomeCompletoEl.textContent = data.nome || 'Nome não definido';
        biografiaEl.textContent = data.biografia || 'Adicione uma biografia';
        emailLinkEl.textContent = data.email;
        emailLinkEl.href = `mailto:${data.email}`;
        telefoneLinkEl.textContent = data.telefone || 'Não informado';
        telefoneLinkEl.href = `tel:${data.telefone}`;
        postCountEl.textContent = data.qntPosts || 0;
        commentCountEl.textContent = data.qntComentario || 0;

        inputNome.value = data.nome || '';
        inputEmail.value = data.email || '';
        inputBio.value = data.biografia || '';
        inputTelefone.value = data.telefone || '';
        previewImgMain.src = data.fotoPerfil
            ? `http://localhost:8080${data.fotoPerfil}?t=${Date.now()}`
            : './imgprofile/ImagemProfile.jpg';
        previewImgModal.src = previewImgMain.src;
    } catch {
        exibirNotificacao('Erro ao carregar perfil', false);
    }
}
