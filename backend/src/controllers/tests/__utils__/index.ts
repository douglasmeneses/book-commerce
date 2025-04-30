import { Request, Response } from "express";

export const mockRequest = (overrides = {}) =>
  ({
    body: {},
    query: {},
    params: {},
    ...overrides,
  } as unknown as Request);

export const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};
