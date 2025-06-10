<template>
  <q-dialog
    v-model="isOpen"
    persistent
    maximized-mobile
    class="add-card-modal"
  >
    <q-card class="modal-card">
      <q-card-section class="modal-header">
        <div class="row justify-between items-start q-mb-sm">
          <h3 class="modal-title q-ma-none">Add New Card</h3>
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="closeModal"
            class="close-btn"
          />
        </div>
        <p class="modal-subtitle q-ma-none">
          Enter the card holder's name. Card number and expiry will be generated automatically.
        </p>
      </q-card-section>

      <q-card-section class="modal-content q-pa-lg">
        <q-form @submit="handleSubmit" class="card-form">
          <div class="q-mb-lg">
            <q-input
              v-model="formData.name"
              label="Card Holder Name"
              outlined
              :error="!!errors.name"
              :error-message="errors.name"
              :loading="loading"
              autofocus
              maxlength="50"
              class="name-input"
              @update:modelValue="validateName"
              @input="clearNameError"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
          </div>

          <div class="q-mt-none">
            <div class="preview-container">
              <DebitCard
                :card-preview="{ name: formData.name.trim() }"
                :preview-mode="true"
                class="modal-card-preview"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions class="row justify-between q-pa-lg">
        <q-btn
          flat
          label="Cancel"
          @click="closeModal"
          :disable="loading"
          class="cancel-btn"
        />
        <q-btn
          unelevated
          label="Add Card"
          color="secondary"
          :loading="loading"
          :disable="!isFormValid"
          @click="handleSubmit"
          class="submit-btn q-px-lg"
        >
          <q-icon name="add" class="q-mr-sm" />
        </q-btn>
      </q-card-actions>

      <q-inner-loading :showing="loading">
        <q-spinner-dots size="40px" color="secondary" />
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { validateRequired, validateMinLength, validateMaxLength, combineValidationResults } from '@/utils/validation';
import { validateCardName } from '@/utils/cardGenerator';
import type { CardFormData } from '@/types';
import DebitCard from '@/components/cards/DebitCard.vue';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'card-added', cardData: CardFormData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formData = ref<CardFormData>({
  name: ''
});

const errors = ref({
  name: ''
});

const loading = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
});

const isFormValid = computed(() => {
  return formData.value.name.trim().length >= 2 && !errors.value.name;
});

watch(isOpen, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

const resetForm = () => {
  formData.value = { name: '' };
  errors.value = { name: '' };
  loading.value = false;
};

const validateName = () => {
  console.log('update detected')
  const name = formData.value.name.trim();
  
  const requiredResult = validateRequired(name, 'Card holder name');
  const minLengthResult = validateMinLength(name, 2, 'Card holder name');
  const maxLengthResult = validateMaxLength(name, 20, 'Card holder name');
  const cardNameResult = validateCardName(name);
  
  const combinedResult = combineValidationResults(
    requiredResult,
    minLengthResult,
    maxLengthResult,
    cardNameResult
  );
  console.log('combinedResult: ', combinedResult)
  errors.value.name = combinedResult.error || '';
};

const clearNameError = () => {
  if (errors.value.name) {
    errors.value.name = '';
  }
};

const handleSubmit = async () => {
  validateName();
  if (!isFormValid.value) {
    return;
  }
  loading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    emit('card-added', {
      name: formData.value.name.trim()
    });
    
  } catch (error) {

  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  if (!loading.value) {
    isOpen.value = false;
    nextTick(() => {
      resetForm();
    });
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/utilities.scss';

.add-card-modal {
  .modal-card {
    @include modal-container;
  }

  .modal-header {
    @include modal-header;

    .close-btn {
      margin: -8px;
    }
  }

  .name-input {
    @include form-input-enhanced;
  }

  .preview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0 var(--spacing-md);
    
    :deep(.modal-card-preview) {
      width: 100%;
      
      .debit-card-wrapper {
        max-width: 100%;
      }
      
      .debit-card .card-container {
        transform: scale(0.9);
        transform-origin: center;
      }
    }
  }

  .cancel-btn {
    color: var(--text-secondary);
  }

  .submit-btn {
    font-weight: 500;
  }
}

@include mobile-only {
  .add-card-modal {
    .modal-card {
      margin: 0;
      height: 100vh;
      max-width: 100%;
      border-radius: 0;
    }

    .preview-container {
      padding: 0;
      
      :deep(.modal-card-preview) {
        max-width: 300px;
        
        .debit-card .card-container {
          transform: scale(0.85);
        }
      }
    }
  }
}
</style>
