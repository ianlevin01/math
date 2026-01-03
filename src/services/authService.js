import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../repositories/usersRepository.js";

const SALT_ROUNDS = 10;

export async function register(email, password) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = {
    email,
    passwordHash,
    plan: "free",
    requestsCount: 0,
    lastPaymentDate: null,
    createdAt: new Date().toISOString()
  };

  await createUser(user);

  return { email: user.email, plan: user.plan };
}

export async function login(email, password) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    throw new Error("Credenciales inválidas");
  }

  const token = jwt.sign(
    {
      email: user.email,
      plan: user.plan
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      email: user.email,
      plan: user.plan,
      requestsCount: user.requestsCount
    }
  };
}
