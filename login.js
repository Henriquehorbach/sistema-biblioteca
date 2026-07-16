const botao = document.getElementById('botao_login');
const linkEsqueciSenha = document.getElementById('link_esqueci_senha');
const campoUsuario = document.getElementById('login_usuario');
const campoSenha = document.getElementById('senha_acesso');
const caixaMensagem = document.getElementById('mensagem_alerta');
const toggleSenha = document.getElementById('toggle_senha');
const iconeOlho = document.getElementById('icone_olho');


toggleSenha.addEventListener('click', function() {
    if (campoSenha.type === 'password') {
        campoSenha.type = 'text'; 
        iconeOlho.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />`;
    } else {
        campoSenha.type = 'password'; 
        iconeOlho.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                               <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />`;
    }
});

botao.addEventListener('click', function(evento) {
    evento.preventDefault();

    caixaMensagem.classList.add('hidden');
    
    const textoOriginal = botao.innerText;
    botao.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Autenticando...
    `;
    botao.disabled = true; 
    botao.classList.add('opacity-80', 'cursor-not-allowed');

    setTimeout(function() {
        
        botao.innerText = textoOriginal;
        botao.disabled = false;
        botao.classList.remove('opacity-80', 'cursor-not-allowed');

        if (campoUsuario.value === '' || campoSenha.value === '') {
            caixaMensagem.className = 'w-full text-center p-3 rounded-lg text-sm font-semibold mb-4 bg-red-50 text-red-600 border border-red-200 transition-all block';
            caixaMensagem.innerText = 'Atenção: Por favor, preencha o Usuário e a Senha!';
        } else {
            caixaMensagem.className = 'w-full text-center p-3 rounded-lg text-sm font-semibold mb-4 bg-green-50 text-green-600 border border-green-200 transition-all block';
            caixaMensagem.innerText = 'Sucesso! O sistema fará o redirecionamento para o Painel.';
        }
    }, 1500); 
});

linkEsqueciSenha.addEventListener('click', function(evento) {
    evento.preventDefault();
    caixaMensagem.className = 'w-full text-center p-3 rounded-lg text-sm font-semibold mb-4 bg-blue-50 text-blue-600 border border-blue-200 transition-all block';
    caixaMensagem.innerText = 'Instruções de recuperação enviadas para o e-mail cadastrado.';
});