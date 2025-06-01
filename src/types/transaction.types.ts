export interface Transaction {
  id: string
  cardId: string
  merchant: string
  amount: number
  type: 'credit' | 'debit'
  category:
    | 'refund'
    | 'purchase'
    | 'transfer'
    | 'charge'
    | 'travel'
    | 'transport'
    | 'food'
    | 'business'
  date: Date
  description: string
  iconType: 'card' | 'plane' | 'megaphone' | 'shopping' | 'transfer' | 'car' | 'coffee' | 'business'
  iconColor: string
}

export interface TransactionGroup {
  date: string
  transactions: Transaction[]
}

export interface TransactionData {
  id: string
  cardId: string
  merchant: string
  amount: number
  type: 'credit' | 'debit'
  category: string
  date: string
  description: string
  iconType: string
  iconColor: string
}
