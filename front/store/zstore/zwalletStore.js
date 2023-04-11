import { create } from 'zustand';

const walletStore = create((set) => ({
  provider: null,
  signer: null,
//  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//  removeAllBears: () => set({ bears: 0 }),
    setProvider: (newProvider) => set( (s) => ({ provider: newProvider })),
    setSigner: (newSigner) => set( (s) => ({ signer: newSigner }))

}));

export default walletStore;