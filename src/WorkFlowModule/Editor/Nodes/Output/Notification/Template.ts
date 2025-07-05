import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const notificationTemplate: NodeTemplate = {
  id: "notification",
  type: "notification",
  name: "Notification",
  description: "Send notifications via multiple channels (email, SMS, push, etc.)",
  category: "output",
  icon: "🔔",
  inputs: [
    { name: "message", type: "text", required: true, description: "Notification message" },
    { name: "data", type: "any", description: "Additional data to include" },
  ],
  outputs: [
    { name: "sent", type: "boolean", description: "Whether notification was sent successfully" },
    { name: "notification_id", type: "text", description: "Unique notification ID" },
    { name: "channels_sent", type: "any", description: "List of channels where notification was sent" },
  ],
  config: {
    notification_type: "info", // info, warning, error, success
    title: "Workflow Notification",
    priority: "normal", // low, normal, high, urgent
    channels: ["email"], // email, sms, push, slack, discord, teams
  },
};

