import { create } from 'zustand';
import  walletStore  from './walletStore';
import  otherStore  from './otherStore';

const useStore = create((...a) => ({
  ...walletStore(...a),
  ...otherStore(...a),
}));

export default useStore;
