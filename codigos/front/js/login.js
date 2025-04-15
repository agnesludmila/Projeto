'use strict'

const loginContainer = document.getElementById('login-container')

const moveOverlay = () => loginContainer.classList.toggle('move')

document.getElementById('cadastrar').addEventListener('click', moveOverlay)
document.getElementById('entrar').addEventListener('click', moveOverlay)