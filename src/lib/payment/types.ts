export interface CreateOrderResult {
  orderId: string
  providerOrderId: string
  paymentUrl?: string
  qrCode?: string
  amount: number
  currency: string
}

export interface VerifyPaymentResult {
  success: boolean
  orderId: string
  providerOrderId: string
  paidAt?: Date
  failureReason?: string
}

export interface WebhookEvent {
  rawBody: string
  signature?: string
  headers: Record<string, string>
}

export interface ParsedWebhookEvent {
  eventType: string
  providerOrderId: string
  amount: number
  paidAt?: Date
  metadata?: Record<string, string>
}

export interface PaymentProvider {
  readonly name: string

  createOrder(params: {
    orderId: string
    amount: number
    currency: string
    description: string
    userId: string
    metadata?: Record<string, string>
  }): Promise<CreateOrderResult>

  verifyPayment(params: {
    providerOrderId: string
  }): Promise<VerifyPaymentResult>

  parseWebhook(event: WebhookEvent): Promise<ParsedWebhookEvent>

  buildWebhookResponse(parsed: ParsedWebhookEvent): {
    status: number
    body: unknown
  }
}
