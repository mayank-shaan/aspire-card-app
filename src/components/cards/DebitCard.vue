<template>
  <div class="debit-card-wrapper">
    <div v-if="showToggleButton && !previewMode" class="button-container">
      <button 
        @click="$emit('toggle-card-number')"
        class="show-card-number-btn btn-mobile-card-show"
        :class="{ 'card-frozen': activeCard?.isFrozen }"
      >
        <SvgIcon 
          :name="activeCard?.isCardNumberVisible ? 'eye' : 'show-eye'" 
          category="ui" 
          size="xs" 
        />
        <span class="btn-text">SHOW CARD NUMBER</span>
      </button>
    </div>
    
    <div class="debit-card card-transition" :class="{ 'frozen': activeCard?.isFrozen, 'preview': previewMode }">
      <div class="card-container">
        <div class="column full-height justify-between">
          <div class="row justify-end q-mb-md">
            <div class="aspire-logo">
              <SvgIcon 
                name="aspire-logo" 
                category="brand" 
                :size="isMobile ? 'mobile-debit-card' : 'debit-card'" 
              />
            </div>
          </div>
          <div class="card-name q-mb-lg">
            {{ activeCard?.name || 'Card Holder Name' }}
          </div>
          <div class="card-number q-mb-md">
            {{ displayCardNumber }}
          </div>
          <div class="row justify-between items-end">
            <div class="row q-gutter-lg items-end">
              <div class="details-group">
                <span class="label">Thru: </span>
                <span class="value">{{ activeCard?.expirationDate || '••/••' }}</span>
              </div>
              <div class="details-group">
                <span class="label">CVV: </span>
                <span class="value">{{ activeCard?.cvv || '***' }}</span>
              </div>
            </div>
            <div class="card-type">
              <SvgIcon 
                name="visa" 
                category="brand" 
                :size="isMobile ? 'mobile-visa-logo' : 'visa-logo'" 
              />
            </div>
          </div>
        </div>
        <div v-if="activeCard?.isFrozen" class="frozen-overlay column items-center justify-center">
          <q-icon name="ac_unit" size="lg" />
          <span class="frozen-text q-mt-sm">Card Frozen</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useResponsive } from '@/composables/useResponsive';
import type { DebitCard } from '@/types';
import SvgIcon from '@/components/ui/SvgIcon.vue';

interface CardPreview {
  name: string;
  cardNumber?: string;
  maskedNumber?: string;
  expirationDate?: string;
  cvv?: string;
  isFrozen?: boolean;
  isCardNumberVisible?: boolean;
}

interface Props {
  card?: DebitCard;
  cardPreview?: CardPreview;
  showToggleButton?: boolean;
  previewMode?: boolean;
}

interface Emits {
  (e: 'toggle-card-number'): void;
}

const { isMobile } = useResponsive();

const props = withDefaults(defineProps<Props>(), {
  showToggleButton: false,
  previewMode: false
});



const emit = defineEmits<Emits>();

const activeCard = computed(() => {
  if (props.previewMode && props.cardPreview) {
    return {
      name: props.cardPreview.name || 'Card Holder Name',
      cardNumber: props.cardPreview.cardNumber || '•••• •••• •••• ••••',
      maskedNumber: props.cardPreview.maskedNumber || '•••• •••• •••• ••••',
      expirationDate: props.cardPreview.expirationDate || '••/••',
      cvv: props.cardPreview.cvv || '***',
      isFrozen: props.cardPreview.isFrozen || false,
      isCardNumberVisible: props.cardPreview.isCardNumberVisible || false,
    };
  }
  return props.card;
});

const displayCardNumber = computed(() => {
  if (!activeCard.value) return '•••• •••• •••• ••••';
  
  return activeCard.value.isCardNumberVisible 
    ? activeCard.value.cardNumber 
    : activeCard.value.maskedNumber;
});
</script>

<style scoped lang="scss">
@import '@/styles/utilities.scss';

.debit-card-wrapper {
  @include debit-card-wrapper;
  
  .button-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
    
    .show-card-number-btn {
      @include card-action-button;
      
      .svg-icon {
        filter: brightness(0) saturate(100%) invert(74%) sepia(60%) saturate(427%) hue-rotate(98deg) brightness(94%) contrast(90%);
      }
      
      .btn-text {
        color: inherit;
        white-space: nowrap;
      }
    }
  }
}

.debit-card {
  cursor: grab;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  
  .card-container {
    position: relative;
    background: linear-gradient(135deg, var(--card-gradient-start) 0%, var(--card-gradient-end) 100%);
    border-radius: var(--border-radius-card);
    padding: var(--spacing-lg);
    color: white;
    
    width: 100%;
    height: 0;
    padding-bottom: 62.5%; // 16:10 aspect ratio (100/1.6)
    .column {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: var(--spacing-lg);
    }
    
    box-shadow: var(--shadow-card);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }

  .aspire-logo {
    opacity: 0.9;
    
    :deep(.svg-icon) {
      filter: brightness(0) invert(1);
    }
  }

  .card-name {
    font-size: clamp(1.1rem, 4.5vw, 1.25rem);
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: 1.2;
  }

  .card-number {
    font-size: clamp(0.9rem, 3.8vw, 1.1rem);
    font-weight: 400;
    letter-spacing: clamp(2px, 0.8vw, 3px);
    font-family: 'Courier New', monospace;
    line-height: 1.3;
  }

  .label {
    font-size: clamp(0.625rem, 2vw, 0.75rem);
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: clamp(0.75rem, 2.5vw, 0.875rem);
    font-weight: 500;
  }
  
  .details-group {
    display: inline-flex;
    align-items: baseline;
    white-space: nowrap;
    
    .label {
      margin-right: 0;
    }
  }

  .card-type {
    font-size: clamp(1.1rem, 4vw, 1.4rem);
    font-weight: 700;
    font-style: italic;
    letter-spacing: 0.1em;
    align-self: flex-end;
    margin-left: auto;
  }

  .frozen-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    border-radius: var(--border-radius-card);
    z-index: 10;
    
    .frozen-text {
      font-size: clamp(0.75rem, 2.5vw, 0.875rem);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: white;
    }
    
    .q-icon {
      color: white;
      font-size: clamp(2rem, 5vw, 2.5rem);
    }
  }

  &.frozen {
    .card-container {
      opacity: 0.7;
      transform: none;

      &:hover {
        transform: none;
      }
    }
  }

  &.preview {
    .card-container {
      &:hover {
        transform: none;
        box-shadow: var(--shadow-card);
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 375px) {
  .debit-card-wrapper {
    max-width: min(calc(100vw - 24px), 300px);
    
    .button-container .show-card-number-btn {
      font-size: 0.6rem;
      
      .btn-text {
        font-size: 0.55rem;
      }
    }
  }
  
  .debit-card .card-container .column {
    padding: var(--spacing-md);
  }
}

@media (min-width: 480px) {
  .debit-card-wrapper {
    max-width: 360px;
  }
}

@media (min-width: 768px) {
  .debit-card-wrapper {
    max-width: 380px;
  }
}

@include desktop-only {
  .debit-card-wrapper {
    width: 420px;
    max-width: 420px;
    
    .button-container .show-card-number-btn {
      font-size: 0.7rem;
      
      .btn-text {
        font-size: 0.65rem;
      }
    }
  }
  
  .debit-card {
    width: 100%;
    
    .card-container {
      height: 262px; // 420px / 1.6
      padding-bottom: 0;
      
      .column {
        position: absolute;
        padding: calc(var(--spacing-lg) * 1.2);
        height: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }
}
</style>
