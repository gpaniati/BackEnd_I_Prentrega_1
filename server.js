import ProductManager from "./src/controllers/ProductManager.js";

const prodManager = new ProductManager();
const productos = prodManager.consultarproductos();
console.log(productos);
