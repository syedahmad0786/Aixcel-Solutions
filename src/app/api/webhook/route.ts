import { NextRequest, NextResponse } from "next/server";

// Generic webhook receiver endpoint for n8n and other automation tools
// n8n can send data to this endpoint to trigger actions on the website
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate webhook secret if configured
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = request.headers.get("x-webhook-secret");
      if (authHeader !== webhookSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Process webhook payload based on type
    const { type, data } = body;

    switch (type) {
      case "notification":
        // Handle notification from n8n
        console.log("Notification received:", data);
        break;

      case "content_update":
        // Handle content updates from CMS via n8n
        console.log("Content update received:", data);
        break;

      case "analytics":
        // Handle analytics events from n8n
        console.log("Analytics event received:", data);
        break;

      default:
        console.log("Generic webhook received:", body);
    }

    return NextResponse.json({
      success: true,
      received: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check for webhook endpoint
export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "/api/webhook",
    methods: ["POST"],
    description: "Webhook receiver for n8n and automation integrations",
  });
}
