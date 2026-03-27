import type { ProductServiceInterface } from "../interfaces/service/ProductServiceInterface.js";
import type { Request, Response } from "express";

export class ProductController {
  constructor(private productService: ProductServiceInterface) {}
  
  getProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getProducts();
      return res.status(200).json({
        success: true,
        data: {
          products
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }
}
