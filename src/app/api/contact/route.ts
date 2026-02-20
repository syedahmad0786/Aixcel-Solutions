import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, service, budget, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Forward to n8n webhook if configured
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "aixcel-website",
            type: "contact_form",
            timestamp: new Date().toISOString(),
            data: { name, email, company, service, budget, message },
          }),
        });
      } catch (webhookError) {
        console.error("n8n webhook failed:", webhookError);
        // Don't fail the request if webhook fails
      }
    }

    // Forward to generic webhook if configured
    const genericWebhookUrl = process.env.WEBHOOK_URL;
    if (genericWebhookUrl) {
      try {
        await fetch(genericWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "aixcel-website",
            type: "contact_form",
            timestamp: new Date().toISOString(),
            data: { name, email, company, service, budget, message },
          }),
        });
      } catch (webhookError) {
        console.error("Generic webhook failed:", webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your inquiry. We'll be in touch within 24 hours.",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
