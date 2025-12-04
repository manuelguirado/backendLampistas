import bcrypt from 'bcryptjs';
import jsonwebtoken, { SignOptions } from 'jsonwebtoken';
import { $Enums, PrismaClient } from '../../generated/prisma';
import { hashPassword } from './hash/hashPassword';
import type { UserType } from './types/userType';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function refreshToken(
  oldRefreshToken: string,
  userType: UserType,
  id: number,
) {
  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
    const accessSecret = process.env.JWT_SECRET as string;

    const decoded = jsonwebtoken.verify(
      oldRefreshToken,
      refreshSecret,
    ) as jsonwebtoken.JwtPayload;

    // Verificar que el tipo coincida
    if (decoded.userType !== userType) {
      throw new Error('Invalid user type');
    }

    let entity:
      | {
          companyID: number;
          userID: number | null;
          email: string;
          name: string;
          phone: string;
          password: string;
          budgetID: number | null;
          suspended: boolean;
          suspendedUntil: Date | null;
          role: $Enums.Role;
          companyCode: string | null;
          refreshToken: string | null;
        }
      | {
          companyID: number | null;
          userID: number;
          email: string;
          name: string | null;
          password: string;
          role: $Enums.Role;
          refreshToken: string | null;
          incidentsID: number | null;
          paymentsID: number | null;
          machineryID: number | null;
          userCode: string | null;
          contractID: number | null;
        }
      | {
          companyID: number;
          email: string;
          name: string;
          password: string;
          role: $Enums.Role;
          refreshToken: string | null;
          workerid: number;
          workerCode: string | null;
        }
      | {
          email: string;
          password: string;
          role: $Enums.Role;
          refreshToken: string | null;
          adminID: number;
        }
      | null;
    let payload: string | object;

    switch (userType) {
      case 'company': {
        entity = await prisma.company.findUnique({
          where: { companyID: id },
        });
        if (!entity) throw new Error('Company not found');

        // ✅ Comparar hash del refresh token guardado
        const isValid = await bcrypt.compare(
          oldRefreshToken,
          entity.refreshToken || '',
        );
        if (!isValid) throw new Error('Invalid refresh token');

        payload = { companyID: id, role: entity.role, userType: 'company' };
        break;
      }
      case 'user': {
        entity = await prisma.user.findUnique({
          where: { userID: id },
        });
        if (!entity) throw new Error('User not found');

        const isValid = await bcrypt.compare(
          oldRefreshToken,
          entity.refreshToken || '',
        );
        if (!isValid) throw new Error('Invalid refresh token');

        payload = {
          userID: id,
          role: entity.role,
          userType: 'user',
          companyID: entity.companyID,
        };
        break;
      }
      case 'worker': {
        entity = await prisma.worker.findUnique({
          where: { workerid: id },
        });
        if (!entity) throw new Error('Worker not found');

        const isValid = await bcrypt.compare(
          oldRefreshToken,
          entity.refreshToken || '',
        );
        if (!isValid) throw new Error('Invalid refresh token');

        payload = { workerid: id, role: entity.role, userType: 'worker' };
        break;
      }
      case 'admin': {
        entity = await prisma.admin.findUnique({
          where: { adminID: id },
        });
        if (!entity) throw new Error('Admin not found');

        const isValid = await bcrypt.compare(
          oldRefreshToken,
          entity.refreshToken || '',
        );
        if (!isValid) throw new Error('Invalid refresh token');

        payload = { adminID: id, role: entity.role, userType: 'admin' };
        break;
      }
      default:
        throw new Error('Invalid user type');
    }

    // ✅ Generar NUEVO access token (corta duración)
    const newAccessToken = jsonwebtoken.sign(
      payload,
      accessSecret,
      { expiresIn: '15m' } as SignOptions, // ✅ 15 minutos
    );

    // ✅ Generar NUEVO refresh token (larga duración)
    const newRefreshToken = jsonwebtoken.sign(
      { ...payload, type: 'refresh' },
      refreshSecret,
      { expiresIn: '7d' } as SignOptions, // ✅ 7 días
    );

    // ✅ Hashear y guardar el nuevo refresh token
    const hashedRefreshToken = await hashPassword(newRefreshToken);

    // ✅ Actualizar en BD según el tipo
    switch (userType) {
      case 'company':
        await prisma.company.update({
          where: { companyID: id },
          data: { refreshToken: hashedRefreshToken },
        });
        break;
      case 'user':
        await prisma.user.update({
          where: { userID: id },
          data: { refreshToken: hashedRefreshToken },
        });
        break;
      case 'worker':
        await prisma.worker.update({
          where: { workerid: id },
          data: { refreshToken: hashedRefreshToken },
        });
        break;
      case 'admin':
        await prisma.admin.update({
          where: { adminID: id },
          data: { refreshToken: hashedRefreshToken },
        });
        break;
    }

    // ✅ Devolver AMBOS tokens al cliente
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, // Cliente debe guardar este nuevo
    };
  } catch (error) {
    throw new Error(`Error refreshing token: ${error}`);
  }
}
