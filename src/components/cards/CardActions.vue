<template>
  <div class="card-actions" :class="{ 'mobile-layout': mobileLayout }">
    <div v-if="mobileLayout" class="actions-grid">
      <div
        v-for="action in cardActions"
        :key="action.id"
        class="action-item mobile-action"
        :class="{ 'disabled': action.disabled }"
        @click="handleActionClick(action.id)"
      >
        <SvgIcon 
          :name="action.svgIcon" 
          category="actions" 
          size="xl" 
          class="action-svg-icon"
        />
        <span class="action-label">{{ action.label }}</span>
      </div>
    </div>

    <div v-else class="row justify-between items-start full-width">
      <div
        v-for="action in cardActions"
        :key="action.id"
        class="action-item desktop-action"
        :class="{ 'disabled': action.disabled }"
        @click="handleActionClick(action.id)"
      >
        <SvgIcon 
          :name="action.svgIcon" 
          category="actions" 
          size="xxl" 
          class="action-svg-icon desktop-icon"
        />
        <span class="action-label text-center">{{ action.labelDesktop }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DebitCard, CardAction } from '@/types';
import SvgIcon from '@/components/ui/SvgIcon.vue';

interface ActionConfig {
  id: CardAction;
  icon: string;
  svgIcon: string;
  label: string;
  labelDesktop: string;
  iconClass: string;
  disabled?: boolean;
}

interface Props {
  card: DebitCard | null;
  loading?: boolean;
  mobileLayout?: boolean;
}

interface Emits {
  (e: 'action-clicked', action: CardAction, cardId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  mobileLayout: false
});

const emit = defineEmits<Emits>();

const cardActions = computed((): ActionConfig[] => {
  const isFrozen = props.card?.isFrozen || false;
  
  return [
    {
      id: 'freeze',
      icon: isFrozen ? 'play_arrow' : 'ac_unit',
      svgIcon: 'freeze',
      label: isFrozen ? 'Unfreeze card' : 'Freeze card',
      labelDesktop: isFrozen ? 'Unfreeze\ncard' : 'Freeze\ncard',
      iconClass: 'freeze',
      disabled: !props.card || props.loading
    },
    {
      id: 'set-limit',
      icon: 'trending_up',
      svgIcon: 'set-limit',
      label: 'Set spend limit',
      labelDesktop: 'Set spend\nlimit',
      iconClass: 'spend',
      disabled: !props.card || props.loading
    },
    {
      id: 'add-gpay',
      icon: 'account_balance_wallet',
      svgIcon: 'add-gpay',
      label: 'Add to GPay',
      labelDesktop: 'Add to\nGPay',
      iconClass: 'gpay',
      disabled: !props.card || props.loading
    },
    {
      id: 'replace',
      icon: 'refresh',
      svgIcon: 'replace',
      label: 'Replace card',
      labelDesktop: 'Replace\ncard',
      iconClass: 'replace',
      disabled: !props.card || props.loading
    },
    {
      id: 'cancel',
      icon: 'delete_outline',
      svgIcon: 'cancel',
      label: 'Cancel card',
      labelDesktop: 'Cancel\ncard',
      iconClass: 'cancel',
      disabled: !props.card || props.loading
    }
  ];
});

const handleActionClick = (actionId: CardAction) => {
  if (!props.card || props.loading) return;
  
  emit('action-clicked', actionId, props.card.id);
};
</script>

<style scoped lang="scss">
@import '@/styles/utilities.scss';

.card-actions {
  width: 100%;

  &.mobile-layout {
    .actions-grid {
      @include action-grid;
      
      .mobile-action {
        @include mobile-action-item;
        
        .action-svg-icon {
          width: 32px !important;
          height: 32px !important;
          cursor: pointer;
          transition: transform 0.2s ease;
          
          &:hover {
            transform: scale(1.1);
          }
        }
        
        .action-label {
          font-size: 0.65rem;
          font-weight: 500;
          color: var(--text-primary);
          text-align: center;
          line-height: 1.2;
          word-break: break-word;
        }
      }
    }
  }

  &:not(.mobile-layout) {
    padding: var(--spacing-lg);
    background: #EDF3FF;
    border-radius: 12px;
    width: 100%;

    .row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      flex-wrap: nowrap;
    }

    .desktop-action {
      @include desktop-action-item;
      
      .action-svg-icon {
        cursor: pointer;
        transition: transform 0.2s ease;
        
        &.desktop-icon {
          width: 48px !important;
          height: 48px !important;
        }
        
        &:hover {
          transform: scale(1.1);
        }
      }

      .action-label {
        font-size: 0.75rem;
        line-height: 1.2;
        color: var(--text-primary);
        font-weight: 500;
        white-space: pre-line;
        max-width: 70px;
        word-wrap: break-word;
        text-align: center;
      }

      &.disabled .action-label {
        color: var(--text-muted);
      }
    }
  }
}

@media (max-width: 480px) {
  .card-actions.mobile-layout {
    .actions-grid {
      gap: clamp(4px, 1.5vw, 8px);
      padding: 0 2px;
      
      .mobile-action {
        padding: clamp(6px, 1.5vw, 10px);
        min-height: clamp(55px, 12vw, 70px);
        
        .action-svg-icon {
          width: clamp(20px, 5vw, 28px) !important;
          height: clamp(20px, 5vw, 28px) !important;
        }
        
        .action-label {
          font-size: clamp(0.55rem, 1.5vw, 0.65rem);
        }
      }
    }
  }
}

@media (max-width: 360px) {
  .card-actions.mobile-layout {
    .actions-grid {
      gap: clamp(2px, 1vw, 6px);
      padding: 0 1px;
      
      .mobile-action {
        padding: clamp(4px, 1vw, 8px);
        min-height: clamp(50px, 10vw, 60px);
        
        .action-svg-icon {
          width: clamp(18px, 4vw, 24px) !important;
          height: clamp(18px, 4vw, 24px) !important;
        }
        
        .action-label {
          font-size: clamp(0.5rem, 1.2vw, 0.6rem);
          line-height: 1.1;
        }
      }
    }
  }
}
</style>
