import view from '../views/categoria.html';
import * as bootstrap from "bootstrap";

const URL = 'https://localhost:44366/api/categoria/';

const getCategoria = async () =>{
    try {
        const response = await fetch(URL,{ method: 'GET'});

        if(!response.ok){
            throw new Error(response.statusText);
        }

        return await response.json();

    } catch (error) {
        console.log(error);
    }
}

const createCategoria = async (categoria) => {
    try {
        
        return await fetch( URL,{ method: 'POST', body : JSON.stringify(categoria), headers: {"Content-type": "application/json"}})
        .then(response =>{ if(!response){throw new Error(response.statusText)} return response.json()});
        
    } catch (error) {
        console.log(error);
    }
}

const deleteCategoria = async (id) =>{
    try {
        return await fetch( URL + id,{ method: 'DELETE'})
        .then(response =>{ if(!response){throw new Error(response.statusText)} return response.json()});
        
    } catch (error) {
        console.log(error);
    }
}

const modifyCategoria = async (categoria) => {
    try {
        return await fetch( URL,{ method: 'PUT', body : JSON.stringify(categoria), headers: {"Content-type": "application/json"}})
        .then(response =>{ if(!response){throw new Error(response.statusText)} return response.json()});
        
    } catch (error) {
        console.log(error);
    }
}


export default async () => {

    const Element = document.createElement('div');
    Element.innerHTML = view;

    //Elementos o atributos 
    const modalAdd    = new bootstrap.Modal(Element.querySelector('#modalAgregarCategoria'));
    const modalModify = new bootstrap.Modal(Element.querySelector('#modalModificarCategoria'));
    const modalDelete = new bootstrap.Modal(Element.querySelector('#modalEliminarCategoria'));

    //Funciones o metodos
    const on =(element, event, selector, handler)=>{
        element.addEventListener(event, e =>{
            if(e.target.closest(selector)){
                handler(e)
            }            
        });
    };

    const categorias = await getCategoria();
    categorias.forEach(categoria => {
        Element.querySelector('.tabla-categoria').innerHTML +=`
        <tr id="${categoria.id}">
        <th scope="row">${categoria.id}</th>
        <td>${categoria.tipo}</td>
        <td>${categoria.marca}</td>
        <td>${categoria.modelo}</td>
        <td>
            <button type="button" class="btn btn-success btnEditar"  value="${categoria.id}"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn btn-danger btnEliminar" value="${categoria.id}"><i class="fas fa-trash-alt"></i></button>
        </td>
        </tr>
        `;
    });

    //----- Agregar Categoria -----//
    on(Element, 'click', '#btnAgregar', e =>{
        modalAdd.show();
    });

    on(Element, 'click', '#btnAgregarCategoria', async e =>{
        const formulario = Element.querySelector('#formAgregarCategoria');
        const form = new FormData(formulario);

        var category = {
            tipo   : form.get('tipo'),
            marca  : form.get('marca'),
            modelo : form.get('modelo'),
        }

        var categoria = await createCategoria(category);

        Element.querySelector('.tabla-categoria').innerHTML +=`
        <tr id="${categoria.id}">
        <th scope="row">${categoria.id}</th>
        <td>${categoria.tipo}</td>
        <td>${categoria.marca}</td>
        <td>${categoria.modelo}</td>
        <td>
            <button type="button" class="btn btn-success btnEditar"  value="${categoria.id}"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn btn-danger btnEliminar" value="${categoria.id}"><i class="fas fa-trash-alt"></i></button>
        </td>
        </tr>
        `;

        modalAdd.hide();
    });

    //----- Editar Categoria -----//
    on(Element, 'click', '.btnEditar', e =>{
        
        var id = e.target.closest('.btnEditar').getAttribute('value');
        const fila = Element.querySelector(`tr[id="${id}"]`);

        var id     = fila.children[0].innerHTML;
        var tipo   = fila.children[1].innerHTML;
        var marca  = fila.children[2].innerHTML;
        var modelo = fila.children[3].innerHTML;

        const formulario = Element.querySelector('#formModificacioProveedor');

        formulario['id'].value     = id;
        formulario['tipo'].value   = tipo;
        formulario['marca'].value  = marca;
        formulario['modelo'].value = modelo;

        modalModify.show();
    });
    
    on(Element, 'click', '#btnModificarCategoria', async e =>{
        const formulario = Element.querySelector('#formModificacioProveedor');
        const form = new FormData(formulario);

        var categoria = {
            id     : parseInt(form.get('id')),
            tipo   : form.get('tipo'),
            marca  : form.get('marca'),
            modelo : form.get('modelo'),
        }

        var response = await modifyCategoria(categoria);

        const fila = Element.querySelector(`tr[id="${categoria.id}"]`);
        fila.remove();

        Element.querySelector('.tabla-categoria').innerHTML +=`
        <tr id="${categoria.id}">
        <th scope="row">${categoria.id}</th>
        <td>${categoria.tipo}</td>
        <td>${categoria.marca}</td>
        <td>${categoria.modelo}</td>
        <td>
            <button type="button" class="btn btn-success btnEditar"  value="${categoria.id}"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn btn-danger btnEliminar" value="${categoria.id}"><i class="fas fa-trash-alt"></i></button>
        </td>
        </tr>
        `;

        modalModify.hide();
    });

    //----- Eliminar Categoria -----//
    var idCategoria = '0';
    on(Element, 'click', '.btnEliminar', e =>{
        var id =  e.target.closest('.btnEliminar').getAttribute('value');
        const fila = Element.querySelector(`tr[id="${id}"]`);

        var id   = fila.children[0].innerHTML;
        var tipo = fila.children[1].innerHTML;

        const bodyModal = Element.querySelector('#mensaje-modal');
        bodyModal.innerHTML=`Esta seguro que desea eliminar la categoria: ${id}, ${tipo} ?`;

        idCategoria = id;
        modalDelete.show();
    });

    on(Element, 'click', '#btnEliminarCategoria', async e =>{
        await deleteCategoria(idCategoria);
        const fila = Element.querySelector(`tr[id="${idCategoria}"]`);
        
        fila.remove();
        modalDelete.hide();
    });


    return Element;
};