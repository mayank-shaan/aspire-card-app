export interface DebitCard {
  id: string;
  name: string;
  cardNumber: string;
  maskedNumber: string;
  expirationDate: string;
  cvv: string;
  balance: number;
  isFrozen: boolean;
  isCardNumberVisible: boolean;
  cardType: 'visa' | 'mastercard';
  createdAt: Date;
}

export interface CardFormData {
  name: string;
}

export type CardAction = 'freeze' | 'set-limit' | 'add-gpay' | 'replace' | 'cancel';
