import type { Transaction, TransactionData } from '@/types'
import transactionsData from '@/data/transactions.json'

class TransactionAPI {
  private transactions: Transaction[] = []

  constructor() {
    this.transactions = (transactionsData as TransactionData[]).map((transaction) => {
      let category: Transaction['category']
      switch (transaction.category) {
        case 'refund':
          category = 'refund'
          break
        case 'purchase':
          category = 'purchase'
          break
        case 'travel':
          category = 'travel'
          break
        case 'transport':
          category = 'transport'
          break
        case 'food':
          category = 'food'
          break
        case 'business':
          category = 'business'
          break
        case 'transfer':
          category = 'transfer'
          break
        default:
          category = 'charge'
      }

      let iconType: Transaction['iconType']
      switch (transaction.iconType) {
        case 'card':
          iconType = 'card'
          break
        case 'plane':
          iconType = 'plane'
          break
        case 'megaphone':
          iconType = 'megaphone'
          break
        case 'shopping':
          iconType = 'shopping'
          break
        case 'transfer':
          iconType = 'transfer'
          break
        case 'car':
          iconType = 'car'
          break
        case 'coffee':
          iconType = 'coffee'
          break
        case 'business':
          iconType = 'business'
          break
        default:
          iconType = 'card'
      }

      return {
        ...transaction,
        category,
        iconType,
        date: new Date(transaction.date),
        type: transaction.type as 'debit' | 'credit',
      }
    })
  }

  async getTransactions(): Promise<Transaction[]> {
    await this.delay(200)
    return this.transactions.map((transaction) => ({ ...transaction }))
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const transactionApi = new TransactionAPI()
