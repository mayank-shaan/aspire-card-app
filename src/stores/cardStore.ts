import { defineStore } from 'pinia'
import type { DebitCard, CardFormData } from '@/types'
import { cardApi } from '@/services/cardApi'

interface CardState {
  cards: DebitCard[]
  selectedCardId: string | null
  isLoading: boolean
  error: string | null
}

export const useCardStore = defineStore('cards', {
  state: (): CardState => ({
    cards: [],
    selectedCardId: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    selectedCard: (state): DebitCard | null =>
      state.cards.find((card) => card.id === state.selectedCardId) || null,

    myCards: (state): DebitCard[] => state.cards.filter((card) => !card.id.includes('company')),

    companyCards: (state): DebitCard[] => state.cards.filter((card) => card.id.includes('company')),

    frozenCards: (state): DebitCard[] => state.cards.filter((card) => card.isFrozen),

    activeCards: (state): DebitCard[] => state.cards.filter((card) => !card.isFrozen),
  },

  actions: {
    async loadCards() {
      this.isLoading = true
      this.error = null

      try {
        this.cards = await cardApi.getCards()
        if (this.cards.length > 0 && !this.selectedCardId) {
          this.selectedCardId = this.cards[0].id
        }

      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load cards'

      } finally {
        this.isLoading = false
      }
    },

    async addCard(cardData: CardFormData) {
      this.isLoading = true
      this.error = null

      try {
        const newCard = await cardApi.createCard(cardData)
        this.cards.push(newCard)
        this.selectedCardId = newCard.id
        return newCard
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to add card'

        throw error
      } finally {
        this.isLoading = false
      }
    },

    async toggleCardFreeze(cardId: string) {
      const card = this.cards.find((c) => c.id === cardId)
      if (!card) return false

      const previousState = card.isFrozen

      try {
        card.isFrozen = !card.isFrozen
        await cardApi.updateCard(cardId, { isFrozen: card.isFrozen })
        return true
      } catch (error) {
        card.isFrozen = previousState
        this.error = error instanceof Error ? error.message : 'Failed to update card'

        return false
      }
    },

    toggleCardNumberVisibility(cardId: string) {
      const card = this.cards.find((c) => c.id === cardId)
      if (card) {
        card.isCardNumberVisible = !card.isCardNumberVisible
      }
    },

    selectCard(cardId: string) {
      if (this.cards.find((card) => card.id === cardId)) {
        this.selectedCardId = cardId
      }
    },

    clearError() {
      this.error = null
    },

    async initializeStore() {

      await this.loadCards()
    },
  },
})
