import "express";

declare module "express" {
  export interface Response {
    success: (
      statusCode: number,
      status: string,
      message: string,
      data: any
    ) => Response;
    error: (
      statusCode: number,
      status: string,
      message: string,
      error: any
    ) => Response;
  }
}
