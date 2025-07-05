export interface NotificationConfig {
  notification_type: string;
  title: string;
  priority: string;
  channels: string[];
}

export interface NotificationInputs {
  message: string;
  data?: any;
}

export interface NotificationOutputs {
  sent: boolean;
  notification_id: string;
  channels_sent: string[];
}

