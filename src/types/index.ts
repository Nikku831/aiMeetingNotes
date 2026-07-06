export type Plan = 'free' | 'pro';

export interface Profile {
  id: string;
  plan: Plan;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  created_at: string;
}

export interface ActionItem {
  task: string;
  owner?: string;
  due?: string;
}

export interface MeetingNote {
  id: string;
  user_id: string;
  transcript_text: string;
  summary: string;
  action_items: ActionItem[];
  created_at: string;
}

export interface UsageCounter {
  user_id: string;
  usage_date: string;
  count: number;
}

export interface GenerateResult {
  summary: string;
  action_items: ActionItem[];
}
