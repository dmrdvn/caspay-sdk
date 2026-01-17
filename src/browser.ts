import CasPay from './index';

if (typeof window !== 'undefined') {
  (window as any).CasPay = CasPay;
}

export default CasPay;
