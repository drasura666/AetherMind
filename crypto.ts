import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'ultimate-ai-secure-key-v1';

export function encryptAPIKey(apiKey: string): string {
  try {
    const encrypted = CryptoJS.AES.encrypt(apiKey, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    throw new Error('Failed to encrypt API key');
  }
}

export function decryptAPIKey(encryptedKey: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedKey, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error('Invalid encrypted key');
    }
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt API key');
  }
}

export function clearStoredKeys(): void {
  localStorage.removeItem('ultimateai_api_keys');
  localStorage.removeItem('ultimateai_selected_provider');
}
