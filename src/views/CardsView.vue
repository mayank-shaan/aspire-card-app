<template>
  <div class="cards-page">

    <div v-if="$q.screen.lt.md" class="mobile-layout">
      <div class="mobile-header">
        <div class="column q-pa-lg">
          <div class="row justify-between items-start q-mb-lg">
            <div class="column">
              <span class="balance-label">Account balance</span>
              <div class="row items-center q-gutter-sm">
                <span class="currency-badge-mobile">S$</span>
                <span class="balance-amount-mobile">3,000</span>
              </div>
            </div>
            <q-btn
              flat
              @click="showAddCardModal"
              class="new-card-btn-mobile"
            >
              <q-icon name="add" size="sm" class="q-mr-sm" />
              New card
            </q-btn>
          </div>

          <div class="row q-gutter-xl q-mb-lg">
            <button
              v-for="tab in cardTabs"
              :key="tab.key"
              class="mobile-tab-item"
              :class="{ 'active': tab.key === activeTab }"
              @click="setActiveTab(tab.key)"
            >
              <span class="tab-label">{{ tab.label }}</span>
            </button>
          </div>

          <div class="mobile-card-container">
            <div class="card-wrapper">
              <CardCarousel
                :cards="displayedCards"
                :selected-card-id="selectedCardId"
                :show-toggle-button="true"
                @card-selected="handleCardSelected"
                @add-card="showAddCardModal"
                @toggle-card-number="toggleCardNumber"
                class="mobile-carousel-in-header"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mobile-content-section">
        <div class="mobile-actions-container q-pa-md q-pb-none">
          <CardActions
            :card="selectedCard"
            :loading="cardActionLoading"
            @action-clicked="handleCardAction"
            class="mobile-card-actions"
            mobile-layout
          />
        </div>

        <div class="mobile-panels q-px-lg q-pb-lg">
          <q-card class="mobile-panel q-mb-md" flat>
            <q-expansion-item
              default-opened
              icon="account_balance_wallet"
              label="Card details"
              header-class="mobile-panel-header"
            >
              <q-card-section class="q-pt-none">
                <div v-if="selectedCard" class="column q-gutter-md">
                  <div class="row justify-between items-center">
                    <span class="detail-label">Card Number</span>
                    <span class="detail-value">{{ selectedCard.maskedNumber }}</span>
                  </div>
                  <div class="row justify-between items-center">
                    <span class="detail-label">Card Holder</span>
                    <span class="detail-value">{{ selectedCard.name }}</span>
                  </div>
                  <div class="row justify-between items-center">
                    <span class="detail-label">Expiry Date</span>
                    <span class="detail-value">{{ selectedCard.expirationDate }}</span>
                  </div>
                  <div class="row justify-between items-center">
                    <span class="detail-label">CVV</span>
                    <span class="detail-value">{{ selectedCard.cvv }}</span>
                  </div>
                  <div class="row justify-between items-center">
                    <span class="detail-label">Status</span>
                    <q-chip 
                      size="sm"
                      :color="selectedCard.isFrozen ? 'blue-grey' : 'secondary'"
                      text-color="white"
                    >
                      {{ selectedCard.isFrozen ? 'Frozen' : 'Active' }}
                    </q-chip>
                  </div>
                </div>
                <p v-else class="text-body2 text-grey-6">No card selected</p>
              </q-card-section>
            </q-expansion-item>
          </q-card>

          <q-card class="mobile-panel" flat>
            <q-expansion-item
              default-opened
              icon="receipt_long"
              label="Recent transactions"
              header-class="mobile-panel-header"
            >
              <q-list separator class="q-pt-none" v-if="validTransactions.length > 0">
                <q-item
                  v-for="transaction in validTransactions"
                  :key="transaction.id"
                  class="mobile-transaction-item"
                >
                  <q-item-section avatar>
                    <q-avatar 
                      :style="{ backgroundColor: getTransactionIconColor(transaction.iconType) }"
                      size="40px"
                    >
                      <q-icon :name="getTransactionIconName(transaction.iconType)" size="sm" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <div class="column">
                      <div class="row justify-between items-center q-mb-xs">
                        <q-item-label class="mobile-merchant">{{ transaction.merchant }}</q-item-label>
                        <span class="mobile-amount" :class="{ 'positive': transaction.type === 'credit' }">
                          {{ transaction.type === 'credit' ? '+' : '-' }} S${{ Math.abs(transaction.amount) }}
                        </span>
                      </div>
                      <q-item-label caption class="mobile-date q-mb-xs">{{ formatDate(transaction.date) }}</q-item-label>
                      <div class="row items-center q-gutter-xs">
                        <q-chip 
                          dense 
                          color="primary" 
                          text-color="white" 
                          size="sm"
                          class="mobile-transaction-badge"
                        >
                          <q-icon name="credit_card" size="xs" />
                        </q-chip>
                        <span class="mobile-transaction-text">{{ transaction.description }}</span>
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
              
              <div v-else class="q-pa-lg text-center">
                <q-icon name="receipt_long" size="lg" color="grey-4" class="q-mb-md" />
                <p class="text-body2 text-grey-6">No recent transactions</p>
              </div>
              
              <q-card-section class="text-center mobile-view-all-btn q-py-sm" v-if="validTransactions.length > 0">
                <q-btn
                  flat
                  color="secondary"
                  class=""
                >
                  View all card transactions
                </q-btn>
              </q-card-section>
            </q-expansion-item>
          </q-card>
        </div>
      </div>
    </div>


    <div v-else class="desktop-layout">

      <div class="column full-height">

        <div class="row justify-between items-center q-pa-xl">
          <div class="column">
            <span class="text-body2 text-grey-6 q-mb-xs">Available balance</span>
            <div class="row items-center q-gutter-sm">
              <span class="currency-badge">S$</span>
              <span class="balance-amount">3,000</span>
            </div>
          </div>
          <q-btn
            color="primary"
            unelevated
            @click="showAddCardModal"
            class="q-px-lg"
          >
            <q-icon name="add" size="sm" class="q-mr-sm" />
            New card
          </q-btn>
        </div>


        <div class="row q-px-xl">
          <button
            v-for="tab in cardTabs"
            :key="tab.key"
            class="tab-item"
            :class="{ 'active': tab.key === activeTab }"
            @click="setActiveTab(tab.key)"
          >
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </div>


        <div class="col-grow q-pa-xl q-mx-xl q-my-lg" style="box-shadow: 0 2px 12px #00000014;">

          <div class="row q-col-gutter-xl">

            <div class="col-12 col-lg-6 col-xl-7">
              <div class="column q-gutter-lg">




                <div class="column items-center q-gutter-xl">

                  <div class="carousel-container">
                    <CardCarousel
                    :cards="displayedCards"
                    :selected-card-id="selectedCardId"
                    :show-toggle-button="true"
                    @card-selected="handleCardSelected"
                      @add-card="showAddCardModal"
                    @toggle-card-number="toggleCardNumber"
                  />
                  </div>


                  <div class="actions-container">
                    <CardActions
                      :card="selectedCard"
                      :loading="cardActionLoading"
                      @action-clicked="handleCardAction"
                      class="card-actions-styled"
                    />
                  </div>
                </div>
              </div>
            </div>


            <div class="col-12 col-lg-6 col-xl-5">
              <div class="desktop-right-panel">

                <div class="details-panel q-mb-lg custom-accordion">
                  <div class="accordion-header" @click="cardDetailsExpanded = !cardDetailsExpanded">
                    <div class="header-content">
                      <SvgIcon name="card-details" category="transactions" size="lg" />
                      <span class="panel-title">Card details</span>
                    </div>
                    <SvgIcon name="right" category="ui" size="sm" class="expand-arrow" :class="{ 'expanded': cardDetailsExpanded }" />
                  </div>
                  
                  <div v-if="cardDetailsExpanded" class="accordion-content">
                    <div v-if="selectedCard">
                      <div class="detail-row">
                        <span class="detail-label">Card Number</span>
                        <span class="detail-value">{{ selectedCard.maskedNumber }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Card Holder</span>
                        <span class="detail-value">{{ selectedCard.name }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Expiry Date</span>
                        <span class="detail-value">{{ selectedCard.expirationDate }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">CVV</span>
                        <span class="detail-value">{{ selectedCard.cvv }}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Status</span>
                        <q-chip 
                          size="sm"
                          :color="selectedCard.isFrozen ? 'blue-grey' : 'secondary'"
                          text-color="white"
                          class="status-chip"
                        >
                          {{ selectedCard.isFrozen ? 'Frozen' : 'Active' }}
                        </q-chip>
                      </div>
                    </div>
                    <div v-else>
                      <p class="no-data">No card selected</p>
                    </div>
                  </div>
                </div>


                <div class="transactions-panel custom-accordion">
                  <div class="accordion-header" @click="transactionsExpanded = !transactionsExpanded">
                    <div class="header-content">
                      <SvgIcon name="recent-transactions" category="transactions" size="lg" />
                      <span class="panel-title">Recent transactions</span>
                    </div>
                    <SvgIcon name="right" category="ui" size="sm" class="expand-arrow" :class="{ 'expanded': transactionsExpanded }" />
                  </div>
                  
                  <div v-if="transactionsExpanded" class="accordion-content transactions-content">

                    <div v-if="validTransactions.length > 0" class="transaction-list">
                      <div
                        v-for="transaction in validTransactions"
                        :key="transaction.id"
                        class="transaction-item"
                      >

                        <div class="transaction-avatar">
                          <div 
                            class="avatar-circle"
                            :style="{ backgroundColor: getTransactionIconColor(transaction.iconType) }"
                          >
                            <SvgIcon :name="getTransactionSvgIcon(transaction.iconType)" category="transactions" size="md" />
                          </div>
                        </div>


                        <div class="transaction-details">
                          <div class="transaction-header">
                            <span class="merchant">{{ transaction.merchant }}</span>
                          </div>
                          <div class="transaction-meta">
                            <span class="date">{{ formatDate(transaction.date) }}</span>
                            <div class="transaction-info row items-center q-gutter-xs">
                              <div class="transaction-chip">
                                <SvgIcon name="card" category="navigation" size="xs" />
                              </div>
                              <span class="transaction-description q-ml-none">{{ transaction.description }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="transaction-arrow">
                          <span class="amount q-mr-sm" :class="{ 'positive': transaction.type === 'credit' }">
                            {{ transaction.type === 'credit' ? '+' : '-' }} S${{ Math.abs(transaction.amount) }}
                          </span>
                          <SvgIcon name="right" category="ui" size="sm" />
                        </div>
                      </div>
                    </div>
                    
                    <div v-else class="no-transactions">
                      <SvgIcon name="recent-transactions" category="transactions" size="xl" color="gray" />
                      <p class="no-data">No recent transactions</p>
                    </div>
                    

                    <div v-if="validTransactions.length > 0" class="view-all-container">
                      <button class="view-all-btn">
                        View all card transactions
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <AddCardModal
      v-model="showModal"
      @card-added="handleAddCard"
    />


    <q-inner-loading :showing="loading">
      <q-spinner-dots size="40px" color="secondary" />
    </q-inner-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useCardStore } from '@/stores/cardStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { useUIStore } from '@/stores/uiStore';
import { useNotifications } from '@/composables/useNotifications';
import type { CardAction, CardFormData } from '@/types';


type TabKey = 'my-cards' | 'company-cards';

interface CardTab {
  key: TabKey;
  label: string;
  count: number;
}


import CardCarousel from '@/components/cards/CardCarousel.vue';
import CardActions from '@/components/cards/CardActions.vue';
import AddCardModal from '@/components/cards/AddCardModal.vue';
import SvgIcon from '@/components/ui/SvgIcon.vue';


const components = {
  CardCarousel,
  CardActions, 
  AddCardModal,
  SvgIcon
};


const $q = useQuasar();
const { showSuccess, showError, showInfo } = useNotifications();
const cardStore = useCardStore();
const transactionStore = useTransactionStore();
const uiStore = useUIStore();


const loading = ref(false);
const cardActionLoading = ref(false);
const transactionsLoading = ref(false);
const showModal = ref(false);
const isCardNumberVisible = ref(false);
const cardDetailsExpanded = ref(false);
const transactionsExpanded = ref(true);


const activeTab = computed({
  get: () => uiStore.activeTab,
  set: (value) => uiStore.setActiveTab(value)
});

const selectedCardId = computed(() => cardStore.selectedCardId);
const selectedCard = computed(() => cardStore.selectedCard);

const cardTabs = computed((): CardTab[] => [
  {
    key: 'my-cards' as TabKey,
    label: 'My debit cards',
    count: cardStore.myCards.length
  },
  {
    key: 'company-cards' as TabKey, 
    label: 'All company cards',
    count: cardStore.companyCards.length
  }
]);

const displayedCards = computed(() => {
  return activeTab.value === 'my-cards' 
    ? cardStore.myCards 
    : cardStore.companyCards;
});

const recentTransactions = computed(() => {
  if (!selectedCardId.value) return [];
  return transactionStore.getTransactionsByCardId(selectedCardId.value);
});

const validTransactions = computed(() => {
  return recentTransactions.value
    .filter(transaction => transaction && transaction.date)
    .slice(0, 3); // Show only first 3 transactions to match design
});


const setActiveTab = (tab: TabKey) => {
  uiStore.setActiveTab(tab);
};

const toggleCardNumber = () => {
  if (selectedCardId.value) {
    cardStore.toggleCardNumberVisibility(selectedCardId.value);
    isCardNumberVisible.value = !isCardNumberVisible.value;
  }
};

const handleCardSelected = (cardId: string) => {
  cardStore.selectCard(cardId);
  uiStore.selectCard(cardId);
  loadTransactionsForCard(cardId);
};

const handleCardAction = async (action: CardAction, cardId: string) => {
  cardActionLoading.value = true;

  try {
    switch (action) {
      case 'freeze':
        const success = await cardStore.toggleCardFreeze(cardId);
        if (success) {
          const card = cardStore.cards.find(c => c.id === cardId);
          const message = card?.isFrozen ? 'Card has been frozen' : 'Card has been unfrozen';
          showSuccess(message);
        } else {
          showError('Failed to update card status');
        }
        break;
      
      default:
        showInfo(`${action} functionality coming soon`);
        break;
    }
  } catch (error) {

    showError('An error occurred. Please try again.');
  } finally {
    cardActionLoading.value = false;
  }
};

const showAddCardModal = () => {
  showModal.value = true;
};

const handleAddCard = async (cardData: CardFormData) => {
  try {
    const newCard = await cardStore.addCard(cardData);
    showSuccess(`Card for ${newCard.name} has been added successfully`);
    

    showModal.value = false;
  } catch (error) {

    showError('Failed to add card. Please try again.');
  }
};

const loadTransactionsForCard = async (cardId: string) => {
  if (!cardId) return;
  
  transactionsLoading.value = true;
  try {
    await transactionStore.loadTransactionsByCardId(cardId);
    const loadedCount = transactionStore.getTransactionsByCardId(cardId).length;
  } catch (error) {

  } finally {
    transactionsLoading.value = false;
  }
};

const formatDate = (date: Date | string) => {

  if (!date) {

    return 'Unknown date';
  }
  
  let dateObj: Date;
  
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }
  

  if (isNaN(dateObj.getTime())) {

    return 'Invalid date';
  }
  

  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(dateObj);
  } catch (error) {

    return 'Invalid date';
  }
};


const getTransactionIconName = (iconType: string) => {
  const iconMap: Record<string, string> = {
    'card': 'credit_card',
    'plane': 'flight',
    'megaphone': 'campaign',
    'shopping': 'shopping_cart',
    'transfer': 'swap_horiz',
    'car': 'directions_car',
    'coffee': 'local_cafe',
    'business': 'business_center'
  };
  return iconMap[iconType] || 'credit_card';
};


const getTransactionSvgIcon = (iconType: string) => {
  const iconMap: Record<string, string> = {
    'card': 'card-details',
    'plane': 'flights',
    'megaphone': 'megaphone',
    'shopping': 'file-storage',
    'transfer': 'card-details',
    'car': 'car',
    'coffee': 'coffee',
    'business': 'business'
  };
  return iconMap[iconType] || 'card-details';
};


const getTransactionIconColor = (iconType: string) => {
  const colorMap: Record<string, string> = {
    'card': '#009DFF1A',     // Blue
    'plane': '#00D6B51A',    // Green 
    'megaphone': '#F251951A', // Red/Pink
    'shopping': '#F251951A',  // Red
    'transfer': '#8B5CF6',  // Purple
    'car': '#8B5CF6',      // Purple
    'coffee': '#F59E0B',   // Orange
    'business': '#6B7280'  // Gray
  };
  return colorMap[iconType] || '#6B7280';
};


onMounted(async () => {
  loading.value = true;
  try {

    await cardStore.initializeStore();
    await transactionStore.initializeStore();


    if (selectedCardId.value) {
      await loadTransactionsForCard(selectedCardId.value);
    } else if (cardStore.cards.length > 0) {

      const firstCard = cardStore.cards[0];
      cardStore.selectCard(firstCard.id);
      await loadTransactionsForCard(firstCard.id);
    }
  } catch (error) {

    showError('Failed to load cards. Please refresh the page.');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped lang="scss">
.cards-page {
  min-height: 100vh;
  background: var(--bg-primary);
}


.mobile-layout {
  padding-bottom: 40px;
  
  .mobile-header {
    background: var(--bg-dark);
    color: var(--text-light);
    padding-bottom: var(--spacing-xl);
    
    .balance-label {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: var(--spacing-xs);
    }
    
    .currency-badge-mobile {
      background: var(--color-secondary);
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .balance-amount-mobile {
      font-size: 2rem;
      font-weight: 600;
      color: var(--text-light);
    }
    
    .new-card-btn-mobile {
      color: #23CEFD!important;
      font-size: 0.65rem;
      
      &:hover {
        background-color: rgba(16, 185, 129, 0.1) !important;
      }
    }
    
    .mobile-tab-item {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
      padding: var(--spacing-sm) 0;
      position: relative;
      cursor: pointer;
      transition: color 0.2s ease;

      &.active {
        color: var(--text-light);
        font-weight: 600;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--color-secondary);
        }
      }
    }
    
    .show-number-btn-mobile {
      color: var(--color-secondary) !important;
      font-size: 0.875rem;
      
      &:hover {
        background-color: rgba(16, 185, 129, 0.1) !important;
      }
    }
    
    .mobile-card-container {
      margin-top: var(--spacing-lg);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      overflow: hidden;
      padding: 0 var(--spacing-sm);
      
      .card-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 340px;
        margin: 0 auto;
      }
      
      :deep(.mobile-carousel-in-header) {
        width: 100%;
        
        .card-carousel {
          background: transparent !important;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          
          :deep(.q-carousel) {
            background: transparent !important;
            width: 100%;
            max-width: 100%;
          }
          
          :deep(.q-carousel__slide) {
            background: transparent !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          
          .pagination-dot {
            background-color: rgba(255, 255, 255, 0.3);
            
            &.active {
              background-color: var(--color-secondary);
            }
          }
        }
      }
    }
  }
  
  .mobile-content-section {
    background: var(--bg-primary);
    margin-top: -20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    position: relative;
    z-index: 1;
    
    .mobile-actions-container {
      padding-bottom: 0 !important;
      

      @media (max-width: 360px) {
        padding-left: 8px !important;
        padding-right: 8px !important;
      }
      
      @media (min-width: 361px) and (max-width: 480px) {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
      
      :deep(.mobile-card-actions) {
        background: transparent;
        padding: 0;
        

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: clamp(8px, 2vw, 16px);
          margin-bottom: 0;
          padding: 0 4px;
          
          .action-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-xs);
            padding: clamp(8px, 2vw, 12px);
            background: white;
            border-radius: clamp(8px, 2vw, 12px);

            cursor: pointer;
            transition: all 0.2s ease;
            min-height: clamp(60px, 15vw, 80px);
            max-width: 100%;
            
            &:hover {
              transform: translateY(-2px);

            }
            
            .action-icon {
              width: clamp(24px, 6vw, 32px);
              height: clamp(24px, 6vw, 32px);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              flex-shrink: 0;
              
              &.freeze { background: #3B82F6; }
              &.spend { background: #8B5CF6; }
              &.gpay { background: #34D399; }
              &.replace { background: #F59E0B; }
              &.cancel { background: #EF4444; }
            }
            
            .action-label {
              font-size: clamp(0.6rem, 1.8vw, 0.75rem);
              font-weight: 500;
              color: var(--text-primary);
              text-align: center;
              line-height: 1.2;
              word-break: break-word;
              hyphens: auto;
            }
          }
        }
      }
    }
    
    .mobile-panels {
      margin-top: 0;
      padding-top: var(--spacing-lg);
      
      .mobile-panel {
        border-radius: 12px;
        background: #FAFCFF;
        box-shadow: var(--shadow-sm);
        
        :deep(.mobile-panel-header) {
          padding: var(--spacing-lg);
          
          .q-item__section--avatar {
            color: var(--color-primary);
          }
          
          .q-item__label {
            font-weight: 600;
            color: var(--text-primary);
          }
        }
        
        .mobile-transaction-item {
          padding: var(--spacing-md) var(--spacing-lg);
          
          .mobile-merchant {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-primary);
          }

          .mobile-amount {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-primary);

            &.positive {
              color: var(--color-secondary);
            }
          }

          .mobile-date {
            color: #9CA3AF;
            font-size: 0.875rem;
          }

          .mobile-transaction-badge {
            font-size: 0.75rem;
            min-width: 24px;
            height: 24px;
            border-radius: 50% !important;
            
            .q-icon {
              margin: 0 !important;
            }
          }
          
          .mobile-transaction-text {
            font-size: 0.75rem;
            color: var(--text-secondary);
            font-weight: 500;
          }
        }
        
        .mobile-view-all-btn {
          border-top: 1px solid #DDFFEC;
          background-color: #EDFFF5;
          color: #01D167;
          text-align: center;
          font-weight: 600;








          font-weight: 600;
        }
        
        .detail-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        
        .detail-value {
          font-size: 0.875rem;
          color: var(--text-primary);
          font-weight: 600;
        }
      }
    }
  }
}


.desktop-layout {

  .border-bottom {
    border-bottom: 1px solid var(--border-color);
  }

  .tab-shadow {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .hidden {
    display: none;
  }

  .currency-badge {
    background: var(--color-secondary);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .balance-amount {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .tab-item {
    background: none;
    border: none;
    padding: var(--spacing-md) 0;
    margin-right: var(--spacing-xl);
    cursor: pointer;
    position: relative;
    transition: all 0.2s ease;

    .tab-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: color 0.2s ease;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--color-secondary);
      transform: scaleX(0);
      transition: transform 0.2s ease;
    }

    &:hover:not(.active) {
      .tab-label {
        color: var(--text-primary);
      }
    }

    &.active {
      .tab-label {
        color: var(--text-primary);
        font-weight: 600;
      }

      &::after {
        transform: scaleX(1);
      }
    }
  }

  .show-number-btn {
    color: var(--color-secondary) !important;
    font-size: 0.875rem;

    &:hover {
      background-color: rgba(16, 185, 129, 0.1) !important;
    }
  }

  .carousel-container {
    width: 480px;
    display: flex;
    justify-content: center;
  }

  .actions-container {
    width: 480px;
    display: flex;
    justify-content: center;
  }


  :deep(.card-actions-styled) {
    background: #EDF3FF;
    border-radius: 12px;
    padding: var(--spacing-lg);
    width: 480px;
  }


  .desktop-right-panel {
    display: block;
    width: 100%;
    
    .details-panel {
      width: 100%;
      margin-bottom: var(--spacing-lg);
    }
    
    .transactions-panel {
      width: 100%;
    }
  }

  .custom-accordion {
    background: white;
    border-radius: 12px;
    border: 1px solid #F5F5F5;
    
    .accordion-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 20px 24px;
      background-color: #F5F9FF;
      cursor: pointer;
      transition: background-color 0.2s ease;
      border-radius: 12px 12px 0 0;
      
      &:hover {
        background-color: #EDF3FF;
      }
      
      .header-content {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .svg-icon {

        }
        
        .panel-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }
      }
      
      .expand-arrow {
        transition: transform 0.3s ease;
        filter: brightness(0) saturate(100%) invert(60%) sepia(8%) saturate(564%) hue-rotate(202deg) brightness(92%) contrast(86%);
        
        &.expanded {
          transform: rotate(90deg);
        }
      }
    }
    
    .accordion-content {
      padding: 24px;
      background: white;
      border-radius: 0 0 12px 12px;
      
      .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #F3F4F6;
        
        &:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          font-size: 0.875rem;
          color: #6B7280;
          font-weight: 500;
        }
        
        .detail-value {
          font-size: 0.875rem;
          color: #111827;
          font-weight: 600;
        }
        
        .status-chip {
          font-size: 0.75rem;
          height: 24px;
          font-weight: 600;
        }
      }
    }
    
    .transactions-content {
      .transaction-list {
        .transaction-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid #F3F4F6;
          
          &:last-child {
            border-bottom: none;
          }
          
          .transaction-avatar {
            .avatar-circle {
              width: 48px;
              height: 48px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          
          .transaction-details {
            flex: 1;
            
            .transaction-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 8px;
              
              .merchant {
                font-size: 1rem;
                font-weight: 600;
                color: #111827;
              }
              
              .amount {
                font-size: 1rem;
                font-weight: 600;
                color: #111827;
                
                &.positive {
                  color: #10B981;
                }
              }
            }
            
            .transaction-meta {
              display: flex;
              flex-direction: column;
              gap: 8px;
              
              .date {
                font-size: 0.875rem;
                color: #9CA3AF;
              }
              
              .transaction-info {
                display: flex;
                align-items: center;
                gap: 8px;
                
                .transaction-description {
                  font-size: 0.75rem;
                  color: #325BAF;
                  font-weight: 500;
                }
              }
              
              .transaction-chip {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background-color: #1E40AF;
                color: white;
                padding: 6px;
                border-radius: 50%;
                font-size: 0.75rem;
                font-weight: 500;
                width: 24px;
                height: 24px;
                
                .svg-icon {
                  filter: brightness(0) saturate(100%) invert(1);
                }
              }
            }
          }
          
          .transaction-arrow {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .amount {
              font-size: 1rem;
              font-weight: 600;
              color: #111827;
              
              &.positive {
                color: #10B981;
              }
            }
            
            .svg-icon {
              filter: brightness(0) saturate(100%) invert(75%) sepia(11%) saturate(73%) hue-rotate(202deg) brightness(94%) contrast(86%);
            }
          }
        }
      }
      
      .no-transactions {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 40px 0;
        
        .svg-icon {
          filter: brightness(0) saturate(100%) invert(75%) sepia(11%) saturate(73%) hue-rotate(202deg) brightness(94%) contrast(86%);
        }
      }
      
      .view-all-container {
        margin-top: 24px;
        border-top: 1px solid #DDFFEC;
        background-color: #EDFFF5;
        margin-left: -24px;
        margin-right: -24px;
        margin-bottom: -24px;
        padding-left: 24px;
        padding-right: 24px;
        padding-top: 10px;
        padding-bottom: 10px;
        text-align: center;
        
        .view-all-btn {
          background: none;
          border: none;
          color: #01D167;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          padding: 8px 0;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    
    .no-data {
      color: #6B7280;
      font-size: 0.875rem;
      text-align: center;
      margin: 0;
    }
  }
}
</style>
