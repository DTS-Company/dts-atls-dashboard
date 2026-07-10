export const MAX_FILE_SIZE_MB = 10;
export function validateFileSize(file: File): {
  valid: boolean;
  message?: string;
} {
  const sizeInMB = file.size / 1024 / 1024;
  if (sizeInMB > MAX_FILE_SIZE_MB) {
    return {
      valid: false,
      message: `Файл слишком большой. Максимальный размер: ${MAX_FILE_SIZE_MB}MB`,
    };
  }
  return { valid: true };
}
