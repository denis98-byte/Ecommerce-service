import view from '../views/producto.html';
import * as bootstrap from "bootstrap";

const URL           = 'https://localhost:44366/api/producto/';
const URL_CATEGORIA = 'https://localhost:44366/api/categoria';

const getProducto = async () =>{
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

const createProducto = async (producto) => {
    try {
        
        return await fetch( URL,{ method: 'POST', body : JSON.stringify(producto), headers: {"Content-type": "application/json"}})
        .then(response =>{ if(!response){throw new Error(response.statusText)} return response.json()});
        
    } catch (error) {
        console.log(error);
    }
}

const deleteProducto = async (id) =>{
    try {
        return await fetch( URL + id,{ method: 'DELETE'})
        .then(response =>{ if(!response){throw new Error(response.statusText)} return response.json()});
        
    } catch (error) {
        console.log(error);
    }
}

const modifyProducto = async (producto) => {
    try {
        return await fetch( URL,{ method: 'PUT', body : JSON.stringify(producto), headers: {"Content-type": "application/json"}})
        .then(response =>{ if(!response){throw new Error(response.statusText)} return response.json()});
        
    } catch (error) {
        console.log(error);
    }
}

const getCategoria = async () => {
    try {
        return await fetch( URL_CATEGORIA,{ method: 'GET'})
        .then(response =>{ if(!response){throw new Error(response.statusText)} return response.json()});
        
    } catch (error) {
        console.log(error);
    }
}




export default async () => {

    const Element = document.createElement('div');
    Element.innerHTML = view;

    //Elementos o atributos 
    const modalAdd    = new bootstrap.Modal(Element.querySelector('#modalAgregarProducto'));
    const modalModify = new bootstrap.Modal(Element.querySelector('#modalModificarProducto'));
    const modalDelete = new bootstrap.Modal(Element.querySelector('#modalEliminarProducto'));

    //Funciones o metodos
    const on =(element, event, selector, handler)=>{
        element.addEventListener(event, e =>{
            if(e.target.closest(selector)){
                handler(e)
            }            
        });
    };

    const productos  = await getProducto();
    const categorias = await getCategoria();

    productos.forEach(producto => {
        Element.querySelector('.tabla-producto').innerHTML +=`
        <tr id="${producto.id}">
        <th scope="row">${producto.id}</th>
        <td>${producto.nombre}</td>
        <td>${producto.descripcion}</td>
        <td>${producto.precioConIva}</td>
        <td>${producto.categoriaTipo}</td>
        <td>${producto.garantia}</td>
        <td>
            <button type="button" class="btn btn-success btnEditar"  value="${producto.id}"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn btn-danger btnEliminar" value="${producto.id}"><i class="fas fa-trash-alt"></i></button>
        </td>
        </tr>
        `;
    });

    var elementCategoria = Element.querySelector('#ListCategoria');
    categorias.forEach(categoria =>{
        elementCategoria.innerHTML+= `<option id="${categoria.tipo}" value="${categoria.id}">${categoria.tipo}, ${categoria.marca}, ${categoria.modelo}</option>`
    });

    

    //----- Agregar Categoria -----//
    on(Element, 'click', '#btnAgregar', e =>{
        modalAdd.show();
    });
    
    on(Element, 'click', '#btnAgregarProducto', async e =>{
        const formulario = Element.querySelector('#formAgregarProducto');
        const form = new FormData(formulario);

        var product = {
            nombre       : form.get('nombre'),
            descripcion  : form.get('descripcion'),
            precioConIva : parseFloat(form.get('precioConIva')),
            precioSinIva : parseFloat(form.get('precioSinIva')),
            idCategoria  : parseInt(form.get('categoria')),
            linkImagen   : form.get('linkImagen'),
            garantia     : parseInt(form.get('garantia')),
        }

        var producto = await createProducto(product);

        Element.querySelector('.tabla-producto').innerHTML +=`
        <tr id="${producto.id}">
        <th scope="row">${producto.id}</th>
        <td>${producto.nombre}</td>
        <td>${producto.descripcion}</td>
        <td>${producto.precioConIva}</td>
        <td>${producto.categoriaTipo}</td>
        <td>${producto.garantia}</td>
        <td>
            <button type="button" class="btn btn-success btnEditar"  value="${producto.id}"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn btn-danger btnEliminar" value="${producto.id}"><i class="fas fa-trash-alt"></i></button>
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
    



    return Element;
};