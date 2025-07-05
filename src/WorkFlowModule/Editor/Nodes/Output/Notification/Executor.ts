import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { NotificationConfig, NotificationInputs, NotificationOutputs } from "./Types";

export async function executeNotification(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as NotificationConfig;
  const message = node.inputs.find(i => i.name === 'message')?.value;
  const data = node.inputs.find(i => i.name === 'data')?.value;

  if (!message) {
    return { success: false, error: "Message is required for notification node" };
  }

  try {
    const notificationType = config.notification_type || 'info';
    const title = config.title || 'Workflow Notification';
    const priority = config.priority || 'normal';
    const channels = config.channels || ['email'];

    // Generate unique notification ID
    const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const channelsSent: string[] = [];
    const failedChannels: string[] = [];

    // Mock notification sending for each channel
    for (const channel of channels) {
      try {
        await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API call

        switch (channel) {
          case 'email':
            // Mock email sending
            console.log(`Email sent: ${title} - ${message}`);
            channelsSent.push('email');
            break;
          case 'sms':
            // Mock SMS sending
            console.log(`SMS sent: ${message}`);
            channelsSent.push('sms');
            break;
          case 'push':
            // Mock push notification
            console.log(`Push notification sent: ${title} - ${message}`);
            channelsSent.push('push');
            break;
          case 'slack':
            // Mock Slack message
            console.log(`Slack message sent: ${title} - ${message}`);
            channelsSent.push('slack');
            break;
          case 'discord':
            // Mock Discord message
            console.log(`Discord message sent: ${title} - ${message}`);
            channelsSent.push('discord');
            break;
          case 'teams':
            // Mock Teams message
            console.log(`Teams message sent: ${title} - ${message}`);
            channelsSent.push('teams');
            break;
          case 'webhook':
            // Mock webhook notification
            console.log(`Webhook notification sent: ${title} - ${message}`);
            channelsSent.push('webhook');
            break;
          default:
            console.log(`Unknown channel: ${channel}`);
            failedChannels.push(channel);
        }
      } catch (error) {
        console.error(`Failed to send notification via ${channel}:`, error);
        failedChannels.push(channel);
      }
    }

    const outputs: NotificationOutputs = {
      sent: channelsSent.length > 0,
      notification_id: notificationId,
      channels_sent: channelsSent,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Notification execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

