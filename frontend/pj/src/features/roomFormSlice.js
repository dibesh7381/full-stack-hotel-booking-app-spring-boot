import { createSlice } from "@reduxjs/toolkit";

const defaultForm = {
  roomTitle: "",
  hotelName: "",
  roomType: "",
  acType: "",
  country: "",
  state: "",
  city: "",
  fullAddress: "",
  zipCode: "",
  maxGuests: "",
  bedType: "",
  numberOfBeds: "",
  roomSize: "",
  availabilityStatus: "AVAILABLE",
  basePricePerNight: "",
  discountPrice: "",
  cancellationPolicy: "",
  images: [null, null, null],
};

const LS = {
  1: "step1Form",
  2: "step2Form",
  3: "step3Form",
  4: "step4Form",
};

const roomFormSlice = createSlice({
  name: "roomForm",

  initialState: {
    form: defaultForm,
    step: 1,
    editRoomId: null,
    previewImages: [null, null, null],
  },

  reducers: {
    // 📌 Input fields update
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state.form[name] = value;
    },

    // 📌 Step navigation
    setStep: (state, action) => {
      state.step = action.payload;
    },

    // 📌 Save current step to LocalStorage
    saveStepToLS: (state) => {
      const key = LS[state.step];
      localStorage.setItem(key, JSON.stringify(state.form));
    },

    // 📌 Load step from LocalStorage
    loadStepFromLS: (state, action) => {
      const key = LS[action.payload];
      const saved = localStorage.getItem(key);
      if (saved) {
        const data = JSON.parse(saved);
        state.form = data;

        if (action.payload === 4) {
          state.previewImages = data.images || [null, null, null];
        }
      }
    },

    // 📌 Set preview images (for step 4)
    setPreviewImages: (state, action) => {
      state.previewImages = action.payload;
      state.form.images = action.payload;
    },

    // ⭐⭐⭐ IMAGE ADD REDUCER ⭐⭐⭐
    addImage: (state, action) => {
      const { index, base64 } = action.payload;
      state.previewImages[index] = base64;
      state.form.images[index] = base64;

      // save image to LS (step 4)
      localStorage.setItem(
        LS[4],
        JSON.stringify({ ...state.form, images: state.form.images })
      );
    },

    // ⭐⭐⭐ IMAGE REMOVE REDUCER ⭐⭐⭐
    removeImageAt: (state, action) => {
      const index = action.payload;
      state.previewImages[index] = null;
      state.form.images[index] = null;

      // save image removal to LS
      localStorage.setItem(
        LS[4],
        JSON.stringify({ ...state.form, images: state.form.images })
      );
    },

    // 📌 Edit button → load full form
    setEditMode: (state, action) => {
      const room = action.payload;

      state.editRoomId = room.id;

      const imgs = [
        room.images?.[0] || null,
        room.images?.[1] || null,
        room.images?.[2] || null,
      ];

      const filled = { ...room, images: imgs };

      state.form = filled;
      state.previewImages = imgs;

      Object.values(LS).forEach((k) =>
        localStorage.setItem(k, JSON.stringify(filled))
      );

      state.step = 1;
    },

    // 📌 Reset everything
    resetForm: (state) => {
      state.form = defaultForm;
      state.previewImages = [null, null, null];
      state.editRoomId = null;

      Object.values(LS).forEach((k) => localStorage.removeItem(k));
    },
  },
});

export const {
  updateField,
  setStep,
  saveStepToLS,
  loadStepFromLS,
  setPreviewImages,
  addImage,
  removeImageAt,
  setEditMode,
  resetForm,
} = roomFormSlice.actions;

export default roomFormSlice.reducer;

