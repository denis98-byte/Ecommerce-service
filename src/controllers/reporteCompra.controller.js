import view from '../views/reporteCompra.html';
import * as bootstrap from "bootstrap";

const searchForCompras = async (fecha) =>{
    try {
        return await fetch( `https://localhost:44366/api/compra/FechaInicio=${fecha.inicio}&FechaFinal=${fecha.final}`,{ method: 'GET'})
        .then(response =>{ if(!response){throw new Error(response.statusText)} return response.json()});
        
    } catch (error) {
        console.log(error);
    }
}

export default async () => {

    const Element = document.createElement('div');
    Element.innerHTML = view;

    //Funciones o metodos
    const on =(element, event, selector, handler)=>{
        element.addEventListener(event, e =>{
            if(e.target.closest(selector)){
                handler(e)
            }            
        });
    };

    function formatoFecha(fecha, formato) {
        const map = {
            dd: fecha.getDate() < 10 ? '0' + fecha.getDate().toString() : fecha.getDate(),
            mm: fecha.getMonth() + 1,
            yy: fecha.getFullYear(),
            yyyy: fecha.getFullYear()
        }
    
        return formato.replace(/dd|mm|yy|yyy/gi, matched => map[matched])
    }

    
    on(Element, 'click', '#ListarReporteCompra', async (e) => { 
        const formulario = Element.querySelector('#formReporteCompra');
        const form = new FormData(formulario)
        
        var fecha = {
            inicio : form.get('fechaInicio'),
            final  : form.get('fechaFinal'),
        }

        var reportes = await searchForCompras(fecha);

        var Total = 0;
        reportes.forEach(factura => {
            Element.querySelector('.tabla-ListaReporteCompra').innerHTML +=`
            <tr id="${factura.id}">
            <th scope="row">${factura.id}</th>
            <td>${factura.fecha.toString().substring(0,10)}</td>
            <td>${factura.numeroFactura}</td>
            <td>${factura.nombreProveedor}</td>
            <td>${factura.nombreEmpleado}</td>
            <td>Q. ${factura.total}</td>
            </tr>`;

            Total += parseInt(factura.total);
        });

        Element.querySelector('#TotalReporteCompra').value =  "Q."+ Total;
    });

    const formatDate = (current_datetime)=>{
        let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
        return formatted_date;
    }

    
    return Element;
};