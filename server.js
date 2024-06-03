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
// Endpoint: Método GET que escucha en la URL http://localhost:8080/api/products
// Listar todos los productos de la base.
server.get('/api/products', async (req, res) => {
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

    //Valida que el producto a cosultar exista.
    const productosExistentes = await products.consultarProductos();
    const productoExistente = productosExistentes.find((producto) => producto.id === Number(pid));

    if (!productoExistente) 
        return res.status(400).send({ status: "error", message: "Producto no encontrado" });

    return res.status(200).send({ status: "success", payload: productoExistente });
});

// Endpoint: Método POST que escucha en la URL http://localhost:8080/api/products
// Deberá agregar un nuevo producto.
server.post('/api/products', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        return res.status(400).send({ status: "error", message: "Datos incompletos" });
    }

    // Esto agrega el producto en el archivo de productos.
    await products.agregarProducto(title, description, code, Number(price), Boolean(status), Number(stock), category, thumbnails);

    return res.status(201).send({ status: "success", message: "El producto de ha agregado a la base" });
});

// Endpoint: Método PUT que escucha en la URL http://localhost:8080/api/products/:pid
// Modificar un producto por id.
server.put('/api/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    //Valida que vengan todos los campo informados con posibles modificaciones.
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        return res.status(400).send({ status: "error", message: "Datos incompletos" });
    }

    //Valida que vengan exista el producto a modificar.
    if(!(await products.existeProducto(pid)))
        return res.status(400).send({ status: "error", message: "Producto a modificar no encontrado" });

    const productoModificado = {
        id: Number(pid),
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    }

    await products.actualizarProducto(productoModificado);
    return res.status(200).send({ status: "success", message: "El producto se ha modificado" });
});

// Endpoint: Método DELETE que escucha en la URL http://localhost:8080/api/products/:pid
// Eliminar un producto por id.
server.delete('/api/products/:pid', async (req, res) => {
    const { pid } = req.params;

    //Valida que vengan exista el producto a eliminar.
    if(!(await products.existeProducto(pid)))
        return res.status(400).send({ status: "error", message: "Producto a eliminar no encontrado" });

    await products.eliminarProducto(Number(pid));
    return res.status(200).send({ status: "success", message: "El producto ha sido eliminado" });
});

// Método que responde a las URL inexistentes
server.use("*", (req, res) => {
    return res.status(404).send("Recurso no encontrado");
});

// Método oyente de solicitudes
server.listen(PORT, () => {
    console.log(`Ejecutandose en http://${HOST}:${PORT}`);
});