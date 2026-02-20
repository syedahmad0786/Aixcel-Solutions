import { NextRequest, NextResponse } from "next/server";

// Chat endpoint - can be connected to any AI provider via n8n or directly
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // If n8n chat webhook is configured, forward the message
    const n8nChatUrl = process.env.N8N_CHAT_WEBHOOK_URL;
    if (n8nChatUrl) {
      try {
        const response = await fetch(n8nChatUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            timestamp: new Date().toISOString(),
            source: "aixcel-chatbot",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({ reply: data.reply || data.message || data.response });
        }
      } catch (err) {
        console.error("n8n chat webhook failed:", err);
      }
    }

    // Fallback: intelligent local response matching
    const reply = getLocalResponse(message);

    // Also forward to webhook for logging/analytics if configured
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "aixcel-chatbot",
          type: "chat_message",
          timestamp: new Date().toISOString(),
          data: { userMessage: message, botReply: reply },
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getLocalResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("price") || lower.includes("cost") || lower.includes("pricing"))
    return "Our pricing is customized based on scope and complexity. Workflow automation starts from $800, AI agents from $1,000, and comprehensive enterprise solutions from $9,000+. Would you like to schedule a call to discuss your specific needs and get a tailored quote?";

  if (lower.includes("service") || lower.includes("offer"))
    return "We offer 6 core services: AI Agents & Copilots, Workflow Automation (using n8n, Make, and custom integrations), Data Intelligence & Analytics, Strategic AI Consulting, Custom AI Platforms, and AI Governance & Compliance. Each solution is tailored to your specific business needs.";

  if (lower.includes("ai agent") || lower.includes("agent"))
    return "Our AI agents handle real business operations autonomously — processing documents, managing client requests, generating reports, and making data-driven decisions. They integrate with your existing tools and typically deliver 15x faster processing. Would you like to discuss how AI agents could benefit your organization?";

  if (lower.includes("automat"))
    return "Our workflow automation uses n8n, Make, and custom integrations to unify fragmented processes. We connect your CRM, finance, and operations tools into seamless pipelines — saving 500+ hours per year and reducing errors by up to 90%.";

  if (lower.includes("consult") || lower.includes("book") || lower.includes("call") || lower.includes("schedule"))
    return "I'd love to help you schedule a consultation! You can fill out the contact form on this page, or email us at hello@aixcel.solutions. We offer a free 30-minute discovery call to understand your needs and identify high-impact opportunities.";

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return "Hello! Welcome to Aixcel Solutions. We specialize in AI-powered business intelligence and automation for HNWI, family offices, and leading agencies. How can I help you today?";

  return "Thank you for your message! I can help you learn about our AI services, schedule a consultation, or discuss how automation can transform your business. What would you like to know more about?";
}
