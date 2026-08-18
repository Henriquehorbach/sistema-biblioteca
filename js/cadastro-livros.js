const janelaAviso = document.getElementById('janela_aviso');

function mostrarAviso(titulo, mensagem, tipo) {
    document.getElementById('titulo_aviso').innerText = titulo;
    document.getElementById('texto_aviso').innerText = mensagem;
    const icone = document.getElementById('icone_aviso');
    const btn = document.getElementById('btn_fechar_aviso');

    if (tipo === 'erro') {
        icone.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-100 to-red-50 mb-5 text-rose-600 shadow-inner transform -rotate-3';
        icone.innerHTML = '<svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
        btn.className = 'w-full px-5 py-3.5 bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/30 transform hover:-translate-y-0.5 transition-all';
    } else {
        icone.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 mb-5 text-emerald-600 shadow-inner transform -rotate-3';
        icone.innerHTML = '<svg fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
        btn.className = 'w-full px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all';
    }
    janelaAviso.classList.remove('hidden');
}
document.getElementById('btn_fechar_aviso').addEventListener('click', () => janelaAviso.classList.add('hidden'));

const areaVazia = document.getElementById('area_vazia');
const areaPreview = document.getElementById('area_preview');
const imgPreview = document.getElementById('imagem_padronizada');

function exibirFotoPadronizada(urlImagem) {
    imgPreview.src = urlImagem;
    areaVazia.classList.add('hidden');
    areaPreview.classList.remove('hidden');
}

document.getElementById('upload_capa').addEventListener('change', function(evento) {
    const arquivo = evento.target.files[0];
    if (arquivo) {
        const leitor = new FileReader();
        leitor.onload = function(e) { exibirFotoPadronizada(e.target.result); }
        leitor.readAsDataURL(arquivo);
    }
});

document.getElementById('btn_remover_foto').addEventListener('click', function() {
    imgPreview.src = '';
    areaPreview.classList.add('hidden');
    areaVazia.classList.remove('hidden');
    document.getElementById('upload_capa').value = '';
});

const modalCamera = document.getElementById('modal_camera');
const video = document.getElementById('video_webcam');
const canvas = document.getElementById('canvas_foto');
let streamCâmera = null;

document.getElementById('btn_abrir_webcam').addEventListener('click', async function() {
    try {
        streamCâmera = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = streamCâmera;
        modalCamera.classList.remove('hidden');
    } catch (erro) {
        mostrarAviso('Câmera Bloqueada', 'Não conseguimos acessar sua câmera. Verifique permissões.', 'erro');
    }
});

function fecharCamera() {
    modalCamera.classList.add('hidden');
    if(streamCâmera) streamCâmera.getTracks().forEach(track => track.stop());
}

document.getElementById('btn_cancelar_camera').addEventListener('click', fecharCamera);
document.getElementById('btn_bater_foto').addEventListener('click', function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    exibirFotoPadronizada(canvas.toDataURL('image/jpeg'));
    fecharCamera();
});

document.getElementById('btn_buscar_isbn').addEventListener('click', function() {
    const codigo = document.getElementById('codigo_barras').value.trim();
    if(!codigo) { mostrarAviso('Código em Branco', 'Digite ou bipe um ISBN para buscar.', 'erro'); return; }

    const btn = this;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;

    setTimeout(() => {
        document.getElementById('titulo').value = 'Hábitos Atômicos';
        document.getElementById('autor').value = 'James Clear';
        document.getElementById('ano').value = '2018';
        exibirFotoPadronizada('https://m.media-amazon.com/images/I/81LfaG16zmL._SY466_.jpg'); 
        btn.innerHTML = originalText; 
    }, 500); 
});

const selectCategoria = document.getElementById('select_categoria');
const containerTags = document.getElementById('container_tags');
let bancoCategorias = JSON.parse(localStorage.getItem('banco_categorias')) || ['Inovação', 'Negócios', 'Tecnologia'];

selectCategoria.innerHTML = '<option value="" disabled selected>Escolha os gêneros...</option>';
bancoCategorias.forEach(c => selectCategoria.innerHTML += `<option value="${c}">${c}</option>`);

let tags = [];
selectCategoria.addEventListener('change', function() {
    if (this.value && !tags.includes(this.value)) { tags.push(this.value); desenharTags(); }
    this.value = '';
});

function desenharTags() {
    containerTags.innerHTML = ''; 
    tags.forEach(g => {
        const tag = document.createElement('span');
        tag.className = 'inline-flex items-center px-4 py-1.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-700 mt-2 shadow-sm border border-indigo-200/50 uppercase tracking-wide';
        tag.innerHTML = `${g} <button type="button" class="ml-2 text-indigo-400 hover:text-rose-600 transition-colors" onclick="tags=tags.filter(t=>t!=='${g}');desenharTags()"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg></button>`;
        containerTags.appendChild(tag);
    });
}

document.getElementById('btn_salvar_livro').addEventListener('click', function() {
    const cod = document.getElementById('codigo_barras').value.trim();
    const tit = document.getElementById('titulo').value.trim();
    const aut = document.getElementById('autor').value.trim();

    if(!tit || !aut || !cod) {
        mostrarAviso('Campos Obrigatórios', 'Os campos com asterisco (*) precisam ser preenchidos.', 'erro');
        return;
    }

    mostrarAviso('Pronto!', `O livro "${tit}" está agora no seu acervo virtual.`, 'sucesso');
    document.getElementById('form_livro').reset(); 
    tags = []; desenharTags(); 
    document.getElementById('btn_remover_foto').click();
});

document.getElementById('codigo_barras').addEventListener('keypress', function(evento) {
    if (evento.key === 'Enter') {
        evento.preventDefault(); 
        document.getElementById('btn_buscar_isbn').click(); 
    }
});