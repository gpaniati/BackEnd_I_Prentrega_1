import ProductManager from "./src/controllers/ProductManager.js";
import CartManager from "./src/controllers/CartManager.js";

const prodManager = new ProductManager();
const productos = prodManager.consultarProductos();
console.log(productos);




const cartManager = new CartManager();
const carritos = cartManager.consultarCarritos();
console.log(carritos);
