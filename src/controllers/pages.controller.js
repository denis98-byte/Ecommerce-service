import Producto  from './producto.controller';
import Proveedor from './proveedor.controller';
import Categoria from './categoria.controller';
import Compra    from  './compra.controller';

const pages = {
    producto: Producto,
    proveedor: Proveedor,
    categoria: Categoria,
    compra   : Compra,
}

export {pages};