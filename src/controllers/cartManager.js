import fs from "fs";
import path from "path";

export default class CartManager {
    #rutaDelArchivoDeCarritoJSON;

    constructor() {
        this.#rutaDelArchivoDeCarritoJSON = path.join("./src/files", "cart.json");
    }

    //Genera Id de nuevo producto.
    #generarIdCarrito = async () => {
        let mayorId = 0;
        const carritos = await this.#obtenerCarritos();
        carritos.forEach((carrito) => {
            if (carrito.id > mayorId) {
                mayorId = carrito.id;
            }
        });
        return mayorId + 1;
    };

     #obtenerCarritos = async () => {
        // Se valida que exista el archivo de carts.json
        // Caso contrario, se crea dicho archivo.
        if (!fs.existsSync(this.#rutaDelArchivoDeCarritoJSON)) {
            await fs.promises.writeFile(this.#rutaDelArchivoDeCarritoJSON, "[]");
        }

        // Se carga el contenido del archivo carts.json y se retorna en formato JSON
        const carritosJSON = await fs.promises.readFile(this.#rutaDelArchivoDeCarritoJSON, "utf8");

        // Se convierte de JSON a Array y se retorna el array de productos
        return JSON.parse(carritosJSON);
    }

    #persistirCarrito = async (nuevoCarrito) => {
        const carritos = await this.#obtenerCarritos();

        // Se agrega el carrito al array de carritos
        carritos.push(nuevoCarrito);

        // Se vuelve a convertir a JSON y se sobrescribe el archivo carts.json
        const carritosActualizadosJSON = JSON.stringify(carritos, null, "\t");
        await fs.promises.writeFile(this.#rutaDelArchivoDeCarritoJSON, carritosActualizadosJSON);
    }

    crearCarrito = async (productos) => {
        const idCarrito = this.#generarIdCarrito();
        const nuevoCarrito = {
            id: idCarrito,
            productos: []
        };

        await this.#persistirCarrito(nuevoCarrito);
    }

    consultarCarritos = async () => {
        const carritos = await this.#obtenerCarritos();
        console.log(carritos);
        return carritos;
    }
}