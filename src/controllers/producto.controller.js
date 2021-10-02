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

const getByIdProducto = async (id) =>{
    try {
        const response = await fetch(URL + id,{ method: 'GET'});

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

    // Lista productos  
    const productos  = await getProducto();
    const categorias = await getCategoria();

    productos.forEach(producto => {
        Element.querySelector('.tabla-producto').innerHTML +=`
        <tr id="${producto.id}">
        <th scope="row">${producto.id}</th>
        <td><img src="${producto.linkImagen}" class="card-img-top" style="width: 80px; margin-right: 20px;" alt=""> ${producto.nombre}</td>
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

    // Lista Categoria
    var elementCategoria = Element.querySelector('#ListCategoria');
    categorias.forEach(categoria =>{
        elementCategoria.innerHTML+= `<option id="${categoria.tipo}" value="${categoria.id}">${categoria.tipo}, ${categoria.marca}, ${categoria.modelo}</option>`
    });

    //----- Agregar Producto -----//
    on(Element, 'click', '#btnModalAgregarProducto', e =>{
        modalAdd.show();
    });
    
    on(Element, 'click', '#btnAgregarProducto', async e =>{
        const formulario = Element.querySelector('#formAgregarProducto');
        const form = new FormData(formulario);

        var combo =  Element.querySelector('#ListCategoria');
        var product = {
            nombre       : form.get('nombre'),
            descripcion  : form.get('descripcion'),
            precioConIva : parseFloat(form.get('precioConIva')),
            precioSinIva : parseFloat(form.get('precioSinIva')),
            idCategoria  : parseInt(form.get('categoria')),
            linkImagen   : form.get('linkImagen'),
            garantia     : parseInt(form.get('garantia')),
            categoriaTipo : combo.options[combo.selectedIndex].text,
        }

        var producto = await createProducto(product);

        Element.querySelector('.tabla-producto').innerHTML +=`
        <tr id="${producto.id}">
        <th scope="row">${producto.id}</th>
        <td><img src="${producto.linkImagen}" class="card-img-top" style="width: 80px; margin-right: 20px;" alt=""> ${producto.nombre}</td>
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
    on(Element, 'click', '.btnEditar', async (e) =>{
    
        var id = e.target.closest('.btnEditar').getAttribute('value');

        var producto = await getByIdProducto(id);

        const elementCategoria = Element.querySelector("#ListaCategoriaProveedor");

        categorias.forEach(categoria =>{
            elementCategoria.innerHTML+= `<option id="${categoria.tipo}" value="${categoria.id}">${categoria.tipo}, ${categoria.marca}, ${categoria.modelo}</option>`
        });
        const formulario = Element.querySelector('#formModificarProducto');

     
        formulario['id'].value           = producto.id;
        formulario['nombre'].value       = producto.nombre;
        formulario['categoria'].value    = producto.idCategoria;
        formulario['precioConIva'].value = producto.precioConIva;
        formulario['precioSinIva'].value = producto.precioSinIva;
        formulario['garantia'].value     = producto.garantia;
        formulario['linkImagen'].value   = producto.linkImagen;
        formulario['descripcion'].value  = producto.descripcion;

        console.log(producto);
        modalModify.show();
    });
    
    on(Element, 'click', '#btnModificarProducto', async e =>{
        const formulario = Element.querySelector('#formModificarProducto');
        const form = new FormData(formulario);

        var combo =  Element.querySelector('#ListaCategoriaProveedor');
        var producto = {
            id            : parseInt(form.get('id')),
            nombre        : form.get('nombre'),
            descripcion   : form.get('descripcion'),
            precioConIva  : parseFloat(form.get('precioConIva')),
            precioSinIva  : parseFloat(form.get('precioSinIva')),
            idCategoria   : parseInt(form.get('categoria')),
            linkImagen    : form.get('linkImagen'),
            garantia      : parseInt(form.get('garantia')),
            categoriaTipo : combo.options[combo.selectedIndex].text,
        }

        var response = await modifyProducto(producto);

        const fila = Element.querySelector(`tr[id="${producto.id}"]`);
        fila.remove();

        Element.querySelector('.tabla-producto').innerHTML +=`
        <tr id="${producto.id}">
        <th scope="row">${producto.id}</th>
        <td><img src="${producto.linkImagen}" class="card-img-top" style="width: 80px; margin-right: 20px;" alt=""> ${producto.nombre}</td>
        <td>${producto.precioConIva}</td>
        <td>${producto.categoriaTipo}</td>
        <td>${producto.garantia}</td>
        <td>
            <button type="button" class="btn btn-success btnEditar"  value="${producto.id}"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn btn-danger btnEliminar" value="${producto.id}"><i class="fas fa-trash-alt"></i></button>
        </td>
        </tr>
        `;

        console.log(producto);

        modalModify.hide();
    });
    
    //----- Eliminar Categoria -----//
    var idProducto = '0';
    on(Element, 'click', '.btnEliminar', e =>{
        var id =  e.target.closest('.btnEliminar').getAttribute('value');
        const fila = Element.querySelector(`tr[id="${id}"]`);

        var id   = fila.children[0].innerHTML;
        var tipo = fila.children[1].innerHTML;

        const bodyModal = Element.querySelector('#mensaje-modal');
        bodyModal.innerHTML=`Esta seguro que desea eliminar la categoria: ${id}, ${tipo} ?`;

        idProducto = id;
        modalDelete.show();
    });

    on(Element, 'click', '#btnEliminarProducto', async e =>{
        
        //await deleteProducto(idProducto);
        
        const fila = Element.querySelector(`tr[id="${idProducto}"]`);
        fila.remove();
        modalDelete.hide();
    });







    return Element;
};