import { Router } from "express";
import ProductManager from "../managers/productsManager.js";

const router = Router();

const baseProducts = new ProductManager();

// Endpoint: Método GET que escucha en la URL http://localhost:8080/api/products
// Listar todos los productos de la base.
router.get('/', async (req, res) => {
    const productos = await baseProducts.consultarProductos();

    if (!productos) {
        return res.status(400).send({ status: "error", message: "No hay ningún producto cargado" });
    }

    return res.status(200).send({ status: "success", payload: productos });
});

// Endpoint: Método GET que escucha en la URL http://localhost:8080/api/productos/:pid
// Obtiene sólo el producto con el id proporcionado.
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    //Valida que el producto a cosultar exista.
    const productosExistentes = await baseProducts.consultarProductos();
    const productoExistente = productosExistentes.find((producto) => producto.id === Number(pid));

    if (!productoExistente) 
        return res.status(400).send({ status: "error", message: "Producto inexistente" });

    return res.status(200).send({ status: "success", payload: productoExistente });
});

// Endpoint: Método POST que escucha en la URL http://localhost:8080/api/products
// Deberá agregar un nuevo producto.
router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        return res.status(400).send({ status: "error", message: "Datos incompletos" });
    }

    // Esto agrega el producto en el archivo de productos.
    await baseProducts.agregarProducto(title, description, code, Number(price), Boolean(status), Number(stock), category, thumbnails);

    return res.status(201).send({ status: "success", message: "El producto de ha agregado a la base" });
});

// Endpoint: Método PUT que escucha en la URL http://localhost:8080/api/products/:pid
// Modificar un producto por id.
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    //Valida que vengan todos los campo informados con posibles modificaciones.
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        return res.status(400).send({ status: "error", message: "Datos incompletos" });
    }

    //Valida que vengan exista el producto a modificar.
    if(!(await baseProducts.existeProducto(pid)))
        return res.status(400).send({ status: "error", message: "Producto a modificar inexistente" });

    const productoModificado = {
        id: Number(pid),
        title,
        description,
        code,
        price: Number(price),
        status: Boolean(status),
        stock: Number(stock),
        category,
        thumbnails
    }

    await baseProducts.actualizarProducto(productoModificado);
    return res.status(200).send({ status: "success", message: "El producto se ha modificado" });
});

// Endpoint: Método DELETE que escucha en la URL http://localhost:8080/api/products/:pid
// Eliminar un producto por id.
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    //Valida que vengan exista el producto a eliminar.
    if(!(await baseProducts.existeProducto(pid)))
        return res.status(400).send({ status: "error", message: "Producto a eliminar inexistente" });

    await baseProducts.eliminarProducto(Number(pid));
    return res.status(200).send({ status: "success", message: "El producto ha sido eliminado" });
});

// Método que responde a las URL inexistentes
router.use("*", (req, res) => {
    console.log("Entro a products.router");
    return res.status(404).send("Recurso no encontrado");
});

export default router;