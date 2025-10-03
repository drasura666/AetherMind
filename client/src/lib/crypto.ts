// client/src/lib/crypto.ts

export function encryptAPIKey(apiKey: string): string {
  // Return the key directly without encryption.
  return apiKey;
}

export function decryptAPIKey(encryptedKey: string): string {
  // Return the key directly as it is no longer encrypted.
  return encryptedKey;
}

export function clearStoredKeys(): void {
  localStorage.removeItem('ultimateai_api_keys');
  localStorage.removeItem('ultimateai_selected_provider');
}
