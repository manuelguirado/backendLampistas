import { PrismaClient } from '../../../generated/prisma';
import { hashPassword } from '../../utils/hash/hashPassword';
import jwt, { SignOptions } from 'jsonwebtoken';
const prisma = new PrismaClient();
export async function userRegister(
  name: string,
  email: string,
  password: string,
  directions: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  }[],
  CompanyID?: number,
) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error('User already exists');
  }
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'USER',
      companyID: CompanyID,
      directions: {
        create: directions.map((dir) => ({
          address: dir.address,
          city: dir.city,
          state: dir.state,
          zipCode: dir.zipCode,
        })),
      },
    },
  });
  const token = process.env.JWT_SECRET as string;
  const options: SignOptions = {
    expiresIn: '7d',
  };
  const payload = {
    userID: user.userID,
    email: user.email,
    role: user.role,
  };
  const jwtToken = jwt.sign(payload, token, options);
  return { token, user };
}
