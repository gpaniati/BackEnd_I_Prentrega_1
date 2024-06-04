import { Router } from "express";
import CartManager from "../managers/cartsManager.js";
import ProductManager from "../managers/productsManager.js";

const router = Router();

const baseCarts = new CartManager();
const baseProductsAux = new ProductManager();

// Endpoint: Método GET que escucha en la URL http://localhost:8080/api/carts/:cid
// Listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
router.get('/:cid', async (req, res) => {
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
router.post('/', async (req, res) => {
    // Esto agrega carrito nuevo al archivo de carritos.
    await baseCarts.crearCarrito();
    return res.status(201).send({ status: "success", message: "El carrito ha sido creado correctamente" });
});

// Endpoint: Método POST que escucha en la URL http://localhost:8080/api/carts/:cid/products/:pid
// Deberá agregar el producto al arreglo “products” del carrito seleccionado.
router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    //Valida que vengan exista el producto a agregar al carrito en la base de productos.
    if(!(await baseProductsAux.existeProducto(pid)))
        return res.status(400).send({ status: "error", message: "Producto seleccionado inexistente para agregar al carrito"});

    //Valida que el carrito donde se desea agregar un producto exista.
    const carritosExistentes = await baseCarts.consultarCarritos();
    const carritoExistente = carritosExistentes.find((carrito) => carrito.id === Number(cid));

    if (!carritoExistente)
        return res.status(400).send({ status: "error", message: "Carrito seleccionado inexistente" });

    //Obtiene array de productos del carrito seleccionado.
    const { id, products } = carritoExistente;
    //Valida si ya existe el producto a agregar al carrito en el mismo
    const productoBuscado = products.find((producto) => producto.id === Number(pid)) ;

    if (!productoBuscado){

        //Si no existe, crea el producto nuevo para agregar con cantidad 1.
        const nuevoProducto = {
            id: Number(pid),
            quantity: 1
        }
        products.push(nuevoProducto);
        baseCarts.actualizarCarrito(carritoExistente);

    }else{

        //Si existe, suma 1 ocurrencia al producto agregado y actualiza el carrito
        const productosFiltro = products.filter((producto) => producto.id != Number(pid));
        const { id, quantity} = productoBuscado;
        let quantityN = Number(quantity);
        quantityN++;
        const productoActualizado = {
            id: Number(pid),
            quantity: quantityN
        }
        productosFiltro.push(productoActualizado);
        const carritoActualizado = {
            id: Number(cid),
            products: productosFiltro
        };
        await baseCarts.actualizarCarrito(carritoActualizado);
    }

    return res.status(200).send({ status: "success", message: "Producto agregado al cartito selecionado correctamente"});

});

// Método que responde a las URL inexistentes
router.use("*", (req, res) => {
    console.log("Entro a carts.router");
    return res.status(404).send("Recurso no encontrado");
});

export default router;