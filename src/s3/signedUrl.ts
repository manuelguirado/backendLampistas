import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { s3Config } from '../shared/s3Config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client(s3Config);

export async function generateUploadSignedUrl(
  bucketName: string,
  objectID: string,
  fileType: string,
): Promise<string> {
  try {
    const s3Params = {
      Bucket: bucketName,
      Key: objectID,
      ContentType: fileType,
    };
    const command = new PutObjectCommand(s3Params);

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return signedUrl;
  } catch (error) {
    throw new Error(`Error generating upload signed URL: ${error}`);
  }
}

export async function generateDownloadSignedUrl(
  bucketName: string,
  objectKey: string,
): Promise<string> {
  try {
    const s3Params = {
      Bucket: bucketName,
      Key: objectKey,
    };
    const command = new GetObjectCommand(s3Params);

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hora de expiración
    });

    return signedUrl;
  } catch (error) {
    throw new Error(`Error generating download signed URL: ${error}`);
  }
}
