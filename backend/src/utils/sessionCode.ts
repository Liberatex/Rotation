/**
 * Generates a unique 6-character session code
 * Format: 3 letters + 3 numbers (e.g., ABC123)
 */
export const generateSessionCode = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let code = '';
  
  // Generate 3 random letters
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 3 random numbers
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return code;
};

/**
 * Validates session code format
 */
export const isValidSessionCode = (code: string): boolean => {
  return /^[A-Z]{3}[0-9]{3}$/.test(code);
};

