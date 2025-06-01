import type { DebitCard, CardFormData } from '@/types'
import { generateCardNumber, generateExpiryDate, generateCVV } from '@/utils/cardGenerator'
import cardsData from '@/data/cards.json'

class CardAPI {
  private cards: DebitCard[] = []
  private cardIdCounter = 1000

  constructor() {
    this.cards = cardsData.map((card) => ({
      ...card,
      cardType: card.cardType as 'visa' | 'mastercard',
      createdAt: new Date(card.createdAt),
    }))
  }

  private generateCardId(): string {
    return `card-${Date.now()}-${this.cardIdCounter++}`
  }

  async getCards(): Promise<DebitCard[]> {
    await this.delay(300)

    return this.cards.map((card) => ({ ...card }))
  }

  async getCardById(cardId: string): Promise<DebitCard | null> {
    await this.delay(200)

    const card = this.cards.find((c) => c.id === cardId)
    return card ? { ...card } : null
  }

  async createCard(cardData: CardFormData): Promise<DebitCard> {
    await this.delay(500)

    const newCard: DebitCard = {
      id: this.generateCardId(),
      name: cardData.name,
      cardNumber: generateCardNumber(),
      maskedNumber: '',
      expirationDate: generateExpiryDate(),
      cvv: generateCVV(),
      balance: 3000,
      isFrozen: false,
      isCardNumberVisible: false,
      cardType: 'visa',
      createdAt: new Date(),
    }

    const cardParts = newCard.cardNumber.split(' ')
    newCard.maskedNumber = `•••• •••• •••• ${cardParts[3]}`
    this.cards.push(newCard)
    return { ...newCard }
  }

  async updateCard(cardId: string, updates: Partial<DebitCard>): Promise<DebitCard> {
    await this.delay(200)

    const cardIndex = this.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) {
      throw new Error(`Card with id ${cardId} not found`)
    }
    this.cards[cardIndex] = {
      ...this.cards[cardIndex],
      ...updates,
      id: cardId,
    }

    return { ...this.cards[cardIndex] }
  }

  async deleteCard(cardId: string): Promise<void> {
    await this.delay(300)

    const cardIndex = this.cards.findIndex((c) => c.id === cardId)
    if (cardIndex !== -1) {
      this.cards.splice(cardIndex, 1)
    }
  }

  async resetToDefaults(): Promise<void> {
    await this.delay(200)
    this.cards = cardsData.map((card) => ({
      ...card,
      cardType: card.cardType as 'visa' | 'mastercard',
      createdAt: new Date(card.createdAt),
    }))
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export const cardApi = new CardAPI()
