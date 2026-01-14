import { fileTypeFromBuffer } from 'file-type';
import { ALLOWED_MIME_TYPES } from '../constants/ALLOWED_FILES';
export async function validateFile(fileBuffer: Buffer, name: string) {
  const fileDetected = await fileTypeFromBuffer(fileBuffer);
  if (!fileDetected) {
    throw new Error(
      `The file ${name} has an unsupported format or is corrupted.`,
    );
  }
  if (
    !ALLOWED_MIME_TYPES.Image.includes(fileDetected.mime) &&
    !ALLOWED_MIME_TYPES.documents.includes(fileDetected.mime) &&
    !ALLOWED_MIME_TYPES.archives.includes(fileDetected.mime)
  ) {
    throw new Error(
      `The file ${name} has an unsupported format: ${fileDetected.mime}.`,
    );
  }
  return fileDetected;
}
