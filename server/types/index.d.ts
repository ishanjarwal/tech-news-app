import "express";

declare global {
  namespace Express {
    interface Response {
      success: (
        statusCode: number,
        status: string,
        message: string,
        data: any
      ) => this;
      error: (
        statusCode: number,
        status: string,
        message: string,
        error: any
      ) => this;
    }
  }
}
