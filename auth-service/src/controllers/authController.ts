import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email e senha são obrigatórios");
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(
    { email },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  res.json({ token, refreshToken });
};

const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send({ error: "Refresh token é obrigatório" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as { email: string };
    const newToken = jwt.sign(
      { email: decoded.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token: newToken });
  } catch (err) {
    res.status(403).send({ error: "Refresh token inválido" });
  }
};

const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send({ error: "Token é obrigatório" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    res.status(200).send({ message: "Token válido" });
  } catch (err) {
    res.status(403).send({ error: "Token inválido" });
  }
};

export { loginUser, refreshToken, verifyToken };
