export const generateCardNumber = (): string => {
  const prefix = '4532';
  const middle = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const middle2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${prefix} ${middle} ${middle2} ${suffix}`;
};

export const generateExpiryDate = (): string => {
  const currentDate = new Date();
  const futureYear = currentDate.getFullYear() + Math.floor(Math.random() * 5) + 2;
  const month = Math.floor(Math.random() * 12) + 1;
  
  const yearStr = futureYear.toString().slice(-2);
  const monthStr = month.toString().padStart(2, '0');
  
  return `${monthStr}/${yearStr}`;
};

export const generateCVV = (): string => {
  return '***';
};

export const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  const lastFour = cleaned.slice(-4);
  return `•••• •••• •••• ${lastFour}`;
};

export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

export const validateCardName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Card name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Card name must be at least 2 characters' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Card name must be less than 50 characters' };
  }
  

  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: 'Card name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
};
