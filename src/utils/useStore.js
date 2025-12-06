import { create } from "zustand";
// Define the store
const useStore = create((set) => ({
    hospitalCode: "",
    setHospitalCode: (newHospitalCode) => set({ hospitalCode: newHospitalCode }),
}));
export default useStore;
