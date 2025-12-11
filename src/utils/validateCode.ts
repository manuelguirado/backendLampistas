import { UserType } from './types/userType';
import { PrismaClient } from '../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
const prisma = new PrismaClient();

function generateToken(payload: object) {
  try {
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '15m' };
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
      if (!company) {
        throw new Error('Invalid company code');
      }
      const payload = { companyID: company.companyID, role: company.role };
      const token = generateToken(payload);
      return { company: true, token };
    }
    case 'user': {
      const user = await prisma.user.findFirst({
        where: {
          userCode: code,
        },
      });
      if (!user) {
        throw new Error('Invalid user code');
      }
      const payload = {
        userID: user.userID,
        role: user.role,
        companyID: user.companyID,
      };
      const token = generateToken(payload);
      return { user: true, token };
    }
    case 'worker': {
      const worker = await prisma.worker.findFirst({
        where: {
          workerCode: code,
        },
      });

      if (!worker) {
        throw new Error('Invalid worker code');
      }
      const payload = {
        workerID: worker.workerid,
        role: worker.role,
      };

      const token = generateToken(payload);

      return { worker: true, token };
    }
    default:
      throw new Error(`Invalid user type `);
  }
}
