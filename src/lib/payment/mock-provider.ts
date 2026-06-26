import { randomUUID } from "crypto"
import type {
  PaymentProvider,
  CreateOrderResult,
  VerifyPaymentResult,
  ParsedWebhookEvent,
  WebhookEvent,
} from "./types"

export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock"

  private orders = new Map<
    string,
    { status: "pending" | "paid"; paidAt?: Date }
  >()

  async createOrder(params: {
    orderId: string
    amount: number
    currency: string
    description: string
    userId: string
  }): Promise<CreateOrderResult> {
    const providerOrderId = `mock_${randomUUID()}`
    this.orders.set(providerOrderId, { status: "pending" })

    return {
      orderId: params.orderId,
      providerOrderId,
      paymentUrl: `/payment/mock?providerOrderId=${providerOrderId}&orderId=${params.orderId}`,
      amount: params.amount,
      currency: params.currency,
    }
  }

  async verifyPayment(params: {
    providerOrderId: string
  }): Promise<VerifyPaymentResult> {
    const order = this.orders.get(params.providerOrderId)
    if (!order) {
      return {
        success: false,
        orderId: "",
        providerOrderId: params.providerOrderId,
        failureReason: "订单不存在",
      }
    }
    return {
      success: order.status === "paid",
      orderId: params.providerOrderId,
      providerOrderId: params.providerOrderId,
      paidAt: order.paidAt,
    }
  }

  async parseWebhook(event: WebhookEvent): Promise<ParsedWebhookEvent> {
    const body = JSON.parse(event.rawBody)
    return {
      eventType: body.eventType ?? "payment.success",
      providerOrderId: body.providerOrderId,
      amount: body.amount ?? 0,
      paidAt: new Date(),
      metadata: body.metadata,
    }
  }

  buildWebhookResponse(_parsed: ParsedWebhookEvent): {
    status: number
    body: unknown
  } {
    return { status: 200, body: { received: true } }
  }

  markPaid(providerOrderId: string) {
    this.orders.set(providerOrderId, { status: "paid", paidAt: new Date() })
  }

  markPending(providerOrderId: string) {
    this.orders.set(providerOrderId, { status: "pending" })
  }
}
