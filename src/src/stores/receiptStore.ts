/**
 * Pinia store for receipt form state
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { FormData } from '../types/receipt';
import type { PaymentMode } from '../utils/constants';

export const useReceiptStore = defineStore('receipt', () => {
  // Form state
  const formData = ref<FormData>({
    tenantName: '',
    landlordName: '',
    landlordAddress: '',
    landlordPAN: '',
    rentAmount: null,
    rentalPeriodStart: '',
    rentalPeriodEnd: '',
    paymentDate: '',
    propertyAddress: '',
    paymentMode: 'Cash' as PaymentMode,
  });

  // Validation state
  const isValid = ref(false);
  const errors = ref<Record<string, string>>({});

  // Receipt number (will be generated when saving)
  const receiptNumber = ref<string>('');

  // Computed: Check if form has any data
  const hasData = computed(() => {
    return (
      formData.value.tenantName.trim() !== '' ||
      formData.value.landlordName.trim() !== '' ||
      formData.value.landlordAddress.trim() !== '' ||
      formData.value.landlordPAN.trim() !== '' ||
      (formData.value.rentAmount !== null && formData.value.rentAmount > 0) ||
      formData.value.rentalPeriodStart !== '' ||
      formData.value.rentalPeriodEnd !== '' ||
      formData.value.paymentDate !== '' ||
      formData.value.propertyAddress.trim() !== ''
    );
  });

  // Actions
  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    formData.value[field] = value;
  }

  function setFormData(data: Partial<FormData>) {
    formData.value = {
      ...formData.value,
      ...data,
    };
  }

  function clearForm() {
    formData.value = {
      tenantName: '',
      landlordName: '',
      landlordAddress: '',
      landlordPAN: '',
      rentAmount: null,
      rentalPeriodStart: '',
      rentalPeriodEnd: '',
      paymentDate: '',
      propertyAddress: '',
      paymentMode: 'Cash' as PaymentMode,
    };
    errors.value = {};
    isValid.value = false;
  }

  function setValidation(valid: boolean, fieldErrors: Record<string, string> = {}) {
    isValid.value = valid;
    errors.value = fieldErrors;
  }

  function setReceiptNumber(number: string) {
    receiptNumber.value = number;
  }

  return {
    // State
    formData,
    isValid,
    errors,
    receiptNumber,
    // Computed
    hasData,
    // Actions
    updateField,
    setFormData,
    clearForm,
    setValidation,
    setReceiptNumber,
  };
});
