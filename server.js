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


server.get('/api/products/', async (req, res) => {
    const productos = await products.consultarProductos();
    if (!productos) {
        return res.status(400).send({ status: "error", message: "No hay ningún producto cargado" });
    }

    return res.status(200).send({ status: "success", payload: productos });
});


// Método que responde a las URL inexistentes
server.use("*", (req, res) => {
    return res.status(404).send("<h1>Error 404</h1><p>Recurso no encontrado</p>");
});

// Método oyente de solicitudes
server.listen(PORT, () => {
    console.log(`Ejecutandose en http://${HOST}:${PORT}`);
});