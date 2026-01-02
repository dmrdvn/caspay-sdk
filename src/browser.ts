/**
 * Browser bundle entry point
 * Exposes CasPay SDK to window.CasPay for script tag usage
 * 
 * @example
 * ```html
 * <script src="https://cdn.jsdelivr.net/npm/@caspay/sdk/dist/caspay.min.js"></script>
 * <script>
 *   const caspay = new CasPay({
 *     apiKey: 'cp_live_...',
 *     merchantId: 'MERCH_...'
 *   });
 * </script>
 * ```
 */
import CasPay from './index';

// Expose to window for <script> tag usage
if (typeof window !== 'undefined') {
  (window as any).CasPay = CasPay;
}

export default CasPay;
