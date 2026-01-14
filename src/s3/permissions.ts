import type { UserType } from '../utils/types/userType';
import dotenv from 'dotenv';
import { getUserID } from '../utils/getUserID';
dotenv.config({ path: '../../../.env' });
export async function userPermissions(id: number, userType: UserType) {
  const getId = await getUserID(userType, id);
  if (!getId) {
    throw new Error('User not found');
  }

  switch (userType) {
    case 'company': {
      if (getId.role !== 'COMPANY') {
        throw new Error('No tienes permisos para realizar esta acción');
      }
      return process.env.COMPANY_TOKEN_CLOUDFLARE as string;
    }
    case 'user': {
      if (getId.role !== 'USER') {
        throw new Error('No tienes permisos para realizar esta acción');
      }
      return process.env.USER_TOKEN_CLOUDFLARE as string;
    }
    case 'worker': {
      if (getId.role !== 'WORKER') {
        throw new Error('No tienes permisos para realizar esta acción');
      }
      return process.env.WORKER_TOKEN_CLOUDFLARE as string;
    }
    default:
      throw new Error('Invalid user type');
  }
}
