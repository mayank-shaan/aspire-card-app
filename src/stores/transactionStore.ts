import { defineStore } from 'pinia'
import type { Transaction } from '@/types'
import { transactionApi } from '@/services/transactionApi'

interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
}

export const useTransactionStore = defineStore('transactions', {
  state: (): TransactionState => ({
    transactions: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    getTransactionsByCardId:
      (state) =>
      (cardId: string): Transaction[] => {
        return state.transactions.filter((transaction) => transaction.cardId === cardId)
      },

    recentTransactions: (state): Transaction[] => {
      return state.transactions.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10)
    },

    transactionsByDate: (state) => {
      const grouped = state.transactions.reduce(
        (acc, transaction) => {
          const dateKey = transaction.date.toISOString().split('T')[0]
          if (!acc[dateKey]) {
            acc[dateKey] = []
          }
          acc[dateKey].push(transaction)
          return acc
        },
        {} as Record<string, Transaction[]>,
      )

      return Object.entries(grouped)
        .map(([date, transactions]) => ({
          date,
          transactions: transactions.sort((a, b) => b.date.getTime() - a.date.getTime()),
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    },
  },

  actions: {
    async loadTransactions() {
      this.isLoading = true
      this.error = null

      try {
        this.transactions = await transactionApi.getTransactions()

      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load transactions'

      } finally {
        this.isLoading = false
      }
    },

    async loadTransactionsByCardId(cardId: string) {
      await this.loadTransactions()

    },

    clearError() {
      this.error = null
    },

    async initializeStore() {

      await this.loadTransactions()
    },
  },
})
