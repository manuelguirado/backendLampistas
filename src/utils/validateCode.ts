import { UserType } from './types/userType';
import { PrismaClient } from '../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
const prisma = new PrismaClient();
function generatetoken(usertype: UserType, code: string) {
  try {
    const payload = { code, usertype };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return token;
  } catch (error) {
    throw new Error(`Error generating token ${error}`);
  }
}
export async function validateCode(userType: UserType, code: string) {
  if (!code) {
    throw new Error('code are required');
  }

  switch (userType) {
    case 'company': {
      const company = await prisma.company.findFirst({
        where: {
          companyCode: code,
        },
      });
      const token = generatetoken('company', code);
      return { company: company !== null, token };
    }
    case 'user': {
      const user = await prisma.user.findFirst({
        where: {
          userCode: code,
        },
      });
      const token = generatetoken('user', code);
      return { user: user !== null, token };
    }
    case 'worker': {
      const worker = await prisma.worker.findFirst({
        where: {
          workerCode: code,
        },
      });
      const token = generatetoken('worker', code);
      console.log('Generated token for worker:', token);
      return { worker: worker !== null, token };
    }
    default:
      throw new Error(`Invalid user type `);
  }
}
