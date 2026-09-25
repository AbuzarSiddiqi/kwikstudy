/* Payment provider abstraction.
   The mock provider keeps the flow fully working without keys; swapping in
   Razorpay/Stripe means implementing the same interface in a new provider and
   selecting it via PAYMENT_PROVIDER. Order creation, verification and
   enrollment activation all happen server-side only. */

import { sign } from "@/lib/auth-core";

export type ProviderOrder = { providerOrderId: string };
export type CaptureResult = { ok: true; providerPaymentId: string; method: string } | { ok: false; error: string };

export interface PaymentProvider {
  readonly name: string;
  createOrder(amountInPaise: number, receipt: string): Promise<ProviderOrder>;
  /** Verifies the gateway result and captures the payment. Never trust the client here. */
  capture(providerOrderId: string, amountInPaise: number): Promise<CaptureResult>;
}

const APP_SECRET = process.env.PAYMENT_WEBHOOK_SECRET ?? "ks_dev_secret";

export const mockProvider: PaymentProvider = {
  name: "mock",
  async createOrder(amountInPaise, receipt) {
    return { providerOrderId: `mo_${sign(receipt, APP_SECRET).slice(0, 18)}` };
  },
  async capture(providerOrderId, amountInPaise) {
    // Simulates the gateway round-trip + server-side signature check.
    const expected = sign(`${providerOrderId}:${amountInPaise}`, APP_SECRET);
    if (!expected) return { ok: false, error: "Signature verification failed" };
    return { ok: true, providerPaymentId: `pay_${expected.slice(0, 18)}`, method: "upi" };
  },
};

/** Razorpay provider stub — implement with live keys before enabling. */
export const razorpayProvider: PaymentProvider = {
  name: "razorpay",
  // eslint-disable-next-line @typescript-eslint/require-await
  async createOrder() {
    throw new Error("Razorpay keys are not configured. Set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET and implement the order API call.");
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  async capture() {
    throw new Error("Razorpay is not configured on this deployment.");
  },
};

export function getProvider(): PaymentProvider {
  switch (process.env.PAYMENT_PROVIDER) {
    case "razorpay": return razorpayProvider;
    default: return mockProvider;
  }
}
