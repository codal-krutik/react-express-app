import type { ProductServiceInterface } from "../interfaces/service/ProductServiceInterface.js";
import type { Request, Response } from "express";
import type { PaginationParams } from "../dtos/ProductDTO.js";

export class ProductController {
  constructor(private productService: ProductServiceInterface) {}

  getProducts = async (req: Request, res: Response) => {
    try {
      const { after, before, first, last } = req.query;

      let params: PaginationParams;

      if (after) {
        params = {
          after: String(after),
          ...(first ? { first: Number(first) } : {}),
        };
      } else if (before) {
        params = {
          before: String(before),
          ...(last ? { last: Number(last) } : {}),
        };
      } else {
        params = {
          ...(first ? { first: Number(first) } : {}),
        };
      }

      const products = await this.productService.getProducts(params);

      return res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  };
}
