import express from "express";
import ProductManager from "./src/controllers/ProductManager.js";
import CartManager from "./src/controllers/CartManager.js";

const server = express();
const PORT = 8080;
const HOST = "localhost";

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

const baseProducts = new ProductManager();
const baseCarts = new CartManager();

// ENDPOINTS DE PRODUCTOS.
// Endpoint: Método GET que escucha en la URL http://localhost:8080/api/products
// Listar todos los productos de la base.
server.get('/api/products', async (req, res) => {
    const productos = await baseProducts.consultarProductos();

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
    const productosExistentes = await baseProducts.consultarProductos();
    const productoExistente = productosExistentes.find((producto) => producto.id === Number(pid));

    if (!productoExistente) 
        return res.status(400).send({ status: "error", message: "Producto inexistente" });

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
    await baseProducts.agregarProducto(title, description, code, Number(price), Boolean(status), Number(stock), category, thumbnails);

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
server.delete('/api/products/:pid', async (req, res) => {
    const { pid } = req.params;

    //Valida que vengan exista el producto a eliminar.
    if(!(await baseProducts.existeProducto(pid)))
        return res.status(400).send({ status: "error", message: "Producto a eliminar inexistente" });

    await baseProducts.eliminarProducto(Number(pid));
    return res.status(200).send({ status: "success", message: "El producto ha sido eliminado" });
});


// ENDPOINTS DE CARRITOS.
// Endpoint: Método GET que escucha en la URL http://localhost:8080/api/carts/:cid
// Listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
server.get('/api/carts/:cid', async (req, res) => {
    const { cid } = req.params;

    //Valida que el carrito a cosultar exista.
    const carritosExistentes = await baseCarts.consultarCarritos();
    const carritoExistente = carritosExistentes.find((carrito) => carrito.id === Number(cid));

    if (!carritoExistente) 
        return res.status(400).send({ status: "error", message: "Carrito inexistente" });

    const { id, products } = carritoExistente;
    return res.status(200).send({ status: "success", payload: products });
});

// Endpoint: Método POST que escucha en la URL http://localhost:8080/api/carts
// Deberá crear un nuevo carrito
server.post('/api/carts', async (req, res) => {
    // Esto agrega carrito nuevo al archivo de carritos.
    await baseCarts.crearCarrito();
    return res.status(201).send({ status: "success", message: "El carrito ha sido creado correctamente" });
});

// Endpoint: Método POST que escucha en la URL http://localhost:8080/api/carts/:cid/products/:pid
// Deberá agregar el producto al arreglo “products” del carrito seleccionado.
server.post('/api/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    //Valida que el carrito donde se desea agregar un producto exista.
    const carritosExistentes = await baseCarts.consultarCarritos();
    const carritoExistente = carritosExistentes.find((carrito) => carrito.id === Number(cid));

    if (!carritoExistente) 
        return res.status(400).send({ status: "error", message: "Carrito seleccionado inexistente" });

    //Valida que vengan exista el producto a agregar al carrito en la base de productos.
    if(!(await baseProducts.existeProducto(pid)))
        return res.status(400).send({ status: "error", message: "Producto seleccionado para agregar al carrito inexistente"});

    //Obtiene array de productos del carrito seleccionado.
    const { id, products } = carritoExistente;

    //Valida si ya existe el producto a agregar al carrito en el mismo
    const productoCarrito = products.find((producto) => producto.id === Number(pid)) ;
    if (!productoCarrito){
        const nuevoProducto = {
            id: Number(pid),
            quantity: 1
        }
        products.push(nuevoProducto);
        baseCarts.actualizarCarrito(carritoExistente);
    }

    return res.status(200).send({ status: "success", payload: productoCarrito });
});


// Método que responde a las URL inexistentes
server.use("*", (req, res) => {
    return res.status(404).send("Recurso no encontrado");
});

// Método oyente de solicitudes
server.listen(PORT, () => {
    console.log(`Ejecutandose en http://${HOST}:${PORT}`);
});