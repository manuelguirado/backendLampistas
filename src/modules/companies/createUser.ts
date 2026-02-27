import { PrismaClient } from '../../../generated/prisma';
import { hashPassword } from '../../utils/hash/hashPassword';
import { assingCompanyToUser } from '../companies/assignUserCompany';
import { sendClientCredentialsEmail } from '../mailing/sendClientCredentials';
import jwt, { SignOptions } from 'jsonwebtoken';
const prisma = new PrismaClient();
export async function companyCreateUser(
  companyID: number, // Extraído del JWT
  name: string,
  email: string,
  password: string,
) {
  if (!email || !password || !companyID) {
    throw new Error('Email, password, and companyID are required');
  }
  const company = await prisma.company.findUnique({
    where: { companyID },
  });

  if (!company) {
    throw new Error('Company does not exist');
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
      companyID, // Asignado automáticamente
    },
  });
  const sendEmail = await sendClientCredentialsEmail(
    '¡Bienvenido a nuestra plataforma!',
    'Gracias por registrarte en nuestro servicio. Aquí están tus credenciales User: ' +
      email +
      ' Password: ' +
      password,
  );
  const newUser = await assingCompanyToUser(companyID, user.userID);
  try {
    const payload = {
      userID: user.userID,
      companyID: companyID,
      role: user.role,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return { token, ...newUser, sendEmail };
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Internal server error');
  }
}
