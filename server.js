import express from "express";
import ProductManager from "./src/controllers/ProductManager.js";
import CartManager from "./src/controllers/CartManager.js";

const server = express();
const PORT = 8080;
const HOST = "localhost";

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

const products = new ProductManager();
//const carts = new CartManager();

// ENDPOINTS DE PRODUCTOS.
// Endpoint: Método GET que escucha en la URL http://localhost:8080/api/productos/
// Listar todos los productos de la base.
server.get('/api/products/', async (req, res) => {
    const productos = await products.consultarProductos();

    if (!productos) {
        return res.status(400).send({ status: "error", message: "No hay ningún producto cargado" });
    }

    return res.status(200).send({ status: "success", payload: productos });
});

// Endpoint: Método GET que escucha en la URL http://localhost:8080/api/productos/:pid
// Obtiene sólo el producto con el id proporcionado.
server.get('/api/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const productos = await products.consultarProductos();
    const producto = productos.find((producto) => producto.id === Number(pid));

    if (!producto) {
        return res.status(400).send({ status: "error", message: "Producto no encontrado" });
    }

    return res.status(200).send({ status: "success", payload: producto });
});

// Método que responde a las URL inexistentes
server.use("*", (req, res) => {
    return res.status(404).send("<h1>Error 404</h1><p>Recurso no encontrado</p>");
});

// Método oyente de solicitudes
server.listen(PORT, () => {
    console.log(`Ejecutandose en http://${HOST}:${PORT}`);
});