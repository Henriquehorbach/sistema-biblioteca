const form = document.getElementById('form_categoria');
const inputCategoria = document.getElementById('input_nova_categoria');
const listaCategorias = document.getElementById('lista_categorias');
const alertaErro = document.getElementById('alerta_erro');
const textoAlerta = document.getElementById('texto_alerta');

let bancoCategorias = JSON.parse(localStorage.getItem('banco_categorias')) || ['Ficção Científica', 'Romance', 'Técnico / Didático'];

function salvarNoBanco() {
    localStorage.setItem('banco_categorias', JSON.stringify(bancoCategorias));
    desenharLista();
}

function desenharLista() {
    listaCategorias.innerHTML = '';
    bancoCategorias.forEach((categoria, index) => {
        listaCategorias.innerHTML += `
            <div class="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 items-center hover:bg-white transition-colors group mt-1 rounded-xl mx-2">
                <div class="col-span-6 md:col-span-8 font-bold text-slate-700">${categoria}</div>
                <div class="col-span-3 md:col-span-2 text-center">
                    <span class="bg-emerald-100/80 text-emerald-700 text-[10px] uppercase font-bold px-3 py-1.5 rounded-full border border-emerald-200">Ativo</span>
                </div>
                <div class="col-span-3 md:col-span-2 flex justify-center space-x-2">
                    <button onclick="editarCategoria(${index})" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Editar"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg></button>
                    <button onclick="excluirCategoria(${index})" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Excluir"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg></button>
                </div>
            </div>
        `;
    });
}

function mostrarErro(mensagem) {
    textoAlerta.innerText = mensagem;
    alertaErro.classList.remove('hidden');
    setTimeout(() => alertaErro.classList.add('hidden'), 3000);
}

form.addEventListener('submit', function(evento) {
    evento.preventDefault();
    const nome = inputCategoria.value.trim();
    if (nome === '') { mostrarErro('Digite um nome!'); return; }
    if (bancoCategorias.map(c => c.toLowerCase()).includes(nome.toLowerCase())) {
        mostrarErro('Esta categoria já existe!'); return;
    }
    bancoCategorias.push(nome);
    inputCategoria.value = '';
    salvarNoBanco();
});

const janelaModal = document.getElementById('janela_modal');
const modalInput = document.getElementById('modal_input');
let funcaoConfirmacao = null;

function abrirModal(opcoes) {
    document.getElementById('modal_titulo').innerText = opcoes.titulo;
    document.getElementById('modal_mensagem').innerText = opcoes.mensagem;
    modalInput.classList.toggle('hidden', !opcoes.mostrarInput);
    if(opcoes.mostrarInput) modalInput.value = opcoes.valorInput;
    
    const btnConfirmar = document.getElementById('modal_btn_confirmar');
    btnConfirmar.className = `px-5 py-2.5 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 ${opcoes.corBotao === 'vermelho' ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/30' : 'bg-gradient-to-r from-indigo-600 to-violet-600 shadow-indigo-500/30'}`;
    
    funcaoConfirmacao = opcoes.aoConfirmar;
    janelaModal.classList.remove('hidden');
}

document.getElementById('modal_btn_cancelar').addEventListener('click', () => janelaModal.classList.add('hidden'));
document.getElementById('modal_btn_confirmar').addEventListener('click', () => {
    if (funcaoConfirmacao) funcaoConfirmacao(modalInput.value.trim());
    janelaModal.classList.add('hidden');
});

window.excluirCategoria = function(index) {
    abrirModal({
        titulo: 'Excluir Categoria', mensagem: 'Esta ação não pode ser desfeita. Continuar?', corBotao: 'vermelho', mostrarInput: false,
        aoConfirmar: () => { bancoCategorias.splice(index, 1); salvarNoBanco(); }
    });
}

window.editarCategoria = function(index) {
    abrirModal({
        titulo: 'Editar Categoria', mensagem: 'Insira o novo nome abaixo:', corBotao: 'azul', mostrarInput: true, valorInput: bancoCategorias[index],
        aoConfirmar: (novoNome) => {
            if (novoNome === '' || (novoNome.toLowerCase() !== bancoCategorias[index].toLowerCase() && bancoCategorias.map(c => c.toLowerCase()).includes(novoNome.toLowerCase()))) {
                mostrarErro('Erro: Nome vazio ou já existe!'); return;
            }
            bancoCategorias[index] = novoNome;
            salvarNoBanco();
        }
    });
}

desenharLista();