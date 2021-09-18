import {pages} from '../controllers/pages.controller';

let root  = document.getElementById('root');

const router = async (route) => {
    root.innerHTML = '';

    switch(route) {
        case '#/Productos':{
            return root.appendChild(await pages.producto())
        }
        case '#/Proveedores':{
            return root.appendChild(await pages.proveedor())
        }
        case '#/Categorias':{
            return root.appendChild(await pages.categoria())
        }
        case '#/Cerra':{
            location.reload(true);
        }
    }
};

export {router};