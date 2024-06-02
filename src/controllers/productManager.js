import fs from "fs";
import path from "path";

export default class ProductManager {
    #rutaDelArchivoDeProductosJSON;

    constructor() {
        this.#rutaDelArchivoDeProductosJSON = path.join("files", "products.json");
    }

    #generarIdProducto = () => {
        let mayorId = 0;
        const productos = await this.#obtenerproductos();
        productos.forEach((producto) => {
            if (producto.id > mayorId) {
                mayorId = producto.id;
            }
        });
    
        return mayorId + 1;
    };
    
     #obtenerproductos = async () => {
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
        const productos = await this.#obtenerproductos();

        // Se agrega el Producto al array de productos
        productos.push(nuevoProducto);

        // Se vuelve a convertir a JSON y se sobrescribe el archivo products.json
        const productosActualizadosJSON = JSON.stringify(productos, null, "\t");
        await fs.promises.writeFile(this.#rutaDelArchivoDeProductosJSON, productosActualizadosJSON);
    }

    crearProducto = async (title, description, code, price, status, stock, category, thumbnails) => {
        const idProducto = this.#generarIdProducto();
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

    consultarproductos = async () => {
        const productos = await this.#obtenerproductos();
        console.log(productos);
    }
}