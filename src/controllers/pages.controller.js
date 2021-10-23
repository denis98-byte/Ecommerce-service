import Producto  from './producto.controller';
import Proveedor from './proveedor.controller';
import Categoria from './categoria.controller';
import Compra    from  './compra.controller';
import RVenta    from  './reporteVenta.controller';
import RCompra   from  './reporteCompra.controller';

const pages = {
    producto  : Producto,
    proveedor : Proveedor,
    categoria : Categoria,
    compra    : Compra,
    rVenta    : RVenta,
    rCompra   : RCompra,
}

export {pages};