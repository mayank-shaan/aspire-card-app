<template>
  <img 
    v-if="svgPath"
    :src="svgPath" 
    :alt="name"
    class="svg-icon" 
    :class="iconClasses"
    :style="customStyles"
  />
  <span v-else class="svg-icon fallback" :class="iconClasses">
    {{ name }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string;
  category?: 'brand' | 'navigation' | 'actions' | 'transactions' | 'ui';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'| 'app-bar' | 'debit-card' | 'mobile-debit-card' | 'visa-logo' | 'mobile-visa-logo';
  color?: string;
  width?: string | number;
  height?: string | number;
  active?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  category: 'ui'
});

const normalizedName = computed(() => {
  const nameMap: Record<string, string> = {

    'aspire-logo': 'Aspire Logo',
    'aspire-logo-white': 'Aspire Logo white',
    'aspire-logo-alt': 'Aspire Logo-1',
    'visa': 'Visa Logo',

    'home': 'Home',
    'cards': 'Card',
    'card': 'Card',
    'payments': 'Payments',
    'credit': 'Credit', 
    'settings': 'Settings',

    'freeze': 'Freeze card',
    'add-gpay': 'Add Gpay',
    'cancel': 'Cancel Card',
    'replace': 'Replace',
    'set-limit': 'Set Limit',

    'card-details': 'card details',
    'file-storage': 'file-storage',
    'flights': 'flights',
    'plane': 'flights',
    'megaphone': 'megaphone',
    'recent-transactions': 'recent transactions',

    'eye': 'remove_red_eye-24px',
    'show-eye': 'remove_red_eye-24px',
    'down-arrow': 'down-arrow',
    'up-arrow': 'up-arrow',
    'right': 'right',
    'plus': 'plus'
  };
  
  return nameMap[props.name.toLowerCase()] || props.name;
});

const svgPath = computed(() => {
  try {
    return new URL(`/src/assets/icons/${props.category}/${normalizedName.value}.svg`, import.meta.url).href;
  } catch (error) {

    return null;
  }
});

const iconClasses = computed(() => [
  `svg-icon--${props.size}`,
  { [`svg-icon--${props.color}`]: props.color },
  { 'svg-icon--active': props.active }
]);

const customStyles = computed(() => {
  const styles: Record<string, string> = {};
  
  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
  }
  
  if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  }
  
  if (props.category === 'navigation') {
    if (props.active) {
      styles.filter = 'brightness(0) saturate(100%) invert(74%) sepia(60%) saturate(427%) hue-rotate(98deg) brightness(94%) contrast(90%)';
    }
  } else if (props.color && !props.color.startsWith('--')) {
    styles.filter = `brightness(0) saturate(100%) ${getColorFilter(props.color)}`;
  }
  
  return styles;
});

const getColorFilter = (color: string) => {
  const colorMap: Record<string, string> = {
    'white': 'invert(1)',
    'secondary': 'invert(74%) sepia(60%) saturate(427%) hue-rotate(98deg) brightness(94%) contrast(90%)',
    'teal': 'invert(74%) sepia(60%) saturate(427%) hue-rotate(98deg) brightness(94%) contrast(90%)',
    'gray': 'invert(62%) sepia(4%) saturate(872%) hue-rotate(202deg) brightness(99%) contrast(85%)',
    'black': 'invert(0)'
  };
  
  return colorMap[color] || '';
};

defineOptions({
  name: 'SvgIcon'
});
</script>

<style scoped lang="scss">
.svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  object-fit: contain;
  transition: filter 0.2s ease;
  

  &--xs { width: 12px; height: 12px; }
  &--sm { width: 16px; height: 16px; }
  &--md { width: 20px; height: 20px; }
  &--lg { width: 24px; height: 24px; }
  &--xl { width: 32px; height: 32px; }
  &--xxl { width: 84px; height: 32px; }
  &--app-bar { width: 125px; height: 35px; }
  &--debit-card { width: 83.5px; height: 23.7px; }
  &--mobile-debit-card { width: 74px; height: 21px; }
  &--visa-logo { width: 66.59px; height: 22.57px; }
  &--mobile-visa-logo { width: 59px; height: 20px; }
  
  &--active {
    filter: brightness(0) saturate(100%) invert(74%) sepia(60%) saturate(427%) hue-rotate(98deg) brightness(94%) contrast(90%) !important;
  }
  
  &.fallback {
    background: #f0f0f0;
    border-radius: 4px;
    font-size: 8px;
    color: #666;
    text-align: center;
  }
}
</style>
