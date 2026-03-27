import { Router } from "express";
import dotenv from "dotenv";

import { ProductController } from "../controllers/ProductController.js";
import { ProductService } from "../services/ProductService.js";
import { ShopifyProductRepository } from "../shopify/repositories/shopify.product.repository.js";
import { ShopifyClient } from "../shopify/client/shopify.client.js";

dotenv.config();

const router = Router();

const shopifyClient = new ShopifyClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: process.env.SHOPIFY_API_VERSION!,
  accessToken: process.env.SHOPIFY_API_SECRET!,
});

const shopifyProductRepository = new ShopifyProductRepository(shopifyClient);

const productService = new ProductService(shopifyProductRepository);

const productController = new ProductController(productService);

router.get("/", productController.getProducts);

export default router;
