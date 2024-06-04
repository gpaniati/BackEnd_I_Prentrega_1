import express from "express";
import cartsRouter from "./routes/carts.router.js"
import productsRouter from "./routes/products.router.js"

const server = express();
const PORT = 8080;
const HOST = "localhost";

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/api/products", productsRouter);
server.use("/api/carts", cartsRouter);

// Método oyente de solicitudes
server.listen(PORT, () => {
    console.log(`Ejecutandose en http://${HOST}:${PORT}`);
});