
let bancoLivros = [
    { id: 1, isbn: "978-85-209-2259-2", titulo: "Dom Casmurro", autor: "Machado de Assis", categoria: "Romance", ano: 1899, estoque: 3, capa: "https://placehold.co/400x600/4f46e5/ffffff?font=Montserrat&text=Dom+Casmurro" },
    { id: 2, isbn: "978-85-359-1484-9", titulo: "1984", autor: "George Orwell", categoria: "Ficção Científica", ano: 1949, estoque: 5, capa: "https://placehold.co/400x600/0f172a/ffffff?font=Montserrat&text=1984" },
    { id: 3, isbn: "978-85-508-0360-8", titulo: "Hábitos Atômicos", autor: "James Clear", categoria: "Negócios", ano: 2018, estoque: 0, capa: "https://placehold.co/400x600/f59e0b/ffffff?font=Montserrat&text=Habitos+Atomicos" },
    { id: 4, isbn: "978-85-325-1101-0", titulo: "Harry Potter", autor: "J.K. Rowling", categoria: "Fantasia", ano: 1997, estoque: 12, capa: "https://placehold.co/400x600/7e22ce/ffffff?font=Montserrat&text=Harry+Potter" },
    { id: 5, isbn: "978-85-760-8267-5", titulo: "Pai Rico, Pai Pobre", autor: "Robert T. Kiyosaki", categoria: "Negócios", ano: 1997, estoque: 2, capa: "https://placehold.co/400x600/10b981/ffffff?font=Montserrat&text=Pai+Rico\nPai+Pobre" },
    { id: 6, isbn: "978-85-950-8153-6", titulo: "O Senhor dos Anéis", autor: "J.R.R. Tolkien", categoria: "Fantasia", ano: 1954, estoque: 7, capa: "https://placehold.co/400x600/b45309/ffffff?font=Montserrat&text=Senhor+dos\nAneis" },
    { id: 7, isbn: "978-85-220-3112-4", titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", categoria: "Ficção", ano: 1943, estoque: 1, capa: "https://placehold.co/400x600/3b82f6/ffffff?font=Montserrat&text=Pequeno\nPrincipe" },
    { id: 8, isbn: "978-85-010-1477-1", titulo: "A Arte da Guerra", autor: "Sun Tzu", categoria: "Negócios", ano: 2000, estoque: 0, capa: "https://placehold.co/400x600/ef4444/ffffff?font=Montserrat&text=Arte+da\nGuerra" }
];

const gradeLivros = document.getElementById('grade_livros');
const containerPaginacao = document.getElementById('paginacao');
const inputPesquisa = document.getElementById('input_pesquisa');
const filtroCategoria = document.getElementById('filtro_categoria');
const filtroOrdenacao = document.getElementById('filtro_ordenacao');

let visualizacaoAtual = 'grid'; 
let paginaAtual = 1;

const itensPorPagina = 4; 
let livroParaExcluir = null;

function renderizarLivros(livrosFiltrados) {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const livrosPagina = livrosFiltrados.slice(inicio, fim);

    if (livrosPagina.length === 0) {
        gradeLivros.className = "w-full";
        gradeLivros.innerHTML = `
            <div class="col-span-full text-center py-16 bg-white/40 rounded-3xl border-2 border-dashed border-slate-200">
                <p class="text-slate-500 font-bold text-lg mb-2">Nenhum livro encontrado!</p>
            </div>
        `;
        containerPaginacao.innerHTML = '';
        return;
    }

    let HTMLAcumulado = '';

    livrosPagina.forEach(livro => {
        const corEstoque = livro.estoque > 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200';
        const textoEstoque = livro.estoque > 0 ? `${livro.estoque} disp.` : 'Indisp.';

        if (visualizacaoAtual === 'grid') {
            gradeLivros.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 transition-all";
            HTMLAcumulado += `
                <div class="bg-white/60 border border-white/60 rounded-[1.5rem] p-4 flex flex-col hover:shadow-2xl hover:border-indigo-200 transition-all transform hover:-translate-y-1 group relative w-full">
                    <div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden mb-5 shadow-md">
                        <img src="${livro.capa}" alt="${livro.titulo}" loading="lazy" class="w-full h-full object-cover bg-slate-100">
                        <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4 backdrop-blur-[2px]">
                            <button onclick="abrirModalEditar(${livro.id})" class="bg-white/90 hover:bg-white text-indigo-600 p-3 rounded-full hover:scale-110 shadow-lg"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                            <button onclick="abrirModalExcluir(${livro.id})" class="bg-rose-500/90 hover:bg-rose-500 text-white p-3 rounded-full hover:scale-110 shadow-lg"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                        </div>
                    </div>
                    <div class="flex-grow flex flex-col">
                        <span class="text-[10px] font-black uppercase text-indigo-500 mb-1">${livro.categoria}</span>
                        <h4 class="text-lg font-extrabold text-slate-800 leading-tight mb-1 line-clamp-2">${livro.titulo}</h4>
                        <p class="text-sm text-slate-500 mb-4">${livro.autor}</p>
                        <div class="mt-auto pt-4 border-t border-slate-200/60 flex items-center justify-between">
                            <span class="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md truncate max-w-[50%]">${livro.ano}</span>
                            <span class="px-2 py-1 text-[10px] uppercase font-bold rounded-md border ${corEstoque}">${textoEstoque}</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            gradeLivros.className = "flex flex-col gap-4 w-full";
            HTMLAcumulado += `
                <div class="bg-white/60 border border-white/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center hover:shadow-lg transition-all group w-full">
                    <img src="${livro.capa}" alt="${livro.titulo}" loading="lazy" class="w-full sm:w-16 h-48 sm:h-24 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6 shadow-sm">
                    <div class="flex-grow flex flex-col sm:flex-row sm:items-center justify-between w-full">
                        <div class="mb-4 sm:mb-0">
                            <span class="text-[10px] font-black uppercase text-indigo-500">${livro.categoria}</span>
                            <h4 class="text-lg font-extrabold text-slate-800 leading-tight">${livro.titulo}</h4>
                            <p class="text-sm text-slate-500">${livro.autor} • <span class="text-xs text-slate-400">${livro.ano}</span></p>
                        </div>
                        <div class="flex items-center space-x-3 sm:space-x-4 self-end sm:self-auto">
                            <span class="px-3 py-1.5 text-xs uppercase font-bold rounded-lg border ${corEstoque}">${textoEstoque}</span>
                            <button onclick="abrirModalEditar(${livro.id})" class="text-indigo-400 hover:text-indigo-600 bg-white p-2 rounded-lg shadow-sm border"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                            <button onclick="abrirModalExcluir(${livro.id})" class="text-rose-400 hover:text-rose-600 bg-white p-2 rounded-lg shadow-sm border"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    gradeLivros.innerHTML = HTMLAcumulado;
    renderizarControlesPaginacao(livrosFiltrados.length);
}

function filtrarAcervo() {
    const termo = inputPesquisa.value.toLowerCase();
    const categoriaSelecionada = filtroCategoria.value;
    const ordenacaoSelecionada = filtroOrdenacao.value;

    let livrosFiltrados = bancoLivros.filter(livro => {
        const bateuTexto = livro.titulo.toLowerCase().includes(termo) || 
                           livro.autor.toLowerCase().includes(termo) || 
                           livro.isbn.includes(termo);
        const bateuCategoria = categoriaSelecionada === 'todos' || livro.categoria === categoriaSelecionada;
        return bateuTexto && bateuCategoria;
    });

    if (ordenacaoSelecionada === 'az') livrosFiltrados.sort((a, b) => a.titulo.localeCompare(b.titulo));
    else if (ordenacaoSelecionada === 'za') livrosFiltrados.sort((a, b) => b.titulo.localeCompare(a.titulo));
    else if (ordenacaoSelecionada === 'estoque_maior') livrosFiltrados.sort((a, b) => b.estoque - a.estoque);

    renderizarLivros(livrosFiltrados);
}

function mudarVisualizacao(tipo) {
    visualizacaoAtual = tipo;
    const btnGrid = document.getElementById('btn_grid');
    const btnLista = document.getElementById('btn_lista');

    if(tipo === 'grid') {
        btnGrid.classList.replace('text-slate-400', 'bg-white');
        btnGrid.classList.add('text-indigo-600', 'shadow-sm');
        btnLista.classList.replace('bg-white', 'text-slate-400');
        btnLista.classList.remove('text-indigo-600', 'shadow-sm');
    } else {
        btnLista.classList.replace('text-slate-400', 'bg-white');
        btnLista.classList.add('text-indigo-600', 'shadow-sm');
        btnGrid.classList.replace('bg-white', 'text-slate-400');
        btnGrid.classList.remove('text-indigo-600', 'shadow-sm');
    }
    paginaAtual = 1; 
    filtrarAcervo();
}

function renderizarControlesPaginacao(totalLivros) {
    containerPaginacao.innerHTML = '';
    const totalPaginas = Math.ceil(totalLivros / itensPorPagina);
    if (totalPaginas <= 1) return; 

    let botoesHTML = '';
    for (let i = 1; i <= totalPaginas; i++) {
        const classeAtivo = i === paginaAtual 
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
            : "bg-white/60 text-slate-500 hover:bg-slate-200";
        botoesHTML += `<button onclick="mudarPagina(${i})" class="w-10 h-10 flex items-center justify-center font-bold rounded-xl transition-all ${classeAtivo}">${i}</button>`;
    }
    containerPaginacao.innerHTML = botoesHTML;
}

function mudarPagina(novaPagina) {
    paginaAtual = novaPagina;
    filtrarAcervo();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}


function abrirModalExcluir(id) {
    const livro = bancoLivros.find(l => l.id === id);
    livroParaExcluir = id;
    document.getElementById('nome_livro_excluir').innerText = `"${livro.titulo}"`;
    const modal = document.getElementById('modal_excluir');
    const conteudo = document.getElementById('modal_excluir_conteudo');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    conteudo.classList.remove('scale-95');
    conteudo.classList.add('scale-100');
}

function fecharModalExcluir() {
    livroParaExcluir = null;
    const modal = document.getElementById('modal_excluir');
    const conteudo = document.getElementById('modal_excluir_conteudo');
    modal.classList.add('opacity-0', 'pointer-events-none');
    conteudo.classList.remove('scale-100');
    conteudo.classList.add('scale-95');
}

function confirmarExclusao() {
    if (livroParaExcluir !== null) {
        bancoLivros = bancoLivros.filter(l => l.id !== livroParaExcluir);
        if(bancoLivros.length % itensPorPagina === 0 && paginaAtual > 1) paginaAtual--; 
        filtrarAcervo();
        fecharModalExcluir();
    }
}

function abrirModalEditar(id) {
    const livro = bancoLivros.find(l => l.id === id);
    document.getElementById('nome_livro_editar').innerText = `"${livro.titulo}"`;
    const modal = document.getElementById('modal_editar');
    const conteudo = document.getElementById('modal_editar_conteudo');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    conteudo.classList.remove('scale-95');
    conteudo.classList.add('scale-100');
}

function fecharModalEditar() {
    const modal = document.getElementById('modal_editar');
    const conteudo = document.getElementById('modal_editar_conteudo');
    modal.classList.add('opacity-0', 'pointer-events-none');
    conteudo.classList.remove('scale-100');
    conteudo.classList.add('scale-95');
}

inputPesquisa.addEventListener('input', () => { paginaAtual = 1; filtrarAcervo(); });
filtroCategoria.addEventListener('change', () => { paginaAtual = 1; filtrarAcervo(); });
filtroOrdenacao.addEventListener('change', () => { paginaAtual = 1; filtrarAcervo(); });

document.getElementById('modal_excluir').addEventListener('click', function(e) {
    if (e.target === this) fecharModalExcluir();
});

document.getElementById('modal_editar').addEventListener('click', function(e) {
    if (e.target === this) fecharModalEditar();
});

filtrarAcervo();