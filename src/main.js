import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import './main.scss';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
import { router } from './router/index.routes';
import view from './main.html';

//router(window.location.hash);

window.addEventListener('hashchange',() =>{
    router(window.location.hash);

     if(window.location.hash == ''){
        document.getElementById('root').innerHTML = '<img src="https://us.123rf.com/450wm/putracetol/putracetol1805/putracetol180502115/101062129-dise%C3%B1o-del-icono-del-logotipo-de-la-computadora.jpg?ver=6" class="image-home">';
     }
});

//window.addEventListener("DOMContentLoaded", function() {
//    if(window.location.hash == ''){
//        document.getElementById('root').innerHTML = '';
//    }else{
//        document.getElementById('menu').innerHTML = view;
//    }
//});




document.getElementById('login-registar').addEventListener('click', () => {
    document.getElementById('menu').innerHTML = view;
    document.getElementById('root').innerHTML = '<img src="https://us.123rf.com/450wm/putracetol/putracetol1805/putracetol180502115/101062129-dise%C3%B1o-del-icono-del-logotipo-de-la-computadora.jpg?ver=6" class="image-home">';
});