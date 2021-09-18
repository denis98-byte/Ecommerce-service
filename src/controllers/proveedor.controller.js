import view from '../views/proveedor.html';
import * as bootstrap from "bootstrap"

const getProveedor = async () =>{
    const response = await fetch('https://localhost:44366/api/proveedor',{ method: 'GET'});
    return await response.json();
}

const createProveedor = async (proveedor) => {
    const response = await fetch('https://localhost:44366/api/proveedor',{ method: 'POST', body : JSON.stringify(proveedor), headers: {"Content-type": "application/json"}});
    return await response.json();
}

const DeleteProveedor = async (id) =>{
    const response = await fetch(`https://localhost:44366/api/proveedor/${id}`,{ method: 'DELETE'});
    return await response.json();
}

const ModifyProveedor = async (proveedor) => {
    const response = await fetch('https://localhost:44366/api/proveedor',{ method: 'PUT', body : JSON.stringify(proveedor), headers: {"Content-type": "application/json"}}).catch( err => console.log(err));
    return await response.json();
}

export default async () => {
    
    const Element = document.createElement('div');
    Element.innerHTML = view

    //Elementos o atributos 
    const modal       = new bootstrap.Modal(Element.querySelector('#modalProveedor'));
    const modalModify = new bootstrap.Modal(Element.querySelector('#modalModificarProveedor'));
    const modalAlerta = new bootstrap.Modal(Element.querySelector('#alertaEliminarProveedor'));
    

    //Funciones
    const proveedor = await getProveedor();
    proveedor.forEach(element => {
        Element.querySelector('.tabla-Proveedor').innerHTML +=`
        <tr id="${element.id}">
        <th scope="row">${element.id}</th>
        <td name="nombre">${element.nombre}</td>
        <td>${element.telefono}</td>
        <td>${element.direccion}</td>
        <td>${element.correo}</td>
        <td>
            <button type="button" class="btn btn-success btnEditar" value="${element.id}"><i class="fas fa-edit"></i></button>
            <button type="button" class="btn btn-danger btnEliminar" value="${element.id}"> <i class="fas fa-trash-alt"></i></button>
        </td>
        </tr>
        `;
    });


    const btnModal  = Element.querySelector('#btnModalProveedor');
    btnModal.addEventListener('click', () =>{
        modal.show();
    });

    const btnAgregar = Element.querySelector('#btnAgregarProducto');
    btnAgregar.addEventListener('click', async () => {

        const formulario = Element.querySelector('#formAgregarProveedor');
        const form = new FormData(formulario)
        
        var proveedor = {
            nombre    : form.get('nombre'),
            telefono  : form.get('Telefono'),
            direccion : form.get('Dirrecion'),
            correo    : form.get('Correo')
        }

        try {

            var prove = await createProveedor(proveedor);
            Element.querySelector('.tabla-Proveedor').innerHTML +=`
            <tr id="${prove.id}">
            <th scope="row">${prove.id}</th>
            <td>${prove.nombre}</td>
            <td>${prove.telefono}</td>
            <td>${prove.direccion}</td>
            <td>${prove.correo}</td>
            <td>
                <button type="button" class="btn btn-success btnEditar" value="${prove.id}"> <i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btnEliminar" value="${prove.id}"> <i class="fas fa-trash-alt"></i></button>
            </td>
            </tr>`;

            modal.hide();
            
        } catch (error) {
            console.log(error);
        }    
    });

    const on =(element, event, selector, handler)=>{
        element.addEventListener(event, e =>{
            if(e.target.closest(selector)){
                handler(e)
            }            
        });
    };

    on(Element, 'click', '.btnEditar', e =>{
        
        var id = e.target.closest('.btnEditar').getAttribute('value');
        const fila = Element.querySelector(`tr[id="${id}"]`);

        var id        = fila.children[0].innerHTML;
        var nombre    = fila.children[1].innerHTML;
        var telefono  = fila.children[2].innerHTML;
        var direccion = fila.children[3].innerHTML;
        var correo    = fila.children[4].innerHTML;
 
        const formulario = Element.querySelector('#formModificacioProveedor');

        formulario['id'].value        = id;
        formulario['nombre'].value    = nombre;
        formulario['telefono'].value  = telefono;
        formulario['direccion'].value = direccion;
        formulario['correo'].value    = correo;

        modalModify.show();
    });

    const btnModificar = Element.querySelector('#btnModificarProveedor');
    btnModificar.addEventListener('click', async () => {

        const formulario = Element.querySelector('#formModificacioProveedor');
        const form = new FormData(formulario)
        
        var proveedor = {
            id        : parseInt(form.get('id')),
            nombre    : form.get('nombre'),
            telefono  : form.get('telefono'),
            direccion : form.get('direccion'),
            correo    : form.get('correo')
        }
        
        console.log(proveedor)
        try {


            var respuesta = await ModifyProveedor(proveedor);
            console.log(respuesta);

            const fila = Element.querySelector(`tr[id="${proveedor.id}"]`);
            fila.remove();

            Element.querySelector('.tabla-Proveedor').innerHTML +=`
            <tr id="${proveedor.id}">
            <th scope="row">${proveedor.id}</th>
            <td>${proveedor.nombre}</td>
            <td>${proveedor.telefono}</td>
            <td>${proveedor.direccion}</td>
            <td>${proveedor.correo}</td>
            <td>
                <button type="button" class="btn btn-success btnEditar" value="${proveedor.id}"> <i class="fas fa-edit"></i></button>
                <button type="button" class="btn btn-danger btnEliminar" value="${proveedor.id}"> <i class="fas fa-trash-alt"></i></button>
            </td>
            </tr>`;

            modalModify.hide();
            
        } catch (error) {
            console.log(error);
        }    
    });

    var idProveedor = '0';
    on(Element, 'click', '.btnEliminar', e =>{
        var id =  e.target.closest('.btnEliminar').getAttribute('value');
        const fila = Element.querySelector(`tr[id="${id}"]`);

        var id        = fila.children[0].innerHTML;
        var nombre    = fila.children[1].innerHTML;

        const bodyModal = Element.querySelector('#mensaje-modal');
        bodyModal.innerHTML=`Esta seguro que desea eliminar el cliente: ${id}, ${nombre}?`;

        idProveedor = id;
        console.log(idProveedor);
        modalAlerta.show();
    });

    const btnEliminarProveedor = Element.querySelector('#EliminarProveedor');
    btnEliminarProveedor.addEventListener('click', async ()=>{

        try {
            await DeleteProveedor(idProveedor);
            const fila = Element.querySelector(`tr[id="${idProveedor}"]`);
            fila.remove();

            modalAlerta.hide();
        } catch (error) {
            console.log(error);
        }
    });

    return Element;
};