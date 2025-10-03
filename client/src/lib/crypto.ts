// client/src/lib/crypto.ts
import CryptoJS from 'crypto-js';

// This secret key is loaded from your environment variables.
// It is crucial that this key is kept secret and is not hardcoded here.
const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY as string;

// In a development environment, this will warn you if the secret key is not set.
if (import.meta.env.DEV && !SECRET_KEY) {
  throw new Error('VITE_CRYPTO_SECRET_KEY is not defined in your .env file. This is required for encryption.');
}

/**
 * Encrypts an API key using AES.
 * @param apiKey The plaintext API key to encrypt.
 * @returns The encrypted key as a string.
 */
export function encryptAPIKey(apiKey: string): string {
  if (!SECRET_KEY) {
    console.error("Encryption failed: Secret key is not available.");
    return '';
  }
  const encrypted = CryptoJS.AES.encrypt(apiKey, SECRET_KEY).toString();
  return encrypted;
}

/**
 * Decrypts an API key using AES.
 * @param encryptedKey The encrypted key string.
 * @returns The decrypted, plaintext API key.
 */
export function decryptAPIKey(encryptedKey: string): string {
  if (!SECRET_KEY) {
    console.error("Decryption failed: Secret key is not available.");
    return '';
  }
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error("Decryption resulted in an empty string, possibly due to a wrong secret key.");
    }
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt API key:", error);
    return '';
  }
}

/**
 * Clears all API key and provider data from local storage.
 */
export function clearStoredKeys(): void {
  localStorage.removeItem('ultimateai_api_keys');
  localStorage.removeItem('ultimateai_selected_provider');
}
