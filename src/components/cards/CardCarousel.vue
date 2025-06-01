<template>
  <div class="card-carousel">
    <!-- Carousel Container -->
    <q-carousel
      v-model="currentSlide"
      animated
      swipeable
      arrows
      infinite
      :autoplay="false"
      height="auto"
      class="card-slider"
      transition-prev="slide-right"
      transition-next="slide-left"
      :transition-duration="400"
      @update:model-value="onSlideChange"
      @before-transition="onBeforeTransition"
      @transition="onTransition"
    >
      <q-carousel-slide
        v-for="(card, index) in cards"
        :key="card.id"
        :name="index"
        class="carousel-slide"
      >
        <div class="slide-content column items-center justify-center q-pa-sm" :class="{ 'transitioning': isTransitioning }">
          <DebitCardComponent
            :card="card"
            :show-toggle-button="showToggleButton"
            @toggle-card-number="$emit('toggle-card-number')"
            :class="{ 'card-transitioning': isTransitioning }"
          />
        </div>
      </q-carousel-slide>
    </q-carousel>

    <!-- Card Pagination -->
    <div class="row justify-center items-center q-gutter-sm q-mt-md" v-if="cards.length > 1">
      <div
        v-for="(card, index) in cards" 
        :key="card.id"
        class="pagination-dot"
        :class="{ 'active': index === currentSlide }"
        @click="goToSlide(index)"
        :aria-label="`Go to card ${index + 1}`"
      ></div>
    </div>

    <!-- Empty State -->
    <div v-if="cards.length === 0" class="column items-center justify-center text-center q-pa-xl empty-state">
      <q-icon name="credit_card_off" size="xl" color="grey-4" />
      <div class="text-h6 q-mt-lg q-mb-sm text-weight-medium">No Cards Available</div>
      <p class="text-body2 text-grey-6 q-mb-xl empty-description">
        Add your first card to get started with Aspire
      </p>
      <q-btn
        color="secondary"
        unelevated
        rounded
        @click="$emit('add-card')"
        class="q-px-lg"
      >
        <q-icon name="add" class="q-mr-sm" />
        Add Your First Card
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { DebitCard } from '@/types';
import DebitCardComponent from './DebitCard.vue';

interface Props {
  cards: DebitCard[];
  selectedCardId?: string | null;
  showToggleButton?: boolean;
}

interface Emits {
  (e: 'card-selected', cardId: string): void;
  (e: 'add-card'): void;
  (e: 'toggle-card-number'): void;
}

const props = withDefaults(defineProps<Props>(), {
  selectedCardId: null,
  showToggleButton: false
});

const emit = defineEmits<Emits>();

// Reactive state
const currentSlide = ref(0);
const isTransitioning = ref(false);


watch(() => props.selectedCardId, (newCardId) => {
  if (newCardId) {
    const cardIndex = props.cards.findIndex(card => card.id === newCardId);
    if (cardIndex !== -1 && cardIndex !== currentSlide.value) {
      currentSlide.value = cardIndex;
    }
  }
});


if (props.selectedCardId) {
  const initialIndex = props.cards.findIndex(card => card.id === props.selectedCardId);
  if (initialIndex !== -1) {
    currentSlide.value = initialIndex;
  }
}


const onSlideChange = (slideIndex: string | number) => {
  const index = typeof slideIndex === 'string' ? parseInt(slideIndex) : slideIndex;
  currentSlide.value = index;
  if (props.cards[index]) {
    emit('card-selected', props.cards[index].id);
  }
};

const goToSlide = (slideIndex: number) => {
  currentSlide.value = slideIndex;
  if (props.cards[slideIndex]) {
    emit('card-selected', props.cards[slideIndex].id);
  }
};


const onBeforeTransition = () => {
  isTransitioning.value = true;
};

const onTransition = () => {
  isTransitioning.value = false;
};


const getCurrentCard = () => {
  return props.cards[currentSlide.value] || null;
};

defineExpose({
  getCurrentCard,
  goToCard: (cardId: string) => {
    const index = props.cards.findIndex(card => card.id === cardId);
    if (index !== -1) {
      currentSlide.value = index;
    }
  }
});
</script>

<style scoped lang="scss">
@import '@/styles/utilities.scss';

.card-carousel {
  width: 100%;
  max-width: 100%;
  background: transparent !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @include carousel-enhancements;
  @include slide-transitions;
  
  .card-slider {
    :deep(.q-carousel__slide) {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .carousel-slide {
      .slide-content {
        width: 100%;
        min-height: 200px;
        padding: var(--spacing-sm);
        display: flex;
        align-items: center;
        justify-content: center;
        
        > * {
          width: 100%;
          max-width: 100%;
        }
        
        &.transitioning {
          .debit-card {
            transform: scale(0.95);
            opacity: 0.9;
          }
        }
        
        :deep(.card-transitioning) {
          .debit-card {
            @include slide-transition;
          }
        }
      }
    }

    :deep(.q-carousel__navigation) {
      display: none;
    }

    :deep(.q-carousel__arrow) {
      display: none;
    }
  }

  .pagination-dot {
    @include pagination-dot-base;
    @include pagination-dot-hover;

    &.active {
      @include pagination-dot-active;
    }
  }

  .empty-state {
    min-height: 300px;

    .empty-description {
      max-width: 300px;
      line-height: 1.5;
    }
  }
}

// Responsive adjustments
@include mobile-only {
  .card-carousel {
    background: transparent !important;
    
    .card-slider {
      background: transparent !important;
      
      .carousel-slide {
        background: transparent !important;
        
        .slide-content {
          min-height: 200px;
          padding: var(--spacing-xs);
          background: transparent !important;
        }
      }
    }
  }
}

@media (min-width: 376px) and (max-width: 480px) {
  .card-carousel .card-slider .carousel-slide .slide-content {
    min-height: 220px;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .card-carousel {
    .card-slider .carousel-slide .slide-content {
      min-height: 260px;
    }
    
    .pagination-dot {
      width: 10px;
      height: 10px;
    }
  }
}

@include desktop-only {
  .card-carousel {
    .card-slider .carousel-slide .slide-content {
      min-height: 300px;
    }
    
    .pagination-dot {
      width: 10px;
      height: 10px;
    }
  }
}

@include touch-device {
  .card-carousel {
    :deep(.q-carousel) {
      .q-carousel__slides-container {
        touch-action: pan-x pinch-zoom;
      }
    }
    
    .pagination-dot {
      width: 12px;
      height: 12px;
      
      &:hover {
        transform: none;
      }
      
      &.active {
        transform: scale(1.2);
        box-shadow: 0 2px 12px rgba(16, 185, 129, 0.4);
      }
    }
  }
}
</style>
