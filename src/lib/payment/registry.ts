import type { PaymentProvider } from "./types"
import { MockPaymentProvider } from "./mock-provider"

// 单例 store，保证跨请求共享同一个 mock 实例（开发环境）
const globalForPayment = globalThis as unknown as {
  paymentProviders: Map<string, PaymentProvider>
  defaultProvider: PaymentProvider | undefined
}

if (!globalForPayment.paymentProviders) {
  globalForPayment.paymentProviders = new Map()
  globalForPayment.paymentProviders.set(
    "mock",
    new MockPaymentProvider()
  )
}

export function registerProvider(name: string, provider: PaymentProvider) {
  globalForPayment.paymentProviders!.set(name, provider)
}

export function getProvider(name?: string): PaymentProvider {
  const providerName =
    name ?? process.env.PAYMENT_PROVIDER ?? "mock"
  const provider = globalForPayment.paymentProviders!.get(providerName)
  if (!provider) {
    throw new Error(`支付提供者 "${providerName}" 未注册`)
  }
  return provider
}

export function getMockProvider(): MockPaymentProvider {
  return getProvider("mock") as MockPaymentProvider
}
