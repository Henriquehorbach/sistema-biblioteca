
const botao = document.getElementById('botao_login');
const campoUsuario = document.getElementById('login_usuario');
const campoSenha = document.getElementById('senha_acesso');

botao.addEventListener('click', function(evento) {
    evento.preventDefault(); 
    if (campoUsuario.value === '' || campoSenha.value === '') {
        alert('Atenção: Por favor, preencha o Usuário e a Senha antes de continuar!');
    } 
    else {
        alert('Sucesso! Bem-vindo ao sistema, ' + campoUsuario.value + '!');
    }
});