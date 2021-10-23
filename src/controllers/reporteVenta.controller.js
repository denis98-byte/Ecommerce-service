import view from '../views/reporteVenta.html';
import * as bootstrap from "bootstrap";


const searchForVentas = async (fecha) =>{
    try {
        return await fetch( `https://localhost:44366/api/Factura/FechaInicio=${fecha.inicio}&FechaFinal=${fecha.final}`,{ method: 'GET'})
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
        
        on(Element, 'click', '#ListarReporteVenta', async (e) => { 
            const formulario = Element.querySelector('#formReporteVentas');
            const form = new FormData(formulario)
            
            var fecha = {
                inicio : form.get('fechaInicio'),
                final  : form.get('fechaFinal'),
            }
    
            var reportes = await searchForVentas(fecha);

            console.log(reportes);
    
            var Total = 0;
            reportes.forEach(factura => {
                Element.querySelector('.tabla-ListaReporteVentas').innerHTML +=`
                <tr id="${factura.id}">
                <th scope="row">${factura.id}</th>
                <td>${factura.serie}</td>
                <td>${factura.numeroFactura}</td>
                <td>${factura.fecha.toString().substring(0,10)}</td>
                <td>${factura.nombreCliente}</td>
                <td>${factura.nit}</td>
                <td>Q. ${factura.monto}</td>
                </tr>`;
    
                Total += parseInt(factura.monto);
            });
    
            Element.querySelector('#TotalReporteCompra').value =  "Q.  "+ Total;
        });
    
        const formatDate = (current_datetime)=>{
            let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
            return formatted_date;
        }
    

    return Element;
};