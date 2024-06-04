import fs from "fs";
import path from "path";

export default class ProductManager {
    #rutaDelArchivoDeProductosJSON;

    constructor() {
        this.#rutaDelArchivoDeProductosJSON = path.join("./src/files", "products.json");
    }

    //Genera Id de nuevo producto.
    #generarIdProducto = async () => {
        let mayorId = 0;
        const productos = await this.#obtenerProductos();
        productos.forEach((producto) => {
            if (producto.id > mayorId) {
                mayorId = producto.id;
            }
        });
        return mayorId + 1;
    };

     #obtenerProductos = async () => {
        // Se valida que exista el archivo de products.json
        // Caso contrario, se crea dicho archivo.
        if (!fs.existsSync(this.#rutaDelArchivoDeProductosJSON)) {
            await fs.promises.writeFile(this.#rutaDelArchivoDeProductosJSON, "[]");
        }

        // Se carga el contenido del archivo products.json y se retorna en formato JSON
        const productosJSON = await fs.promises.readFile(this.#rutaDelArchivoDeProductosJSON, "utf8");

        // Se convierte de JSON a Array y se retorna el array de productos
        return JSON.parse(productosJSON);
    }

    #persistirProducto = async (nuevoProducto) => {
        const productos = await this.#obtenerProductos();

        // Se agrega el Producto al array de productos
        productos.push(nuevoProducto);

        // Se vuelve a convertir a JSON y se sobrescribe el archivo products.json
        const productosActualizadosJSON = JSON.stringify(productos, null, "\t");
        await fs.promises.writeFile(this.#rutaDelArchivoDeProductosJSON, productosActualizadosJSON);
    }

    eliminarProducto = async (idProducto) => {
        const productos = await this.#obtenerProductos();

        // Se quita el Producto al array de productos
        const productosF = productos.filter((producto) => producto.id != idProducto);

        // Se vuelve a convertir a JSON y se sobrescribe el archivo products.json
        const productosActualizadosJSON = JSON.stringify(productosF, null, "\t");
        await fs.promises.writeFile(this.#rutaDelArchivoDeProductosJSON, productosActualizadosJSON);
    }

    actualizarProducto = async ({ id, ...resto }) => {
        // Se quita el Producto a actualizar del archivo de productos.
        await this.eliminarProducto(Number(id));
        const productoActualizado = { id, ...resto };

        //Se inserta el producto con los datos actualizados.
        await this.#persistirProducto(productoActualizado);
    }

    //Valida si existe el porducto con id pasado por parametro.
    existeProducto = async (idProducto) => {
        const productosExistentes = await this.#obtenerProductos();
        const productoExistente = productosExistentes.find((producto) => producto.id === Number(idProducto));

        if(!productoExistente)
            return false;

        return true;
    }

    //Crea e agrega un producto nuevo.
    agregarProducto = async (title, description, code, price, status, stock, category, thumbnails) => {
        const idProducto = await this.#generarIdProducto();
        const nuevoProducto = {
            id: idProducto,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };

        await this.#persistirProducto(nuevoProducto);
    }

    consultarProductos = async () => {
        const productos = await this.#obtenerProductos();
        return productos;
    }
}