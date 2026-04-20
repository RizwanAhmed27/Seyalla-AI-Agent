import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Target,
  Wallet,
  Users,
  MessageSquare,
  ShieldCheck,
  Brain,
  BarChart3,
  Database,
  Bot,
  KeyRound,
  Layers3,
  FileText,
  ServerCog,
  Activity,
  UserCog,
  MessagesSquare,
  CheckCircle2,
  XCircle,
  CalendarClock,
  GitCompareArrows,
  ClipboardList,
  Goal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type Employee = {
  id: number;
  firstName: string;
  roleId: number;
  brandId: number;
  storeId: number;
  countryCode: string;
  employeeType: string;
  employeeCode: string;
};

type TargetRow = {
  id: number;
  employeeId: number;
  month: number;
  year: number;
  targetAmount: number;
  salesAmount: number;
  payout: number;
  status: string;
  tierId: number;
  achievementPct: string;
  tierExpression: string;
};

type AttendanceRow = {
  id: number;
  employeeId: number;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  workingHours: number;
};

type ScheduleRow = {
  id: number;
  employeeId: number;
  date: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  status: "Scheduled" | "Off" | "Completed";
  location: string;
};

type LeaveRequest = {
  id: number;
  employeeId: number;
  date: string;
  type: "Annual Leave" | "Medical Leave" | "Shift Swap";
  status: "Draft" | "Pending" | "Approved" | "Rejected";
  reason: string;
  swapWithEmployeeId?: number;
};

type SaleRow = {
  id: number;
  saleDate: string;
  employeeCode: string;
  category: string;
  quantity: number;
  saleAmount: number;
};

type StoreRow = {
  id: number;
  name: string;
  brandId: number;
  countryCode: string;
};

type BrandRow = {
  id: number;
  name: string;
  countryCode: string;
};

type CountryRow = {
  code: string;
  name: string;
};

type AggregateSalesScope = {
  salesAmount: number;
  targetAmount: number;
  achievementPct: number;
  label: string;
};

type TierRow = {
  id: number;
  name: string;
  category: string;
  workFlowJson: string;
  variableDefinition: string;
  isActive: boolean;
};

type ScopeMode = "STAFF" | "ADMIN";
type AdminPersona = "STORE_MANAGER" | "BRAND_MANAGER" | "COUNTRY_MANAGER";
type MascotMood = "warm" | "focused" | "celebrate" | "coach";
type ViewMode = "assistant" | "operations" | "coverage" | "decisions" | "workflow" | "architecture" | "prompts" | "schema" | "analytics" | "implementation";

type AlternativeOption = {
  label: string;
  pros: string[];
  cons: string[];
};

type Message = {
  id: string;
  sender: "user" | "assistant";
  text: string;
  chips?: string[];
  mood?: MascotMood;
  bullets?: string[];
  confidence?: number;
  followUps?: string[];
  alternatives?: AlternativeOption[];
};

type TestResult = {
  name: string;
  pass: boolean;
  details: string;
};

type DecisionOption = {
  label: string;
  score: number;
  reason: string;
};

type AgentReply = {
  mood: MascotMood;
  text: string;
  chips?: string[];
  bullets?: string[];
  confidence?: number;
  followUps?: string[];
  alternatives?: AlternativeOption[];
};

type UserProfileMemory = {
  employeeId: number;
  preferredTone: string;
  recurringGoals: string[];
  preferredFocusAreas: string[];
  recentTopics: string[];
};

type HistoricalInsight = {
  employeeId: number;
  category: "sales_pattern" | "attendance_pattern" | "schedule_pattern" | "engagement_pattern";
  text: string;
  impact: "positive" | "neutral" | "risk";
};

type GoalMode = "maximize_payout" | "hit_target" | "protect_attendance" | "stabilize_schedule";

type CategoryPerformance = {
  category: string;
  salesAmount: number;
  quantity: number;
};

type RequestWorkflowAction = {
  id: string;
  title: string;
  description: string;
  status: "Ready" | "Pending" | "Approved" | "Draft";
  primaryAction: string;
  secondaryAction?: string;
};

type IntentRole = "STAFF" | "ADMIN" | "SHARED";
type IntentReturnType =
  | "summary_card"
  | "breakdown_table"
  | "trend_chart"
  | "watchlist"
  | "approval_queue"
  | "policy_answer"
  | "workflow_form"
  | "recommendation_panel"
  | "alert_banner"
  | "executive_digest";

type IntentDictionaryItem = {
  intent: string;
  role: IntentRole;
  domain: string;
  purpose: string;
  keywords: string[];
  sampleQuestions: string[];
  returnType: IntentReturnType;
  possibleActions: string[];
};

type ExtractedEntities = {
  timePeriod?: string;
  scope?: "me" | "team" | "store" | "brand" | "country";
  storeName?: string;
  brandName?: string;
  metric?: string;
  action?: string;
  valueGoal?: number;
  personName?: string;
  requestType?: string;
};

type ResolvedIntent = {
  masterIntent: string;
  role: IntentRole;
  domain: string;
  returnType: IntentReturnType;
  legacyIntent: string;
  confidence: number;
  entities: ExtractedEntities;
};

const employees: Employee[] = [
  { id: 1, firstName: "Arun", roleId: 101, brandId: 5, storeId: 101, countryCode: "SG", employeeType: "Full-time", employeeCode: "EMP001" },
  { id: 2, firstName: "Priya", roleId: 102, brandId: 5, storeId: 101, countryCode: "SG", employeeType: "Full-time", employeeCode: "EMP002" },
  { id: 3, firstName: "Karthik", roleId: 103, brandId: 7, storeId: 201, countryCode: "MY", employeeType: "Part-time", employeeCode: "EMP003" },
  { id: 4, firstName: "Sneha", roleId: 101, brandId: 5, storeId: 101, countryCode: "SG", employeeType: "Full-time", employeeCode: "EMP004" },
  { id: 5, firstName: "Vikram", roleId: 104, brandId: 8, storeId: 301, countryCode: "MY", employeeType: "Full-time", employeeCode: "EMP005" },
  { id: 6, firstName: "Divya", roleId: 102, brandId: 5, storeId: 101, countryCode: "SG", employeeType: "Intern", employeeCode: "EMP006" },
  { id: 7, firstName: "Ramesh", roleId: 101, brandId: 6, storeId: 102, countryCode: "SG", employeeType: "Full-time", employeeCode: "EMP007" },
  { id: 8, firstName: "Meera", roleId: 103, brandId: 7, storeId: 201, countryCode: "MY", employeeType: "Part-time", employeeCode: "EMP008" },
  { id: 9, firstName: "Sanjay", roleId: 104, brandId: 8, storeId: 301, countryCode: "MY", employeeType: "Full-time", employeeCode: "EMP009" },
  { id: 10, firstName: "Lakshmi", roleId: 102, brandId: 5, storeId: 101, countryCode: "SG", employeeType: "Full-time", employeeCode: "EMP010" },
];

const stores: StoreRow[] = [
  { id: 101, name: "Marina Bay Store", brandId: 5, countryCode: "SG" },
  { id: 102, name: "Orchard Store", brandId: 6, countryCode: "SG" },
  { id: 201, name: "KLCC Store", brandId: 7, countryCode: "MY" },
  { id: 301, name: "Pavilion Store", brandId: 8, countryCode: "MY" },
];

const brands: BrandRow[] = [
  { id: 5, name: "Rolex SG Core", countryCode: "SG" },
  { id: 6, name: "Rolex SG Orchard", countryCode: "SG" },
  { id: 7, name: "Rolex MY KLCC", countryCode: "MY" },
  { id: 8, name: "Rolex MY Pavilion", countryCode: "MY" },
];

const countries: CountryRow[] = [
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
];

const sales: SaleRow[] = [
  { id: 1, saleDate: "2025-03-01", employeeCode: "EMP001", category: "Beverages", quantity: 45, saleAmount: 19200 },
  { id: 2, saleDate: "2025-03-01", employeeCode: "EMP002", category: "Snacks", quantity: 72, saleAmount: 14000 },
  { id: 3, saleDate: "2025-03-02", employeeCode: "EMP004", category: "Meals", quantity: 18, saleAmount: 40000 },
  { id: 4, saleDate: "2025-03-02", employeeCode: "EMP001", category: "Beverages", quantity: 60, saleAmount: 25000 },
  { id: 5, saleDate: "2025-03-03", employeeCode: "EMP005", category: "Desserts", quantity: 25, saleAmount: 55000 },
  { id: 6, saleDate: "2025-03-03", employeeCode: "EMP007", category: "Beverages", quantity: 30, saleAmount: 12500 },
  { id: 7, saleDate: "2025-03-04", employeeCode: "EMP003", category: "Snacks", quantity: 28, saleAmount: 9000 },
  { id: 8, saleDate: "2025-03-04", employeeCode: "EMP008", category: "Meals", quantity: 22, saleAmount: 18500 },
  { id: 9, saleDate: "2025-03-05", employeeCode: "EMP006", category: "Meals", quantity: 33, saleAmount: 26000 },
  { id: 10, saleDate: "2025-03-05", employeeCode: "EMP010", category: "Desserts", quantity: 16, saleAmount: 31500 },
];

const attendance: AttendanceRow[] = [
  { id: 1, employeeId: 1, date: "2025-03-01", checkInTime: "08:45:00", checkOutTime: "17:10:00", workingHours: 8.42 },
  { id: 2, employeeId: 2, date: "2025-03-01", checkInTime: "09:05:00", checkOutTime: "18:30:00", workingHours: 9.42 },
  { id: 3, employeeId: 1, date: "2025-03-02", checkInTime: "08:50:00", checkOutTime: "17:55:00", workingHours: 9.08 },
  { id: 4, employeeId: 4, date: "2025-03-02", checkInTime: "08:30:00", checkOutTime: "16:45:00", workingHours: 8.25 },
  { id: 5, employeeId: 5, date: "2025-03-03", checkInTime: "09:15:00", checkOutTime: "18:00:00", workingHours: 8.75 },
  { id: 6, employeeId: 7, date: "2025-03-03", checkInTime: "09:12:00", checkOutTime: "17:20:00", workingHours: 8.13 },
  { id: 7, employeeId: 3, date: "2025-03-04", checkInTime: "10:00:00", checkOutTime: "16:05:00", workingHours: 6.08 },
  { id: 8, employeeId: 8, date: "2025-03-04", checkInTime: "10:10:00", checkOutTime: "16:10:00", workingHours: 6.0 },
  { id: 9, employeeId: 6, date: "2025-03-05", checkInTime: "09:00:00", checkOutTime: "17:45:00", workingHours: 8.75 },
  { id: 10, employeeId: 10, date: "2025-03-05", checkInTime: "08:40:00", checkOutTime: "17:50:00", workingHours: 9.17 },
];

const schedules: ScheduleRow[] = [
  { id: 1, employeeId: 1, date: "2025-04-21", shiftName: "Opening Shift", startTime: "09:00", endTime: "18:00", status: "Scheduled", location: "Marina Bay Store" },
  { id: 2, employeeId: 1, date: "2025-04-22", shiftName: "Mid Shift", startTime: "11:00", endTime: "20:00", status: "Scheduled", location: "Marina Bay Store" },
  { id: 3, employeeId: 1, date: "2025-04-23", shiftName: "Off Day", startTime: "-", endTime: "-", status: "Off", location: "-" },
  { id: 4, employeeId: 1, date: "2025-04-24", shiftName: "Closing Shift", startTime: "12:00", endTime: "21:00", status: "Scheduled", location: "Marina Bay Store" },
  { id: 5, employeeId: 1, date: "2025-04-25", shiftName: "Mid Shift", startTime: "11:00", endTime: "20:00", status: "Scheduled", location: "Marina Bay Store" },
  { id: 6, employeeId: 1, date: "2025-04-26", shiftName: "Weekend Peak Shift", startTime: "10:00", endTime: "19:00", status: "Scheduled", location: "Marina Bay Store" },
  { id: 7, employeeId: 1, date: "2025-04-27", shiftName: "Off Day", startTime: "-", endTime: "-", status: "Off", location: "-" },
  { id: 8, employeeId: 2, date: "2025-04-21", shiftName: "Closing Shift", startTime: "12:00", endTime: "21:00", status: "Scheduled", location: "Marina Bay Store" },
  { id: 9, employeeId: 4, date: "2025-04-21", shiftName: "Opening Shift", startTime: "09:00", endTime: "18:00", status: "Scheduled", location: "Marina Bay Store" },
  { id: 10, employeeId: 6, date: "2025-04-21", shiftName: "Training Shift", startTime: "10:00", endTime: "17:00", status: "Scheduled", location: "Training Room" },
  { id: 11, employeeId: 8, date: "2025-04-21", shiftName: "Weekend Relief", startTime: "13:00", endTime: "19:00", status: "Scheduled", location: "ION Store" },
  { id: 12, employeeId: 10, date: "2025-04-21", shiftName: "Mid Shift", startTime: "11:00", endTime: "20:00", status: "Scheduled", location: "Marina Bay Store" },
];

const leaveRequests: LeaveRequest[] = [
  { id: 1, employeeId: 1, date: "2025-04-22", type: "Shift Swap", status: "Pending", reason: "Family appointment in the evening", swapWithEmployeeId: 2 },
  { id: 2, employeeId: 1, date: "2025-04-28", type: "Annual Leave", status: "Draft", reason: "Personal errand" },
  { id: 3, employeeId: 6, date: "2025-04-23", type: "Medical Leave", status: "Approved", reason: "Clinic-certified medical rest" },
];

const userProfileMemories: UserProfileMemory[] = [
  {
    employeeId: 1,
    preferredTone: "chatty and practical",
    recurringGoals: ["increase payout", "prepare better for next shift"],
    preferredFocusAreas: ["commission", "attendance", "schedule planning"],
    recentTopics: ["earn more", "next shift", "leave request"],
  },
  {
    employeeId: 2,
    preferredTone: "brief and exact",
    recurringGoals: ["protect target momentum"],
    preferredFocusAreas: ["closing shifts", "weekly roster"],
    recentTopics: ["commission", "team schedule"],
  },
  {
    employeeId: 4,
    preferredTone: "clear and supportive",
    recurringGoals: ["stay consistent", "improve shift planning"],
    preferredFocusAreas: ["attendance", "daily briefing"],
    recentTopics: ["attendance", "today briefing"],
  },
];

const historicalInsights: HistoricalInsight[] = [
  { employeeId: 1, category: "sales_pattern", text: "Historically performs better on opening and weekend peak shifts than on mid shifts.", impact: "positive" },
  { employeeId: 1, category: "attendance_pattern", text: "Attendance is generally steady, but there are occasional shorter-shift risks on lower-energy weeks.", impact: "risk" },
  { employeeId: 1, category: "engagement_pattern", text: "Often asks about increasing payout and prefers practical next-action guidance instead of a pure explanation.", impact: "positive" },
  { employeeId: 1, category: "schedule_pattern", text: "Responds well to pre-shift briefings and tends to benefit from coaching before weekend peak shifts.", impact: "positive" },
  { employeeId: 2, category: "sales_pattern", text: "Usually performs better later in the day and on closing shifts.", impact: "positive" },
  { employeeId: 2, category: "attendance_pattern", text: "Has minor late-check-in risk that may affect first-hour momentum.", impact: "risk" },
  { employeeId: 4, category: "attendance_pattern", text: "Shows steady attendance and benefits from consistent routine-based coaching.", impact: "positive" },
];

const staffScenarioGroups = {
  daily: ["When is my next shift?", "Am I working tomorrow?", "Give me today’s briefing", "How is my attendance this week?"],
  performance: ["How far am I from target?", "How much more do I need to earn 500 more?", "What should I focus on next shift?", "Why did my payout not move?"],
  requests: ["Help me apply for leave", "I need medical leave for tomorrow", "Can you request a shift swap for me?", "Show my pending requests"],
  coaching: ["Give me a suggestion", "What is the best option for me today?", "Should I focus on attendance first or sales first?", "What mistakes should I avoid this shift?"],
  history: ["How have I been doing lately?", "What patterns do you see in my shifts?", "What usually works for me?", "What do I keep asking about?"],
};

const adminScenarioGroups = {
  workforce: ["Who is working tomorrow?", "Who is off this week?", "Who has pending leave or swaps?", "Which shifts are under-covered?"],
  performance: ["Who is top performer right now?", "Who is behind target?", "Which staff may need support today?", "Who is close to the next payout trigger?"],
  risk: ["Who has attendance issues?", "Which team members are showing risk patterns?", "Who might need schedule intervention?", "Which store is underperforming?"],
  coaching: ["Who should I coach first today?", "What is the best next action for this team?", "Which staff benefit most from weekend peak shifts?", "Who needs attendance coaching instead of sales coaching?"],
  trends: ["Show me historical performance patterns", "What changed this week versus last week?", "Which recurring staff questions are trending?", "What are users asking Seyalla most often?"],
};

const adminPersonaScenarioGroups: Record<AdminPersona, Record<string, string[]>> = {
  STORE_MANAGER: {
    approvals: ["Which leave or swap requests need approval today?", "Who is missing from tomorrow’s floor coverage?", "Which staff need support on this week’s roster?"],
    floor_ops: ["Who is late today?", "Who should I coach before the next shift starts?", "Which shifts are at risk because of attendance or leave issues?"],
    performance: ["Who is below target in this store?", "Who is close to the next payout trigger?", "Who is the top performer in my store today?"],
  },
  BRAND_MANAGER: {
    brand_health: ["How is this brand performing across stores?", "Which store is strongest for this brand?", "Which employees are strongest for this brand category?"],
    coaching: ["Which brand staff need product or conversion coaching?", "Which brand teams are losing momentum?", "Where is attendance affecting brand performance?"],
    trends: ["What changed for this brand versus last week?", "Which shifts convert best for this brand?", "Which recurring questions are brand teams asking Seyalla?"],
  },
  COUNTRY_MANAGER: {
    country_view: ["Which regions or stores are underperforming?", "Where are approval or staffing bottlenecks building?", "Which stores need intervention first?"],
    operations: ["How is workforce coverage looking across the country?", "Which locations have the most attendance risks?", "Which managers may need support or escalation?"],
    strategy: ["What patterns are repeating across stores?", "Which teams are closest to commercial risk?", "Which areas show the strongest growth versus last period?"],
  },
};

const historicalComparisons = [
  {
    employeeId: 1,
    title: "This week vs last week",
    summary: "Sales pace is slightly stronger this week, but shift consistency is a little lower.",
    direction: "mixed",
  },
  {
    employeeId: 1,
    title: "Weekend peak vs mid shift",
    summary: "Weekend peak shifts historically produce stronger conversion and better payout momentum than mid shifts.",
    direction: "positive",
  },
  {
    employeeId: 2,
    title: "Closing shift trend",
    summary: "Closing shifts continue to outperform earlier shifts for this employee.",
    direction: "positive",
  },
] as const;

const aiRoleModes = {
  staff: [
    "Commission Coach",
    "Performance Assistant",
    "Work Help Assistant",
    "Policy Helper",
  ],
  admin: [
    "Management Analyst",
    "Approvals Assistant",
    "Operations Monitor",
    "Commission Insights Assistant",
  ],
} as const;

const connectedDataSources = [
  "Sales data",
  "Commission rules",
  "Targets",
  "Staff profiles",
  "Attendance",
  "Roster",
  "Leave and swap workflows",
  "Store / brand / country hierarchy",
  "Payout history",
  "Policy documents",
  "Historical trends",
  "Pending approvals",
] as const;

const intentDictionary: IntentDictionaryItem[] = [
  {
    intent: "staff_commission_summary",
    role: "STAFF",
    domain: "commission",
    purpose: "Show personal commission overview",
    keywords: ["my commission", "earnings", "payout", "bonus", "incentive"],
    sampleQuestions: ["How much commission did I earn this month?"],
    returnType: "summary_card",
    possibleActions: ["Open commission card", "Download statement"],
  },
  {
    intent: "staff_commission_breakdown",
    role: "STAFF",
    domain: "commission",
    purpose: "Explain how commission was calculated",
    keywords: ["breakdown", "calculation", "rate", "tier", "slab", "why is my payout low"],
    sampleQuestions: ["Why is my payout lower this month?"],
    returnType: "breakdown_table",
    possibleActions: ["Open breakdown detail"],
  },
  {
    intent: "staff_target_progress",
    role: "STAFF",
    domain: "target",
    purpose: "Show progress toward personal sales target",
    keywords: ["target", "progress", "on track", "target gap", "how much left"],
    sampleQuestions: ["Am I on track for target?"],
    returnType: "summary_card",
    possibleActions: ["Open target dashboard"],
  },
  {
    intent: "staff_goal_coaching",
    role: "STAFF",
    domain: "coaching",
    purpose: "Help user earn more or reach target",
    keywords: ["earn more", "hit target", "what should I sell", "how much more do I need"],
    sampleQuestions: ["What do I need to sell to earn 500 more?"],
    returnType: "recommendation_panel",
    possibleActions: ["Create goal plan"],
  },
  {
    intent: "staff_sales_performance",
    role: "STAFF",
    domain: "sales performance",
    purpose: "Show personal sales performance",
    keywords: ["my sales", "performance", "top products", "category performance"],
    sampleQuestions: ["Show my sales for this week"],
    returnType: "summary_card",
    possibleActions: ["Open performance dashboard"],
  },
  {
    intent: "staff_historical_comparison",
    role: "STAFF",
    domain: "historical comparison",
    purpose: "Compare current performance to past periods",
    keywords: ["compare", "last month", "previous", "historical", "trend"],
    sampleQuestions: ["Compare my commission to last month"],
    returnType: "trend_chart",
    possibleActions: ["Show comparison chart"],
  },
  {
    intent: "staff_roster_view",
    role: "STAFF",
    domain: "roster",
    purpose: "Display work schedule",
    keywords: ["roster", "schedule", "shift", "off day", "work hours"],
    sampleQuestions: ["Show me my roster this week"],
    returnType: "summary_card",
    possibleActions: ["Open roster"],
  },
  {
    intent: "staff_leave_request",
    role: "STAFF",
    domain: "leave",
    purpose: "Help user apply for leave",
    keywords: ["apply leave", "annual leave", "sick leave", "request leave"],
    sampleQuestions: ["I want to apply leave for Friday"],
    returnType: "workflow_form",
    possibleActions: ["Submit leave request"],
  },
  {
    intent: "staff_shift_swap",
    role: "STAFF",
    domain: "shift swap",
    purpose: "Handle shift swap requests",
    keywords: ["shift swap", "swap shift", "exchange shift"],
    sampleQuestions: ["Can I swap my Sunday shift?"],
    returnType: "workflow_form",
    possibleActions: ["Create swap request"],
  },
  {
    intent: "staff_attendance_issue",
    role: "STAFF",
    domain: "attendance",
    purpose: "Resolve attendance-related queries",
    keywords: ["attendance", "missed punch", "late", "absent", "correction"],
    sampleQuestions: ["I forgot to punch in yesterday"],
    returnType: "workflow_form",
    possibleActions: ["Submit correction request"],
  },
  {
    intent: "staff_policy_faq",
    role: "STAFF",
    domain: "policy",
    purpose: "Answer work or commission rule questions",
    keywords: ["policy", "rule", "entitlement", "eligibility", "payout cycle"],
    sampleQuestions: ["When will my commission be paid?"],
    returnType: "policy_answer",
    possibleActions: ["Open policy article"],
  },
  {
    intent: "staff_dispute_case",
    role: "STAFF",
    domain: "disputes",
    purpose: "Raise payout or attendance disputes",
    keywords: ["dispute", "wrong payout", "issue", "raise case"],
    sampleQuestions: ["My commission looks wrong"],
    returnType: "workflow_form",
    possibleActions: ["Create dispute ticket"],
  },
  {
    intent: "staff_daily_briefing",
    role: "STAFF",
    domain: "daily briefing",
    purpose: "Give short daily guidance",
    keywords: ["today", "focus", "what should I do today", "briefing"],
    sampleQuestions: ["What should I focus on today?"],
    returnType: "recommendation_panel",
    possibleActions: ["Open daily briefing"],
  },
  {
    intent: "staff_ai_coaching",
    role: "STAFF",
    domain: "coaching",
    purpose: "Provide personalised improvement tips",
    keywords: ["improve", "coaching", "recommendation", "advice"],
    sampleQuestions: ["How can I improve my sales?"],
    returnType: "recommendation_panel",
    possibleActions: ["Save coaching note"],
  },
  {
    intent: "admin_team_performance",
    role: "ADMIN",
    domain: "team performance",
    purpose: "Review staff or team performance",
    keywords: ["team sales", "staff performance", "ranking", "top performer"],
    sampleQuestions: ["Show my team’s performance this week"],
    returnType: "summary_card",
    possibleActions: ["Open team dashboard"],
  },
  {
    intent: "admin_store_performance",
    role: "ADMIN",
    domain: "store performance",
    purpose: "Review store-level performance",
    keywords: ["store sales", "store performance", "outlet performance"],
    sampleQuestions: ["How is Store A performing this month?"],
    returnType: "summary_card",
    possibleActions: ["Open store dashboard"],
  },
  {
    intent: "admin_brand_performance",
    role: "ADMIN",
    domain: "brand performance",
    purpose: "Review brand-level results",
    keywords: ["brand performance", "brand sales", "category trend"],
    sampleQuestions: ["Compare brand performance across stores"],
    returnType: "trend_chart",
    possibleActions: ["Open brand report"],
  },
  {
    intent: "admin_country_performance",
    role: "ADMIN",
    domain: "country performance",
    purpose: "Review country-level results",
    keywords: ["country", "region", "regional performance"],
    sampleQuestions: ["How is Singapore performing this quarter?"],
    returnType: "executive_digest",
    possibleActions: ["Open country dashboard"],
  },
  {
    intent: "admin_commission_review",
    role: "ADMIN",
    domain: "commission review",
    purpose: "Review commission payouts and structure",
    keywords: ["payout summary", "commission report", "payout review"],
    sampleQuestions: ["Show this month’s commission payout summary"],
    returnType: "breakdown_table",
    possibleActions: ["Open payout report"],
  },
  {
    intent: "admin_commission_exception",
    role: "ADMIN",
    domain: "commission exception",
    purpose: "Detect unusual commission records",
    keywords: ["unusual payout", "anomaly", "spike", "adjustment"],
    sampleQuestions: ["Why did payout spike in Store B?"],
    returnType: "alert_banner",
    possibleActions: ["Open exception list"],
  },
  {
    intent: "admin_approval_inbox",
    role: "ADMIN",
    domain: "approvals",
    purpose: "Show pending approvals",
    keywords: ["pending approvals", "leave approvals", "approval queue"],
    sampleQuestions: ["Show all pending approvals"],
    returnType: "approval_queue",
    possibleActions: ["Open approvals inbox"],
  },
  {
    intent: "admin_leave_approval",
    role: "ADMIN",
    domain: "approvals",
    purpose: "Review leave requests",
    keywords: ["approve leave", "leave request", "pending leave"],
    sampleQuestions: ["Which leave requests need approval?"],
    returnType: "approval_queue",
    possibleActions: ["Approve/reject leave"],
  },
  {
    intent: "admin_shift_approval",
    role: "ADMIN",
    domain: "approvals",
    purpose: "Review shift swaps",
    keywords: ["swap approvals", "shift request"],
    sampleQuestions: ["Any shift swaps pending?"],
    returnType: "approval_queue",
    possibleActions: ["Approve/reject swap"],
  },
  {
    intent: "admin_attendance_monitoring",
    role: "ADMIN",
    domain: "attendance risk",
    purpose: "Monitor attendance and discipline issues",
    keywords: ["late staff", "absenteeism", "no show", "missed punch"],
    sampleQuestions: ["Who has attendance issues this week?"],
    returnType: "watchlist",
    possibleActions: ["Escalate/support"],
  },
  {
    intent: "admin_risk_detection",
    role: "ADMIN",
    domain: "risk detection",
    purpose: "Identify who or what is at risk",
    keywords: ["at risk", "miss target", "red flag", "support watchlist"],
    sampleQuestions: ["Which staff are likely to miss target?"],
    returnType: "watchlist",
    possibleActions: ["Add to support list"],
  },
  {
    intent: "admin_coaching_recommendation",
    role: "ADMIN",
    domain: "coaching intervention",
    purpose: "Recommend support actions for staff",
    keywords: ["who needs coaching", "improvement", "support"],
    sampleQuestions: ["Who needs coaching this week?"],
    returnType: "recommendation_panel",
    possibleActions: ["Assign coaching"],
  },
  {
    intent: "admin_operational_summary",
    role: "ADMIN",
    domain: "operations",
    purpose: "Summarise operations and workforce issues",
    keywords: ["manpower", "staffing", "floor coverage", "operations"],
    sampleQuestions: ["Any manpower issues today?"],
    returnType: "summary_card",
    possibleActions: ["Open operations panel"],
  },
  {
    intent: "admin_target_management",
    role: "ADMIN",
    domain: "target management",
    purpose: "Review or adjust targets",
    keywords: ["target setting", "assign target", "adjust target"],
    sampleQuestions: ["Which stores are behind target?"],
    returnType: "watchlist",
    possibleActions: ["Update target"],
  },
  {
    intent: "admin_historical_comparison",
    role: "ADMIN",
    domain: "historical comparison",
    purpose: "Compare business performance over time",
    keywords: ["compare", "last month", "MoM", "WoW", "YoY"],
    sampleQuestions: ["Compare store performance against last month"],
    returnType: "trend_chart",
    possibleActions: ["Open comparison report"],
  },
  {
    intent: "admin_policy_faq",
    role: "ADMIN",
    domain: "policy",
    purpose: "Explain management rules and controls",
    keywords: ["policy", "commission rules", "eligibility", "approval rule"],
    sampleQuestions: ["What is the rule for commission adjustment?"],
    returnType: "policy_answer",
    possibleActions: ["Open policy article"],
  },
  {
    intent: "admin_payroll_export",
    role: "ADMIN",
    domain: "payroll",
    purpose: "Support finance or payroll processing",
    keywords: ["export payout", "payroll", "release payout"],
    sampleQuestions: ["Export payroll-ready commission file"],
    returnType: "breakdown_table",
    possibleActions: ["Export report"],
  },
  {
    intent: "admin_account_permissions",
    role: "ADMIN",
    domain: "permissions",
    purpose: "Manage user access or role access",
    keywords: ["role", "permission", "access", "assign user"],
    sampleQuestions: ["Who can approve store leave requests?"],
    returnType: "policy_answer",
    possibleActions: ["Update role access"],
  },
  {
    intent: "admin_executive_summary",
    role: "ADMIN",
    domain: "executive summary",
    purpose: "Provide high-level leadership summary",
    keywords: ["summary", "business overview", "executive report"],
    sampleQuestions: ["Give me a summary of performance this month"],
    returnType: "executive_digest",
    possibleActions: ["Generate summary"],
  },
  {
    intent: "shared_performance_query",
    role: "SHARED",
    domain: "performance",
    purpose: "Ask about performance",
    keywords: ["performance", "results", "sales"],
    sampleQuestions: ["How am I doing?", "How is my team doing?"],
    returnType: "summary_card",
    possibleActions: ["Open performance dashboard"],
  },
  {
    intent: "shared_target_query",
    role: "SHARED",
    domain: "target",
    purpose: "Ask about target status",
    keywords: ["target", "progress", "on track"],
    sampleQuestions: ["Am I on track?", "Is the store on track?"],
    returnType: "summary_card",
    possibleActions: ["Open target dashboard"],
  },
  {
    intent: "shared_comparison_query",
    role: "SHARED",
    domain: "comparison",
    purpose: "Ask for comparison",
    keywords: ["compare", "trend", "last month"],
    sampleQuestions: ["Compare me to last month", "Compare store to last month"],
    returnType: "trend_chart",
    possibleActions: ["Open comparison chart"],
  },
  {
    intent: "shared_explanation_query",
    role: "SHARED",
    domain: "explanation",
    purpose: "Ask why something changed",
    keywords: ["why", "reason", "explain"],
    sampleQuestions: ["Why is my payout low?", "Why is store payout high?"],
    returnType: "policy_answer",
    possibleActions: ["Open explanation panel"],
  },
  {
    intent: "shared_action_query",
    role: "SHARED",
    domain: "action",
    purpose: "User wants system action",
    keywords: ["apply", "approve", "request", "submit"],
    sampleQuestions: ["Apply leave", "Approve leave"],
    returnType: "workflow_form",
    possibleActions: ["Trigger action workflow"],
  },
  {
    intent: "shared_policy_query",
    role: "SHARED",
    domain: "policy",
    purpose: "Ask about policy or rules",
    keywords: ["policy", "rule", "eligibility"],
    sampleQuestions: ["When am I paid?", "Who can approve adjustments?"],
    returnType: "policy_answer",
    possibleActions: ["Open policy article"],
  },
] as const;

const tiers: TierRow[] = [
  { id: 1, name: "Standard Progressive", category: "INDIVIDUAL", workFlowJson: '{"expression":"let p=(salesAmount/targetAmount)*100; p<70?0:p<90?salesAmount*0.008:p<110?salesAmount*0.015:p<130?salesAmount*0.022:salesAmount*0.03"}', variableDefinition: '{"targetAmount":{"name":"targetAmount","type":"decimal"},"salesAmount":{"name":"salesAmount","type":"decimal"}}', isActive: true },
  { id: 2, name: "100% Club Fixed", category: "INDIVIDUAL", workFlowJson: '{"expression":"(salesAmount/targetAmount)>=1?1500:0"}', variableDefinition: '{"targetAmount":{"name":"targetAmount","type":"decimal"},"salesAmount":{"name":"salesAmount","type":"decimal"}}', isActive: true },
  { id: 3, name: "Accelerator Above 120%", category: "INDIVIDUAL", workFlowJson: '{"expression":"let ratio=salesAmount/targetAmount; ratio>=1.2?salesAmount*0.035:ratio>=1?salesAmount*0.02:0"}', variableDefinition: '{"targetAmount":{"name":"targetAmount","type":"decimal"},"salesAmount":{"name":"salesAmount","type":"decimal"}}', isActive: true },
  { id: 5, name: "Safe 1.5% on Achievement", category: "INDIVIDUAL", workFlowJson: '{"expression":"salesAmount*0.015"}', variableDefinition: '{"salesAmount":{"name":"salesAmount","type":"decimal"}}', isActive: true },
  { id: 6, name: "Team Volume Bonus", category: "TEAM", workFlowJson: '{"expression":"salesAmount>=300000?12000:salesAmount>=220000?7000:0"}', variableDefinition: '{"salesAmount":{"name":"salesAmount","type":"decimal"}}', isActive: true },
  { id: 7, name: "Elite Above 150%", category: "INDIVIDUAL", workFlowJson: '{"expression":"let ratio=salesAmount/targetAmount; ratio>=1.5?5000:ratio>=1.2?2500:0"}', variableDefinition: '{"targetAmount":{"name":"targetAmount","type":"decimal"},"salesAmount":{"name":"salesAmount","type":"decimal"}}', isActive: true },
  { id: 8, name: "Starter Floor Bonus", category: "INDIVIDUAL", workFlowJson: '{"expression":"salesAmount>0?300:0"}', variableDefinition: '{"salesAmount":{"name":"salesAmount","type":"decimal"}}', isActive: true },
  { id: 9, name: "Steady Growth", category: "INDIVIDUAL", workFlowJson: '{"expression":"let ratio=salesAmount/targetAmount; ratio>=1.1?salesAmount*0.01:0"}', variableDefinition: '{"targetAmount":{"name":"targetAmount","type":"decimal"},"salesAmount":{"name":"salesAmount","type":"decimal"}}', isActive: true },
  { id: 10, name: "Strong Finish", category: "INDIVIDUAL", workFlowJson: '{"expression":"let ratio=salesAmount/targetAmount; ratio>=1.25?3400:ratio>=1?1700:0"}', variableDefinition: '{"targetAmount":{"name":"targetAmount","type":"decimal"},"salesAmount":{"name":"salesAmount","type":"decimal"}}', isActive: true },
];

const targets: TargetRow[] = [
  { id: 1, employeeId: 1, month: 3, year: 2025, targetAmount: 48000, salesAmount: 64000, payout: 1920, status: "COMPLETED", tierId: 1, achievementPct: "133%", tierExpression: "p>=130 → salesAmount×0.03" },
  { id: 2, employeeId: 2, month: 3, year: 2025, targetAmount: 42000, salesAmount: 46000, payout: 1500, status: "COMPLETED", tierId: 2, achievementPct: "110%", tierExpression: "ratio>=1 → fixed 1500" },
  { id: 3, employeeId: 4, month: 3, year: 2025, targetAmount: 65000, salesAmount: 78000, payout: 2730, status: "COMPLETED", tierId: 3, achievementPct: "120%", tierExpression: "ratio>=1.2 → salesAmount×0.035" },
  { id: 4, employeeId: 5, month: 3, year: 2025, targetAmount: 55000, salesAmount: 55000, payout: 825, status: "COMPLETED", tierId: 5, achievementPct: "100%", tierExpression: "flat → salesAmount×0.015" },
  { id: 5, employeeId: 7, month: 3, year: 2025, targetAmount: 38000, salesAmount: 25000, payout: 300, status: "COMPLETED", tierId: 8, achievementPct: "66%", tierExpression: "salesAmount>0 → 300" },
  { id: 6, employeeId: 1, month: 4, year: 2025, targetAmount: 72000, salesAmount: 110000, payout: 5000, status: "IN_PROGRESS", tierId: 7, achievementPct: "153%", tierExpression: "ratio>=1.5 → 5000" },
  { id: 7, employeeId: 3, month: 4, year: 2025, targetAmount: 30000, salesAmount: 18000, payout: 0, status: "IN_PROGRESS", tierId: 1, achievementPct: "60%", tierExpression: "below 70 → 0" },
  { id: 8, employeeId: 8, month: 4, year: 2025, targetAmount: 52000, salesAmount: 58000, payout: 1160, status: "IN_PROGRESS", tierId: 9, achievementPct: "112%", tierExpression: "ratio>=1.1 → salesAmount×0.01" },
  { id: 9, employeeId: 6, month: 4, year: 2025, targetAmount: 25000, salesAmount: 26000, payout: 10000, status: "IN_PROGRESS", tierId: 6, achievementPct: "104%", tierExpression: "team sales trigger" },
  { id: 10, employeeId: 10, month: 4, year: 2025, targetAmount: 68000, salesAmount: 85000, payout: 3400, status: "IN_PROGRESS", tierId: 10, achievementPct: "125%", tierExpression: "ratio>=1.25 → 3400" },
];

const systemPrompt = [
  "You are Seyalla, the AI Sales and Commission Assistant inside Seyal.",
  "You are one AI engine, but your behaviour must change based on role, scope, and permission.",
  "For staff, act like a personal commission coach, work assistant, and self-service helper.",
  "For admins, act like a business intelligence assistant, approvals assistant, and decision support agent.",
  "Speak clearly, naturally, and confidently.",
  "Use only the scoped business context provided to you.",
  "Never reveal information outside the active role or permission boundary.",
  "Explain performance, commission outcomes, targets, roster, attendance, workflow status, risks, and next actions in a concise but helpful way.",
  "Sound premium, calm, commercially sharp, and actionable.",
].join("\n");

const developerPrompt = [
  "Rules:",
  "1. Never invent business figures.",
  "2. If a calculation is needed, trust application-supplied computed fields first.",
  "3. If scope is STAFF, answer only from the authenticated user's own records and workflows.",
  "4. If scope is ADMIN, answer using the allowed store, brand, country, team, or approval scope only.",
  "5. Staff mode should emphasize guidance, explanation, coaching, and self-service.",
  "6. Admin mode should emphasize oversight, analysis, decision support, and workflow control.",
  "7. When useful, structure answers as: current position, implication, next best action.",
  "8. Use historical patterns and saved preferences when they are provided.",
  "9. If permission allows, the assistant should not only answer, but also suggest or trigger relevant actions.",
  "10. Keep answers readable, practical, and role-aware.",
].join("\n");

const sampleApiRoute = [
  "// app/api/seyalla/chat/route.ts",
  "import { NextRequest, NextResponse } from 'next/server';",
  "import OpenAI from 'openai';",
  "",
  "const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });",
  "",
  "export async function POST(req: NextRequest) {",
  "  const body = await req.json();",
  "  const message = body.message ?? '';",
  "  const roleScope = body.roleScope;",
  "",
  "  if (!message.trim()) {",
  "    return NextResponse.json({ error: 'Message is required' }, { status: 400 });",
  "  }",
  "",
  "  // 1. Resolve role + permission scope first",
  "  // 2. Classify using formal intent dictionary",
  "  // 3. Extract entities like time period, store, brand, metric, action",
  "  // 4. Load trusted scoped business context",
  "  // 5. Compute rules and projections in application logic",
  "  // 6. Pass only trusted scoped payload into OpenAI for explanation",
  "",
  "  return NextResponse.json({",
  "    answer: 'Seyalla response placeholder',",
  "    resolvedIntent: 'staff_commission_summary',",
  "    responseMode: 'answer'",
  "  });",
  "}",
].join("\n");

const sampleSupabaseSchema = [
  "create table if not exists profiles (",
  "  id uuid primary key references auth.users(id) on delete cascade,",
  "  full_name text,",
  "  role text not null check (role in ('staff','admin','manager'))",
  ");",
  "",
  "create table if not exists seyalla_threads (",
  "  id uuid primary key default gen_random_uuid(),",
  "  user_id uuid not null references auth.users(id) on delete cascade,",
  "  title text not null default 'New Seyalla Thread'",
  ");",
  "",
  "alter table profiles enable row level security;",
  "alter table seyalla_threads enable row level security;",
].join("\n");

const firebaseCollections = [
  "Firestore collections",
  "/users/{userId}",
  "/seyallaThreads/{threadId}",
  "/seyallaThreads/{threadId}/messages/{messageId}",
  "/seyallaMemory/{userId}/items/{memoryId}",
  "/seyallaEvents/{eventId}",
].join("\n");

const promptPayloadExample = [
  "{",
  '  "message": "What if I close 10000 more this month?",',
  '  "intent": "projection",',
  '  "roleScope": { "mode": "STAFF", "userId": "uuid-123", "employeeId": 1 },',
  '  "context": { "salesAmount": 110000, "targetAmount": 72000, "currentPayout": 5000 }',
  "}",
].join("\n");

const analyticsEvents = [
  "chat_started",
  "thread_created",
  "message_sent",
  "intent_detected",
  "assistant_replied",
  "scope_blocked",
  "projection_requested",
  "commission_explained",
  "target_gap_viewed",
  "thread_summarized",
  "memory_updated",
  "admin_dashboard_opened",
  "analytics_filter_changed",
];

const intentEntityTags = [
  "Time period",
  "Scope",
  "Store name",
  "Brand",
  "Metric",
  "Action",
  "Value goal",
  "Person",
  "Request type",
] as const;

const recommendedReturnTypes: IntentReturnType[] = [
  "summary_card",
  "breakdown_table",
  "trend_chart",
  "watchlist",
  "approval_queue",
  "policy_answer",
  "workflow_form",
  "recommendation_panel",
  "alert_banner",
  "executive_digest",
];

const summarizerCode = [
  "// lib/seyalla/summarize-thread.ts",
  "import OpenAI from 'openai';",
  "",
  "export async function summarizeThreadForMemory(messages) {",
  "  return { summary: 'compact memory summary', preferences: [], patterns: [] };",
  "}",
].join("\n");

const dashboardQueries = [
  "select coalesce(intent, 'unknown') as intent, count(*) as total",
  "from seyalla_messages",
  "where role = 'user'",
  "group by 1",
  "order by total desc;",
].join("\n");

const dashboardComponent = [
  "// app/admin/seyalla/page.tsx",
  "export default async function SeyallaAdminDashboard() {",
  "  return <div>Seyalla Admin Analytics</div>;",
  "}",
].join("\n");

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 0,
  }).format(value);

const formatPct = (value: number) => `${value.toFixed(0)}%`;

function getTierName(tierId: number) {
  return tiers.find((t) => t.id === tierId)?.name ?? "Custom Plan";
}

function calculatePayout(tierId: number, salesAmount: number, targetAmount: number, teamSalesAmount?: number) {
  const ratio = targetAmount > 0 ? salesAmount / targetAmount : 0;

  switch (tierId) {
    case 1: {
      const p = ratio * 100;
      if (p < 70) return 0;
      if (p < 90) return salesAmount * 0.008;
      if (p < 110) return salesAmount * 0.015;
      if (p < 130) return salesAmount * 0.022;
      return salesAmount * 0.03;
    }
    case 2:
      return ratio >= 1 ? 1500 : 0;
    case 3:
      return ratio >= 1.2 ? salesAmount * 0.035 : ratio >= 1 ? salesAmount * 0.02 : 0;
    case 5:
      return salesAmount * 0.015;
    case 6: {
      const teamSales = teamSalesAmount ?? salesAmount;
      return teamSales >= 300000 ? 12000 : teamSales >= 220000 ? 7000 : 0;
    }
    case 7:
      return ratio >= 1.5 ? 5000 : ratio >= 1.2 ? 2500 : 0;
    case 8:
      return salesAmount > 0 ? 300 : 0;
    case 9:
      return ratio >= 1.1 ? salesAmount * 0.01 : 0;
    case 10:
      return ratio >= 1.25 ? 3400 : ratio >= 1 ? 1700 : 0;
    default:
      return 0;
  }
}

function detectIntent(message: string) {
  const lower = message.toLowerCase().trim();
  if (
    lower.includes("help") ||
    lower.includes("how do i use") ||
    lower.includes("what can you do") ||
    lower.includes("how does this work") ||
    lower.includes("what should i ask") ||
    lower.includes("i dont know") ||
    lower.includes("don't know")
  ) return "help";
  if (
    lower.includes("compare this month") ||
    lower.includes("last month by brand") ||
    lower.includes("compare month") ||
    lower.includes("versus last month") ||
    lower.includes("vs last month") ||
    lower.includes("compare performance")
  ) return "admin_comparison";
  if (
    lower.includes("operational issues") ||
    lower.includes("conversion issues") ||
    lower.includes("what is affecting conversion") ||
    lower.includes("what issues are affecting") ||
    lower.includes("coverage issue") ||
    lower.includes("bottleneck")
  ) return "admin_operational";
  if (
    lower.includes("who needs coaching") ||
    lower.includes("deserve coaching") ||
    lower.includes("likely to miss target") ||
    lower.includes("at risk of missing") ||
    lower.includes("who needs support") ||
    lower.includes("coaching support")
  ) return "admin_coaching";
  if (
    lower.includes("product categories are driving") ||
    lower.includes("categories are driving") ||
    lower.includes("driving the most commission") ||
    lower.includes("category drivers") ||
    lower.includes("which categories drive")
  ) return "admin_category";
  if (
    lower === "sales" ||
    lower === "my sales" ||
    lower === "money" ||
    lower === "my money" ||
    lower.includes("what's my sales") ||
    lower.includes("whats my sales") ||
    lower.includes("my sales like") ||
    lower.includes("how are sales") ||
    lower.includes("sales like")
  ) return "sales_overview";
  if (
    lower.includes("rank") ||
    lower.includes("ranking") ||
    lower.includes("leaderboard") ||
    lower.includes("top performer") ||
    lower.includes("best performer") ||
    lower.includes("top performers")
  ) return "ranking";
  if (
    lower.includes("approval") ||
    lower.includes("approvals") ||
    lower.includes("approvals inbox") ||
    lower.includes("pending approvals") ||
    lower.includes("show approvals") ||
    lower.includes("approval bottlenecks")
  ) return "approvals";
  if (
    lower.includes("watchlist") ||
    lower.includes("support needed") ||
    lower.includes("support watchlist") ||
    lower.includes("brand coaching priorities") ||
    lower.includes("regional support priorities") ||
    lower.includes("store risk map") ||
    lower.includes("coverage gaps")
  ) return "support_watchlist";
  if (
    lower.includes("earn more") ||
    lower.includes("earn 500 more") ||
    lower.includes("make 500 more") ||
    lower.includes("make more commission") ||
    lower.includes("more commission") ||
    lower.includes("increase my payout") ||
    lower.includes("increase my commission") ||
    (lower.includes("earn") && lower.includes("more"))
  ) return "earn_more";
  if (
    lower.includes("summary") ||
    lower.includes("summarize") ||
    lower.includes("higher level") ||
    lower.includes("how is this scope performing") ||
    lower.includes("how is the store performing") ||
    lower.includes("how is the brand performing") ||
    lower.includes("how is the country performing") ||
    lower.includes("brand health") ||
    lower.includes("country overview") ||
    lower.includes("store team summary") ||
    lower.includes("cross-store brand view") ||
    lower.includes("trend comparison")
  ) return "admin_summary";
  if (lower.includes("suggest") || lower.includes("recommend") || lower.includes("what should i do") || lower.includes("best option") || lower.includes("should i") || lower.includes("advice")) return "decision_support";
  if (lower.includes("leave") || lower.includes("mc") || lower.includes("medical") || lower.includes("swap") || lower.includes("shift swap") || lower.includes("apply") || lower.includes("my requests") || lower.includes("pending requests")) return "leave_support";
  if (lower.includes("briefing") || lower.includes("today") || lower.includes("start my day") || lower.includes("daily summary")) return "daily_briefing";
  if (lower.includes("schedule") || lower.includes("shift") || lower.includes("roster") || lower.includes("working today") || lower.includes("when am i working") || lower.includes("weekly roster") || lower.includes("my next shift")) return "schedule";
  if (lower.includes("what if") || lower.includes("extra") || lower.includes("more sales") || lower.includes("projection") || lower.includes("simulate")) return "projection";
  if (lower.includes("target") || lower.includes("progress") || lower.includes("achievement") || lower.includes("target gap") || lower.includes("how far am i")) return "target_progress";
  if (
    lower.includes("strongest category") ||
    lower.includes("weakest category") ||
    lower.includes("product categories") ||
    lower.includes("category am i strongest") ||
    lower.includes("category am i weakest") ||
    lower.includes("what category") ||
    lower.includes("my categories")
  ) return "category_performance";
  if (
    lower.includes("compare my performance to last month") ||
    lower.includes("compare to last month") ||
    lower.includes("last month") ||
    lower.includes("previous month") ||
    lower.includes("compare my performance")
  ) return "performance_comparison";
  if (
    lower.includes("why is my commission lower") ||
    lower.includes("why is my payout lower") ||
    lower.includes("commission lower") ||
    lower.includes("payout lower") ||
    lower.includes("missed opportunities") ||
    lower.includes("missed opportunity")
  ) return "commission_change";
  if (lower.includes("commission") || lower.includes("payout") || lower.includes("earn")) return "commission";
  if (lower.includes("attendance") || lower.includes("hours") || lower.includes("late") || lower.includes("check in") || lower.includes("check-in") || lower.includes("absent")) return "attendance";
  return "coach";
}

function extractEntities(message: string): ExtractedEntities {
  const lower = message.toLowerCase();
  const entities: ExtractedEntities = {};

  if (lower.includes("today")) entities.timePeriod = "today";
  else if (lower.includes("this week")) entities.timePeriod = "this week";
  else if (lower.includes("last week")) entities.timePeriod = "last week";
  else if (lower.includes("this month")) entities.timePeriod = "this month";
  else if (lower.includes("last month") || lower.includes("previous month")) entities.timePeriod = "last month";
  else if (lower.includes("quarter") || lower.includes("q1") || lower.includes("q2") || lower.includes("q3") || lower.includes("q4")) entities.timePeriod = "quarter";

  if (lower.includes(" my ") || lower.startsWith("my ") || lower.includes(" me ") || lower === "me") entities.scope = "me";
  else if (lower.includes("team")) entities.scope = "team";
  else if (lower.includes("store")) entities.scope = "store";
  else if (lower.includes("brand")) entities.scope = "brand";
  else if (lower.includes("country") || lower.includes("region") || lower.includes("regional")) entities.scope = "country";

  const store = stores.find((item) => lower.includes(item.name.toLowerCase().replace(" store", "")) || lower.includes(item.name.toLowerCase()));
  if (store) entities.storeName = store.name;

  const brand = brands.find((item) => lower.includes(item.name.toLowerCase()) || lower.includes(item.name.toLowerCase().replace(" sg core", "").replace(" sg orchard", "").replace(" my klcc", "").replace(" my pavilion", "")));
  if (brand) entities.brandName = brand.name;

  const person = employees.find((item) => lower.includes(item.firstName.toLowerCase()));
  if (person) entities.personName = person.firstName;

  if (lower.includes("commission") || lower.includes("payout") || lower.includes("bonus")) entities.metric = "commission";
  else if (lower.includes("sales")) entities.metric = "sales";
  else if (lower.includes("target")) entities.metric = "target";
  else if (lower.includes("attendance")) entities.metric = "attendance";
  else if (lower.includes("roster") || lower.includes("shift") || lower.includes("schedule")) entities.metric = "schedule";

  if (lower.includes("apply")) entities.action = "apply";
  else if (lower.includes("approve")) entities.action = "approve";
  else if (lower.includes("reject")) entities.action = "reject";
  else if (lower.includes("compare")) entities.action = "compare";
  else if (lower.includes("explain") || lower.includes("why")) entities.action = "explain";
  else if (lower.includes("show")) entities.action = "show";

  if (lower.includes("leave")) entities.requestType = "leave";
  else if (lower.includes("swap")) entities.requestType = "shift_swap";
  else if (lower.includes("dispute")) entities.requestType = "dispute";
  else if (lower.includes("attendance correction") || lower.includes("missed punch") || lower.includes("correction")) entities.requestType = "attendance_correction";

  const valueGoal = extractExtraSalesAmount(message);
  if (valueGoal >= 1000) entities.valueGoal = valueGoal;

  return entities;
}

function mapMasterIntentToLegacyIntent(masterIntent: string, fallbackLegacyIntent: string): string {
  const map: Record<string, string> = {
    staff_commission_summary: "commission",
    staff_commission_breakdown: "commission_change",
    staff_target_progress: "target_progress",
    staff_goal_coaching: "earn_more",
    staff_sales_performance: "sales_overview",
    staff_historical_comparison: "performance_comparison",
    staff_roster_view: "schedule",
    staff_leave_request: "leave_support",
    staff_shift_swap: "leave_support",
    staff_attendance_issue: "attendance",
    staff_policy_faq: "help",
    staff_dispute_case: "leave_support",
    staff_daily_briefing: "daily_briefing",
    staff_ai_coaching: "decision_support",
    admin_team_performance: "admin_summary",
    admin_store_performance: "admin_summary",
    admin_brand_performance: "admin_summary",
    admin_country_performance: "admin_summary",
    admin_commission_review: "admin_summary",
    admin_commission_exception: "admin_operational",
    admin_approval_inbox: "approvals",
    admin_leave_approval: "approvals",
    admin_shift_approval: "approvals",
    admin_attendance_monitoring: "support_watchlist",
    admin_risk_detection: "support_watchlist",
    admin_coaching_recommendation: "admin_coaching",
    admin_operational_summary: "admin_operational",
    admin_target_management: "admin_summary",
    admin_historical_comparison: "admin_comparison",
    admin_policy_faq: "help",
    admin_payroll_export: "admin_summary",
    admin_account_permissions: "help",
    admin_executive_summary: "admin_summary",
    shared_performance_query: "sales_overview",
    shared_target_query: "target_progress",
    shared_comparison_query: "performance_comparison",
    shared_explanation_query: "commission_change",
    shared_action_query: "leave_support",
    shared_policy_query: "help",
  };

  return map[masterIntent] ?? fallbackLegacyIntent;
}

function resolveIntentFromDictionary(message: string, scopeMode: ScopeMode): ResolvedIntent {
  const fallbackLegacyIntent = detectIntent(message);
  const entities = extractEntities(message);
  const normalized = message.toLowerCase().trim();
  const role: IntentRole = scopeMode === "STAFF" ? "STAFF" : "ADMIN";

  const scopedCandidates = intentDictionary.filter((item) => item.role === role || item.role === "SHARED");

  const scored = scopedCandidates
    .map((item) => {
      const keywordScore = item.keywords.reduce((sum, keyword) => sum + (normalized.includes(keyword.toLowerCase()) ? 5 : 0), 0);
      const questionScore = item.sampleQuestions.reduce((sum, sample) => sum + (normalized.includes(sample.toLowerCase()) ? 8 : 0), 0);
      const domainScore = normalized.includes(item.domain.toLowerCase()) ? 2 : 0;
      return { item, score: keywordScore + questionScore + domainScore };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];

  if (!best || best.score <= 0) {
    return {
      masterIntent: role === "STAFF" ? "staff_ai_coaching" : "admin_executive_summary",
      role,
      domain: role === "STAFF" ? "coaching" : "executive summary",
      returnType: role === "STAFF" ? "recommendation_panel" : "executive_digest",
      legacyIntent: fallbackLegacyIntent,
      confidence: 45,
      entities,
    };
  }

  return {
    masterIntent: best.item.intent,
    role: best.item.role,
    domain: best.item.domain,
    returnType: best.item.returnType,
    legacyIntent: mapMasterIntentToLegacyIntent(best.item.intent, fallbackLegacyIntent),
    confidence: Math.min(98, 55 + best.score * 3),
    entities,
  };
}

function resolveResponseMode(returnType: IntentReturnType): "answer" | "explain" | "recommend" | "act" {
  switch (returnType) {
    case "workflow_form":
    case "approval_queue":
      return "act";
    case "breakdown_table":
    case "policy_answer":
    case "trend_chart":
      return "explain";
    case "watchlist":
    case "recommendation_panel":
    case "executive_digest":
      return "recommend";
    default:
      return "answer";
  }
}

function getMentionedEmployee(message: string) {
  const lower = message.toLowerCase();
  return employees.find((e) => lower.includes(e.firstName.toLowerCase()) || lower.includes(e.employeeCode.toLowerCase()));
}

function extractExtraSalesAmount(message: string) {
  const cleaned = message.replaceAll(",", "");
  const numberMatch = cleaned.match(/[0-9]{3,6}/);
  return numberMatch ? Number(numberMatch[0]) : 10000;
}

function estimateSalesNeededForExtraPayout(params: {
  tierId: number;
  currentSales: number;
  targetAmount: number;
  currentPayout: number;
  desiredExtraPayout: number;
  teamSalesAmount?: number;
}) {
  const desiredPayout = params.currentPayout + params.desiredExtraPayout;

  for (let salesStep = 0; salesStep <= 200000; salesStep += 500) {
    const projectedSales = params.currentSales + salesStep;
    const projectedPayout = calculatePayout(
      params.tierId,
      projectedSales,
      params.targetAmount,
      (params.teamSalesAmount ?? params.currentSales) + salesStep
    );

    if (projectedPayout >= desiredPayout) {
      return {
        reachable: true,
        extraSalesNeeded: salesStep,
        projectedSales,
        projectedPayout,
      };
    }
  }

  return {
    reachable: false,
    extraSalesNeeded: null,
    projectedSales: null,
    projectedPayout: null,
  };
}

function mascotFromIntent(intent: string): MascotMood {
  if (intent === "projection" || intent === "commission" || intent === "decision_support") return "focused";
  if (intent === "target_progress" || intent === "schedule" || intent === "daily_briefing" || intent === "leave_support") return "coach";
  if (intent === "admin_summary") return "celebrate";
  return "warm";
}

function moodConfig(mood: MascotMood) {
  switch (mood) {
    case "focused":
      return { label: "Focused", gradient: "from-fuchsia-500/20 via-violet-500/10 to-cyan-400/20", ring: "ring-fuchsia-400/30", emoji: "🦊" };
    case "celebrate":
      return { label: "Winning", gradient: "from-emerald-500/20 via-teal-400/10 to-cyan-400/20", ring: "ring-emerald-400/30", emoji: "✨" };
    case "coach":
      return { label: "Guiding", gradient: "from-amber-500/20 via-orange-400/10 to-yellow-300/20", ring: "ring-amber-400/30", emoji: "🧠" };
    default:
      return { label: "Warm", gradient: "from-sky-500/20 via-indigo-500/10 to-violet-400/20", ring: "ring-sky-400/30", emoji: "💫" };
  }
}

function getLatestPeriod(rows: TargetRow[]) {
  const latest = [...rows].sort((a, b) => b.year * 100 + b.month - (a.year * 100 + a.month))[0];
  return latest ? { month: latest.month, year: latest.year } : null;
}

function filterToLatestPeriod(rows: TargetRow[]) {
  const latest = getLatestPeriod(rows);
  if (!latest) return [] as TargetRow[];
  return rows.filter((row) => row.month === latest.month && row.year === latest.year);
}

function buildScopedContext(scopeMode: ScopeMode, activeEmployeeId: number, adminPersona: AdminPersona) {
  const activeEmployee = employees.find((e) => e.id === activeEmployeeId)!;
  let allowedEmployeeIds: number[];

  if (scopeMode === "STAFF") {
    allowedEmployeeIds = [activeEmployeeId];
  } else if (adminPersona === "STORE_MANAGER") {
    allowedEmployeeIds = employees.filter((e) => e.storeId === activeEmployee.storeId).map((e) => e.id);
  } else if (adminPersona === "BRAND_MANAGER") {
    allowedEmployeeIds = employees.filter((e) => e.brandId === activeEmployee.brandId).map((e) => e.id);
  } else {
    allowedEmployeeIds = employees.filter((e) => e.countryCode === activeEmployee.countryCode).map((e) => e.id);
  }

  const scopedTargets = targets.filter((row) => allowedEmployeeIds.includes(row.employeeId));
  const scopedAttendance = attendance.filter((row) => allowedEmployeeIds.includes(row.employeeId));
  const scopedSchedules = schedules.filter((row) => allowedEmployeeIds.includes(row.employeeId));
  const scopedLeaveRequests = leaveRequests.filter((row) => allowedEmployeeIds.includes(row.employeeId));
  const scopedMemories = userProfileMemories.filter((row) => allowedEmployeeIds.includes(row.employeeId));
  const scopedHistoricalInsights = historicalInsights.filter((row) => allowedEmployeeIds.includes(row.employeeId));
  const allowedCodes = employees.filter((e) => allowedEmployeeIds.includes(e.id)).map((e) => e.employeeCode);
  const scopedSales = sales.filter((row) => allowedCodes.includes(row.employeeCode));
  return {
    scopedTargets,
    scopedAttendance,
    scopedSchedules,
    scopedLeaveRequests,
    scopedMemories,
    scopedHistoricalInsights,
    scopedSales,
    allowedEmployeeIds,
  };
}

function buildAggregateSalesScope(adminPersona: AdminPersona, activeEmployeeId: number): AggregateSalesScope {
  const activeEmployee = employees.find((e) => e.id === activeEmployeeId)!;

  const scopedEmployeeIds = adminPersona === "STORE_MANAGER"
    ? employees.filter((e) => e.storeId === activeEmployee.storeId).map((e) => e.id)
    : adminPersona === "BRAND_MANAGER"
    ? employees.filter((e) => e.brandId === activeEmployee.brandId).map((e) => e.id)
    : employees.filter((e) => e.countryCode === activeEmployee.countryCode).map((e) => e.id);

  const scopedTargets = filterToLatestPeriod(targets.filter((t) => scopedEmployeeIds.includes(t.employeeId)));
  const salesAmount = scopedTargets.reduce((sum, row) => sum + row.salesAmount, 0);
  const targetAmount = scopedTargets.reduce((sum, row) => sum + row.targetAmount, 0);

  return {
    salesAmount,
    targetAmount,
    achievementPct: targetAmount > 0 ? (salesAmount / targetAmount) * 100 : 0,
    label: adminPersona === "STORE_MANAGER"
      ? stores.find((s) => s.id === activeEmployee.storeId)?.name ?? "Store"
      : adminPersona === "BRAND_MANAGER"
      ? brands.find((b) => b.id === activeEmployee.brandId)?.name ?? "Brand"
      : countries.find((c) => c.code === activeEmployee.countryCode)?.name ?? "Country",
  };
}

function getAdaptiveProfile(employeeId: number) {
  const memory = userProfileMemories.find((item) => item.employeeId === employeeId);
  const insights = historicalInsights.filter((item) => item.employeeId === employeeId);
  return { memory, insights };
}

function buildHistoricalNarrative(employeeId: number) {
  const { memory, insights } = getAdaptiveProfile(employeeId);
  return {
    preferredTone: memory?.preferredTone ?? "clear and helpful",
    recurringGoals: memory?.recurringGoals ?? [],
    preferredFocusAreas: memory?.preferredFocusAreas ?? [],
    recentTopics: memory?.recentTopics ?? [],
    topInsights: insights.slice(0, 2).map((item) => item.text),
  };
}

function inferGoalMode(message: string, adaptiveProfile: ReturnType<typeof buildHistoricalNarrative>): GoalMode {
  const lower = message.toLowerCase();
  if (lower.includes("attendance") || lower.includes("late") || adaptiveProfile.preferredFocusAreas.includes("attendance")) {
    return "protect_attendance";
  }
  if (lower.includes("schedule") || lower.includes("swap") || lower.includes("leave")) {
    return "stabilize_schedule";
  }
  if (lower.includes("target") || adaptiveProfile.recurringGoals.includes("hit target")) {
    return "hit_target";
  }
  return "maximize_payout";
}

function buildGoalDrivenCoaching(params: {
  goalMode: GoalMode;
  ratio: number;
  gap: number;
  attendanceHealthScore: number;
  nextSchedule?: ScheduleRow;
}) {
  switch (params.goalMode) {
    case "protect_attendance":
      return `Because the current goal is attendance stability, I would prioritize punctuality, complete shift coverage, and avoiding avoidable short-shift flags before chasing aggressive sales uplift.`;
    case "stabilize_schedule":
      return `Because the current goal is schedule stability, I would resolve leave or swap uncertainty first so the rest of the week stays predictable and manageable.`;
    case "hit_target":
      return `Because the current goal is target completion, I would focus on closing the remaining ${formatMoney(params.gap)} through the most productive upcoming shift opportunities.`;
    default:
      return `Because the current goal is payout growth, I would focus on actions most likely to move you into a stronger payout outcome rather than spreading effort too thinly.`;
  }
}

function getCategoryPerformanceForEmployee(employeeId: number) {
  const employee = employees.find((e) => e.id === employeeId);
  if (!employee) return [] as CategoryPerformance[];

  const rows = sales.filter((row) => row.employeeCode === employee.employeeCode);
  const grouped = new Map<string, CategoryPerformance>();

  rows.forEach((row) => {
    const current = grouped.get(row.category) ?? { category: row.category, salesAmount: 0, quantity: 0 };
    current.salesAmount += row.saleAmount;
    current.quantity += row.quantity;
    grouped.set(row.category, current);
  });

  return [...grouped.values()].sort((a, b) => b.salesAmount - a.salesAmount);
}

function getPreviousTargetRow(employeeId: number, currentRow?: TargetRow) {
  if (!currentRow) return undefined;

  return targets
    .filter((row) => row.employeeId === employeeId && (row.year * 100 + row.month) < (currentRow.year * 100 + currentRow.month))
    .sort((a, b) => b.year * 100 + b.month - (a.year * 100 + a.month))[0];
}

function explainCommissionChange(currentRow: TargetRow, previousRow?: TargetRow) {
  if (!previousRow) {
    return "I do not yet have an earlier comparison period loaded, so I can explain the current payout but not the change versus the previous period.";
  }

  const payoutDiff = currentRow.payout - previousRow.payout;
  const salesDiff = currentRow.salesAmount - previousRow.salesAmount;
  const achievementNow = currentRow.targetAmount > 0 ? (currentRow.salesAmount / currentRow.targetAmount) * 100 : 0;
  const achievementPrev = previousRow.targetAmount > 0 ? (previousRow.salesAmount / previousRow.targetAmount) * 100 : 0;

  if (payoutDiff >= 0) {
    return `Your payout is not lower than the previous period. It moved by ${formatMoney(payoutDiff)} while sales moved by ${formatMoney(salesDiff)} and achievement changed from ${formatPct(achievementPrev)} to ${formatPct(achievementNow)}.`;
  }

  return `Your payout is lower by ${formatMoney(Math.abs(payoutDiff))}. The clearest reason is that sales moved by ${formatMoney(salesDiff)} and your achievement changed from ${formatPct(achievementPrev)} to ${formatPct(achievementNow)}, which likely kept you in a weaker payout outcome.`;
}

function buildStaffComparisonReply(targetEmployee: Employee, currentRow: TargetRow, previousRow?: TargetRow): AgentReply {
  if (!previousRow) {
    return {
      mood: "coach",
      text: `I can compare your current position clearly, but I do not yet have an earlier month loaded for a full comparison beyond the current target row. Right now ${targetEmployee.firstName} is at ${formatMoney(currentRow.salesAmount)} against ${formatMoney(currentRow.targetAmount)}, with ${formatMoney(currentRow.payout)} recorded as payout.`,
      chips: ["Explain my commission", "How far am I from target?", "Give me a suggestion"],
    };
  }

  const salesDiff = currentRow.salesAmount - previousRow.salesAmount;
  const payoutDiff = currentRow.payout - previousRow.payout;

  return {
    mood: "focused",
    text: `Compared with the previous period, ${targetEmployee.firstName} has ${salesDiff >= 0 ? `increased sales by ${formatMoney(salesDiff)}` : `lower sales by ${formatMoney(Math.abs(salesDiff))}`}. Payout has ${payoutDiff >= 0 ? `improved by ${formatMoney(payoutDiff)}` : `dropped by ${formatMoney(Math.abs(payoutDiff))}`}. The most useful reading is not just the raw change, but whether the current month is moving you closer to a stronger payout band or not.`,
    chips: ["Why did my payout change?", "Show strongest category", "Give me a suggestion"],
    bullets: [
      `Current sales: ${formatMoney(currentRow.salesAmount)}`,
      `Previous sales: ${formatMoney(previousRow.salesAmount)}`,
      `Current payout: ${formatMoney(currentRow.payout)}`,
      `Previous payout: ${formatMoney(previousRow.payout)}`,
    ],
  };
}

function buildCategoryReply(targetEmployee: Employee, categoryRows: CategoryPerformance[]): AgentReply {
  if (!categoryRows.length) {
    return {
      mood: "coach",
      text: `I do not yet have category-level sales rows for ${targetEmployee.firstName}, so I cannot rank strongest or weakest categories properly yet. Once live category sales are connected, I can show what you sell best and where more coaching is needed.`,
      chips: ["Explain my commission", "Give me a suggestion", "How far am I from target?"],
    };
  }

  const strongest = categoryRows[0];
  const weakest = categoryRows[categoryRows.length - 1];

  return {
    mood: "focused",
    text: `${targetEmployee.firstName}'s strongest visible category is ${strongest.category} at ${formatMoney(strongest.salesAmount)} across ${strongest.quantity} units. The weakest visible category is ${weakest.category} at ${formatMoney(weakest.salesAmount)} across ${weakest.quantity} units. The practical next move is to protect your strength first, then decide whether the weaker category needs more attention or simply lower priority.`,
    chips: ["Show strongest category", "Show weakest category", "What should I focus on next?"],
    bullets: categoryRows.map((row) => `${row.category}: ${formatMoney(row.salesAmount)} from ${row.quantity} units`),
  };
}

function buildTimeAwareBriefing(nowLabel: string, nextSchedule?: ScheduleRow) {
  if (!nextSchedule) return `${nowLabel} briefing: no next scheduled shift is loaded yet, so I would start by confirming the roster before making a coaching call.`;
  if (nextSchedule.shiftName.toLowerCase().includes("opening")) {
    return `${nowLabel} briefing: opening shifts are best used to build early momentum and set a strong first-hour pace.`;
  }
  if (nextSchedule.shiftName.toLowerCase().includes("closing")) {
    return `${nowLabel} briefing: closing shifts usually benefit from focused upsell timing and strong end-of-day conversion discipline.`;
  }
  if (nextSchedule.shiftName.toLowerCase().includes("weekend")) {
    return `${nowLabel} briefing: weekend peak shifts usually carry better commercial upside, so preparation matters more here.`;
  }
  return `${nowLabel} briefing: keep the next shift structured around the strongest commercial opportunities first.`;
}

function buildWorkflowCards(scopeMode: ScopeMode, activeEmployeeId: number): RequestWorkflowAction[] {
  const ownRequests = leaveRequests.filter((row) => row.employeeId === activeEmployeeId);
  if (scopeMode === "STAFF") {
    return [
      {
        id: "staff-medical",
        title: "Apply medical leave",
        description: "Prefill the next shift and prepare a medical leave draft with minimal input.",
        status: ownRequests.find((r) => r.type === "Medical Leave")?.status ?? "Ready",
        primaryAction: "Start medical leave",
        secondaryAction: "Use next shift",
      },
      {
        id: "staff-swap",
        title: "Request shift swap",
        description: "Use the next scheduled shift, suggest a candidate, and draft the request reason.",
        status: ownRequests.find((r) => r.type === "Shift Swap")?.status ?? "Ready",
        primaryAction: "Create swap request",
        secondaryAction: "Suggest colleague",
      },
      {
        id: "staff-annual",
        title: "Apply annual leave",
        description: "Create a leave draft and route it for approval.",
        status: ownRequests.find((r) => r.type === "Annual Leave")?.status ?? "Ready",
        primaryAction: "Start annual leave",
      },
    ];
  }

  return [
    {
      id: "admin-approvals",
      title: "Approvals inbox",
      description: "Review pending leave and swap requests that need admin action.",
      status: leaveRequests.some((r) => r.status === "Pending") ? "Pending" : "Ready",
      primaryAction: "Review approvals",
      secondaryAction: "Open watchlist",
    },
    {
      id: "admin-support",
      title: "Support watchlist",
      description: "See who may need attendance, shift, or performance intervention today.",
      status: "Ready",
      primaryAction: "Open watchlist",
      secondaryAction: "See risk reasons",
    },
    {
      id: "admin-coverage",
      title: "Coverage gaps",
      description: "Identify gaps from leave, swaps, and roster risk in the active scope.",
      status: "Ready",
      primaryAction: "Check coverage",
    },
  ];
}

function buildSupportWatchlist(scopeMode: ScopeMode, allowedEmployeeIds: number[]) {
  if (scopeMode !== "ADMIN") return [] as Array<{ name: string; reason: string; priority: string }>;

  const scopedCurrentTargets = filterToLatestPeriod(targets.filter((t) => allowedEmployeeIds.includes(t.employeeId)));

  const rows = allowedEmployeeIds.map((employeeId) => {
    const employee = employees.find((e) => e.id === employeeId)!;
    const employeeTarget = scopedCurrentTargets.find((t) => t.employeeId === employeeId);
    const employeeAttendanceRows = attendance.filter((a) => a.employeeId === employeeId);
    const lateCount = employeeAttendanceRows.filter((a) => a.checkInTime > "09:00:00").length;
    const ratio = employeeTarget && employeeTarget.targetAmount > 0 ? (employeeTarget.salesAmount / employeeTarget.targetAmount) * 100 : 0;
    const reason = ratio > 0 && ratio < 90
      ? "Below strong target pace and may need focused support."
      : lateCount > 0
      ? "Performance is acceptable but attendance risk is appearing."
      : ratio >= 90
      ? "Commercial momentum looks healthy, but keep monitoring consistency."
      : "No current-period performance row is loaded yet, so this person may need a data or roster check.";
    const priority = ratio > 0 && (ratio < 90 || lateCount > 1) ? "High" : lateCount === 1 ? "Medium" : "Low";
    const priorityWeight = priority === "High" ? 3 : priority === "Medium" ? 2 : 1;
    return { name: employee.firstName, reason, priority, priorityWeight, ratio };
  });

  return rows
    .sort((a, b) => b.priorityWeight - a.priorityWeight || a.ratio - b.ratio)
    .slice(0, 5)
    .map(({ name, reason, priority }) => ({ name, reason, priority }));
}

function getAdminQuickActions(adminPersona: AdminPersona) {
  switch (adminPersona) {
    case "STORE_MANAGER":
      return ["Approvals inbox", "Coverage gaps", "Who needs coaching?", "Store team summary"] as const;
    case "BRAND_MANAGER":
      return ["Brand health", "Cross-store brand view", "Who needs coaching?", "Trend comparison"] as const;
    case "COUNTRY_MANAGER":
      return ["Country overview", "Store risk map", "Who needs coaching?", "Approval bottlenecks"] as const;
    default:
      return ["Team summary", "Approvals inbox", "Coverage gaps", "Support needed today"] as const;
  }
}

function getAdminBriefingLabel(adminPersona: AdminPersona) {
  switch (adminPersona) {
    case "STORE_MANAGER":
      return "Store Operations Briefing";
    case "BRAND_MANAGER":
      return "Brand Performance Briefing";
    case "COUNTRY_MANAGER":
      return "Country Leadership Briefing";
    default:
      return "Admin Operations Briefing";
  }
}

function buildDecisionOptions(params: {
  ratio: number;
  gap: number;
  attendanceHealthScore: number;
  nextSchedule?: ScheduleRow;
  latestLeave?: LeaveRequest;
}) {
  const options: DecisionOption[] = [];

  options.push({
    label: "Focus on high-value selling next shift",
    score: Math.round((params.ratio < 100 ? 88 : 76) + (params.nextSchedule ? 4 : 0)),
    reason: params.gap > 0
      ? "you still have target gap to close, so the strongest commercial move is to use the next shift for deliberate, higher-conversion selling"
      : "you are already above target, so the next shift can still be used to strengthen payout quality and margin",
  });

  options.push({
    label: "Protect attendance consistency first",
    score: Math.round(params.attendanceHealthScore < 75 ? 84 : 58),
    reason: params.attendanceHealthScore < 75
      ? "your attendance pattern shows some risk, so improving punctuality and shift stability may have a strong downstream effect on performance"
      : "attendance looks relatively stable right now, so this is useful but not the most urgent move",
  });

  options.push({
    label: "Request leave or shift swap if needed",
    score: Math.round(params.latestLeave?.status === "Pending" ? 74 : 62),
    reason: params.latestLeave?.status === "Pending"
      ? "you already have a pending leave-related request, so keeping your schedule situation clear matters before planning performance moves"
      : "this becomes the right option only if you genuinely cannot attend the next shift or need schedule flexibility",
  });

  return options.sort((a, b) => b.score - a.score);
}

function buildFallbackReply(params: {
  employeeName: string;
  ratio: number;
  salesAmount: number;
  targetAmount: number;
  nextSchedule?: ScheduleRow;
  attendanceHealthScore: number;
}): AgentReply {
  const nextShiftLine = params.nextSchedule
    ? `Your next shift is ${params.nextSchedule.shiftName} on ${params.nextSchedule.date} from ${params.nextSchedule.startTime} to ${params.nextSchedule.endTime}.`
    : "I do not have a next scheduled shift loaded yet.";

  return {
    mood: "warm",
    text: `I can still help from what I already know. ${params.employeeName} is currently at ${formatMoney(params.salesAmount)} against a target of ${formatMoney(params.targetAmount)}, which is ${formatPct(params.ratio)} achievement. ${nextShiftLine} Your attendance health is ${params.attendanceHealthScore}/100. Try asking me something more specific like “give me a suggestion for my next shift”, “how should I improve my attendance”, “should I request a shift swap”, or “what is the best move to improve my payout?”`,
    chips: ["Give me a suggestion", "What should I do next shift?", "Should I request a shift swap?"],
    followUps: [
      "Do you want advice for performance, schedule, or attendance first?",
      "Should I focus on your next shift or your payout target?"
    ]
  };
}

function buildAdminFallbackReply(params: {
  adminPersona: AdminPersona;
  aggregateSalesScope: AggregateSalesScope;
  pendingRequests: number;
  riskFlags: number;
}): AgentReply {
  const scopeLabel = params.aggregateSalesScope.label;
  const personaLabel = params.adminPersona.replaceAll("_", " ").toLowerCase();
  return {
    mood: "warm",
    text: `From the current ${personaLabel} view, ${scopeLabel} is at ${formatMoney(params.aggregateSalesScope.salesAmount)} against ${formatMoney(params.aggregateSalesScope.targetAmount)}, which is ${formatPct(params.aggregateSalesScope.achievementPct)} achievement. Commercially, that gives you the headline. Operationally, the more important issue is that there are ${params.pendingRequests} pending request(s) and ${params.riskFlags} risk flag(s) in scope. My recommendation is to review the watchlist first if you want to protect momentum, or open approvals first if you want to reduce workflow friction.`,
    chips: ["Review support watchlist", "Open approvals inbox", "Compare against last period"],
    bullets: [
      `Scope: ${scopeLabel}`,
      `Performance: ${formatPct(params.aggregateSalesScope.achievementPct)} achievement`,
      `Operational pressure: ${params.pendingRequests} pending request(s), ${params.riskFlags} risk flag(s)`,
      "Management focus: performance, risk, then next action"
    ],
    followUps: [
      "Do you want the performance view, risk view, or approvals view first?",
      "Should I summarise this scope in a more management-level way?"
    ]
  };
}

function buildAdminManagerialSummary(params: {
  adminPersona: AdminPersona;
  aggregateSalesScope: AggregateSalesScope;
  strongestPerformerName?: string;
  strongestAchievementPct?: number;
  strongestSales?: number;
  pendingRequests: number;
  riskFlags: number;
}): AgentReply {
  const personaLabel = params.adminPersona.replaceAll("_", " ").toLowerCase();
  const strongestLine = params.strongestPerformerName && typeof params.strongestAchievementPct === "number" && typeof params.strongestSales === "number"
    ? `The strongest visible performer is ${params.strongestPerformerName} at ${formatPct(params.strongestAchievementPct)} with ${formatMoney(params.strongestSales)} in sales.`
    : `I do not yet have enough ranked data to identify the strongest visible performer in this scope.`;
  const actionLine = params.riskFlags > 0 || params.pendingRequests > 0
    ? `My recommendation is to review the support watchlist first, then clear approvals that may affect continuity.`
    : `My recommendation is to compare this scope against the prior period and focus on scaling what is already working.`;

  return {
    mood: "celebrate",
    text: `In the current ${personaLabel} scope, ${params.aggregateSalesScope.label} is at ${formatMoney(params.aggregateSalesScope.salesAmount)} against ${formatMoney(params.aggregateSalesScope.targetAmount)}, which is ${formatPct(params.aggregateSalesScope.achievementPct)} achievement. ${strongestLine} Operationally, there are ${params.pendingRequests} pending request(s) and ${params.riskFlags} risk flag(s) in scope. ${actionLine}`,
    chips: ["Review support watchlist", "Open approvals inbox", "Compare against last period"],
    bullets: [
      `Scope: ${params.aggregateSalesScope.label}`,
      `Headline performance: ${formatPct(params.aggregateSalesScope.achievementPct)} achievement`,
      `Workflow load: ${params.pendingRequests} pending request(s)`,
      `Risk pressure: ${params.riskFlags} flag(s)`
    ],
    followUps: [
      "Do you want the performance view, risk view, or approvals view first?",
      "Should I turn this into a short management summary?"
    ]
  };
}

function buildRankingReply(scopeMode: ScopeMode, adminPersona: AdminPersona, currentScopedTargets: TargetRow[]): AgentReply {
  const ranked = currentScopedTargets
    .map((row) => {
      const emp = employees.find((e) => e.id === row.employeeId)!;
      const achievement = row.targetAmount > 0 ? (row.salesAmount / row.targetAmount) * 100 : 0;
      const gap = Math.max(row.targetAmount - row.salesAmount, 0);
      const attendanceRows = attendance.filter((a) => a.employeeId === row.employeeId);
      const lateFlags = attendanceRows.filter((a) => a.checkInTime > "09:00:00").length;
      return {
        ...row,
        firstName: emp.firstName,
        achievement,
        gap,
        lateFlags,
        tierName: getTierName(row.tierId),
      };
    })
    .sort((a, b) => b.achievement - a.achievement);

  if (scopeMode !== "ADMIN") {
    const activeRankIndex = ranked.findIndex((row) => row.employeeId === 1);
    const activeRow = ranked[activeRankIndex];
    const topThree = ranked.slice(0, 3);

    return {
      mood: "focused",
      text: activeRow
        ? `Your current position is #${activeRankIndex + 1} in the visible ranking. You are at ${formatPct(activeRow.achievement)} achievement with ${formatMoney(activeRow.salesAmount)} in sales and ${formatMoney(activeRow.payout)} in payout. For context, the current top 3 are ${topThree.map((row, idx) => `#${idx + 1} ${row.firstName} at ${formatMoney(row.salesAmount)}`).join(", ")}. In Staff Mode, I keep this lighter and do not expose the full detailed ranking for everyone.`
        : `I do not have enough current-period ranking data to place you in the visible ranking yet.`,
      chips: ["How far am I from target?", "Explain my commission", "Give me a suggestion"],
      bullets: activeRow
        ? [
            `Your position: #${activeRankIndex + 1}`,
            `Your sales: ${formatMoney(activeRow.salesAmount)}`,
            `Your achievement: ${formatPct(activeRow.achievement)}`,
            `Your payout: ${formatMoney(activeRow.payout)}`,
            ...topThree.map((row, idx) => `Top ${idx + 1}: ${row.firstName} · ${formatMoney(row.salesAmount)}`),
          ]
        : ["No current-period ranking rows available"],
      followUps: [
        "Do you want to know how far you are from the person above you?",
        "Should I show what would help improve your ranking?"
      ]
    };
  }

  const topThree = ranked.slice(0, 3);
  const detailedRows = ranked.slice(0, 5);

  const summaryLine = topThree.length
    ? topThree
        .map(
          (row, idx) => `${idx + 1}. ${row.firstName} — ${formatPct(row.achievement)} achievement, ${formatMoney(row.salesAmount)} sales, ${formatMoney(row.payout)} payout`
        )
        .join(" | ")
    : "I do not have enough current-period target rows to rank this scope yet.";

  return {
    mood: "focused",
    text: `Here is the current ranking for the ${adminPersona.replaceAll("_", " ").toLowerCase()} scope. ${summaryLine} I can use this to show who is leading, who is still chasing target, and who may need intervention next. Ranking should be read together with attendance, coverage, and support needs before making a management call.`,
    chips: ["Show support watchlist", "Show approvals", "How is this scope performing?", "Who needs coaching?"],
    bullets: detailedRows.length
      ? detailedRows.map(
          (row, idx) => `#${idx + 1} ${row.firstName} · ${formatMoney(row.salesAmount)} sales · ${formatMoney(row.targetAmount)} target · ${formatPct(row.achievement)} achievement · ${formatMoney(row.payout)} payout · ${row.tierName} · ${row.gap > 0 ? `${formatMoney(row.gap)} gap left` : "Above target"}${row.lateFlags > 0 ? ` · ${row.lateFlags} late flag(s)` : ""}`
        )
      : ["No current-period ranking rows available"],
    followUps: [
      "Do you want the top 3 only or the full ranked list?",
      "Should I point out who is leading versus who needs support?"
    ]
  };
}

function buildAdminComparisonReply(params: {
  adminPersona: AdminPersona;
  aggregateSalesScope: AggregateSalesScope;
  currentRows: TargetRow[];
  previousRows: TargetRow[];
}) {
  const currentSales = params.currentRows.reduce((sum, row) => sum + row.salesAmount, 0);
  const previousSales = params.previousRows.reduce((sum, row) => sum + row.salesAmount, 0);
  const currentTarget = params.currentRows.reduce((sum, row) => sum + row.targetAmount, 0);
  const previousTarget = params.previousRows.reduce((sum, row) => sum + row.targetAmount, 0);
  const salesDiff = currentSales - previousSales;
  const currentAchievement = currentTarget > 0 ? (currentSales / currentTarget) * 100 : 0;
  const previousAchievement = previousTarget > 0 ? (previousSales / previousTarget) * 100 : 0;

  if (!params.previousRows.length) {
    return {
      mood: "focused",
      text: `I can summarise the current ${params.adminPersona.replaceAll("_", " ").toLowerCase()} scope clearly, but I do not yet have an earlier scoped period loaded for a true month-on-month comparison. Right now ${params.aggregateSalesScope.label} is at ${formatMoney(currentSales)} against ${formatMoney(currentTarget)}, which is ${formatPct(currentAchievement)} achievement. The next best move is to compare this with risk, approvals, and coaching needs so the current result becomes operationally useful.`,
      chips: ["Show approvals", "Who needs coaching?", "How is this scope performing?"],
      bullets: [
        `Current sales: ${formatMoney(currentSales)}`,
        `Current target: ${formatMoney(currentTarget)}`,
        `Current achievement: ${formatPct(currentAchievement)}`,
        "No earlier scoped period available in sample data"
      ],
    } satisfies AgentReply;
  }

  return {
    mood: "focused",
    text: `For the current ${params.adminPersona.replaceAll("_", " ").toLowerCase()} scope, ${params.aggregateSalesScope.label} is at ${formatMoney(currentSales)} this period versus ${formatMoney(previousSales)} in the previous period. Achievement moved from ${formatPct(previousAchievement)} to ${formatPct(currentAchievement)}. ${salesDiff >= 0 ? `That is an improvement of ${formatMoney(salesDiff)} in sales.` : `That is a decline of ${formatMoney(Math.abs(salesDiff))} in sales.`} The management question is not just whether sales moved, but whether the change is sustainable or being masked by risk and coverage pressure.`,
    chips: ["Show approvals", "Who needs coaching?", "Which product categories are driving the most commission?"],
    bullets: [
      `Current sales: ${formatMoney(currentSales)}`,
      `Previous sales: ${formatMoney(previousSales)}`,
      `Current achievement: ${formatPct(currentAchievement)}`,
      `Previous achievement: ${formatPct(previousAchievement)}`,
    ],
  } satisfies AgentReply;
}

function buildAdminOperationalReply(params: {
  adminPersona: AdminPersona;
  aggregateSalesScope: AggregateSalesScope;
  pendingRequests: number;
  riskFlags: number;
  scheduledShifts: number;
}) {
  return {
    mood: "focused",
    text: `Operationally, the current ${params.adminPersona.replaceAll("_", " ").toLowerCase()} scope shows ${params.scheduledShifts} scheduled shifts, ${params.pendingRequests} pending approval item(s), and ${params.riskFlags} active risk flag(s). The most likely issues affecting conversion are staffing friction, attendance instability, and unresolved requests that may affect floor coverage. Commercial performance in ${params.aggregateSalesScope.label} may still look healthy, but operational drag can reduce consistency if it is left alone.`,
    chips: ["Show approvals", "Show support watchlist", "How is this scope performing?"],
    bullets: [
      `Scheduled shifts: ${params.scheduledShifts}`,
      `Pending approvals: ${params.pendingRequests}`,
      `Risk flags: ${params.riskFlags}`,
      `Scope: ${params.aggregateSalesScope.label}`,
    ],
  } satisfies AgentReply;
}

function buildAdminCoachingReply(params: {
  adminPersona: AdminPersona;
  currentRows: TargetRow[];
  allowedEmployeeIds: number[];
}) {
  const ranked = params.allowedEmployeeIds.map((employeeId) => {
    const employee = employees.find((e) => e.id === employeeId)!;
    const targetRow = params.currentRows.find((row) => row.employeeId === employeeId);
    const ratio = targetRow && targetRow.targetAmount > 0 ? (targetRow.salesAmount / targetRow.targetAmount) * 100 : 0;
    const lateCount = attendance.filter((row) => row.employeeId === employeeId && row.checkInTime > "09:00:00").length;
    return { name: employee.firstName, ratio, lateCount };
  }).sort((a, b) => a.ratio - b.ratio);

  const needsCoaching = ranked.slice(0, 3);
  return {
    mood: "focused",
    text: `For the current ${params.adminPersona.replaceAll("_", " ").toLowerCase()} scope, the clearest coaching candidates are ${needsCoaching.map((item) => item.name).join(", ")}. They are either pacing below target, showing attendance friction, or both. The best management move is to coach the lowest-paced names first, then separate skill issues from roster or attendance issues so the intervention is fair and practical.`,
    chips: ["Show support watchlist", "Show approvals", "Rank the team"],
    bullets: needsCoaching.map((item) => `${item.name}: ${formatPct(item.ratio)} achievement, ${item.lateCount} late flag(s)`),
  } satisfies AgentReply;
}

function buildAdminCategoryReply(params: {
  aggregateSalesScope: AggregateSalesScope;
  scopedSales: SaleRow[];
}) {
  const grouped = new Map<string, number>();
  params.scopedSales.forEach((row) => {
    grouped.set(row.category, (grouped.get(row.category) ?? 0) + row.saleAmount);
  });
  const ranked = [...grouped.entries()].sort((a, b) => b[1] - a[1]);
  const top = ranked.slice(0, 3);
  return {
    mood: "focused",
    text: `In ${params.aggregateSalesScope.label}, the categories currently driving the most visible sales value are ${top.map(([name]) => name).join(", ") || "not yet available"}. This helps explain where commercial energy is coming from, but this demo is still reading category sales value rather than true category-level commission attribution. It should be read together with conversion, staffing, and coverage before making management decisions.`,
    chips: ["How is this scope performing?", "Who needs coaching?", "Compare against last period"],
    bullets: top.length ? top.map(([name, value]) => `${name}: ${formatMoney(value)}`) : ["No scoped sales rows available"],
  } satisfies AgentReply;
}

function getDecisionConfidence(options: DecisionOption[]) {
  if (options.length < 2) return 78;
  const gap = options[0].score - options[1].score;
  return Math.max(55, Math.min(96, 65 + gap * 3));
}

function buildAlternatives(options: DecisionOption[]): AlternativeOption[] {
  return options.slice(1, 3).map((option) => ({
    label: option.label,
    pros: [
      `Potential value: ${option.reason}`,
      "Keeps another practical route open if your day changes"
    ],
    cons: [
      "Not the highest-ranked move right now",
      "May create a weaker immediate impact than the top recommendation"
    ]
  }));
}

function buildResponse(message: string, scopeMode: ScopeMode, activeEmployeeId: number, adminPersona: AdminPersona): AgentReply {
  const resolvedIntent = resolveIntentFromDictionary(message, scopeMode);
  const intent = resolvedIntent.legacyIntent;
  const responseMode = resolveResponseMode(resolvedIntent.returnType);
  const mood = mascotFromIntent(intent);
  const context = buildScopedContext(scopeMode, activeEmployeeId, adminPersona);
  const activeEmployee = employees.find((e) => e.id === activeEmployeeId)!;
  const askedEmployee = getMentionedEmployee(message);
  const targetEmployee = scopeMode === "STAFF" ? activeEmployee : askedEmployee ?? activeEmployee;

  if (scopeMode === "STAFF" && askedEmployee && askedEmployee.id !== activeEmployeeId) {
    return {
      mood,
      text: `I can only work within your personal scope in Staff Mode. Right now I’m limited to ${activeEmployee.firstName}'s own records, so I can help with your schedule, attendance, commission, leave needs, and next best actions without exposing another colleague's details.`,
      chips: ["Show my progress", "Project my payout", "Review my attendance"],
    };
  }

  const targetRow = context.scopedTargets
    .filter((row) => row.employeeId === targetEmployee.id)
    .sort((a, b) => b.year * 100 + b.month - (a.year * 100 + a.month))[0];

  const employeeAttendance = context.scopedAttendance.filter((row) => row.employeeId === targetEmployee.id);
  const employeeSchedules = context.scopedSchedules.filter((row) => row.employeeId === targetEmployee.id);
  const employeeLeaves = context.scopedLeaveRequests.filter((row) => row.employeeId === targetEmployee.id);
  const avgHours = employeeAttendance.length ? employeeAttendance.reduce((sum, row) => sum + row.workingHours, 0) / employeeAttendance.length : 0;
  const latestAttendance = [...employeeAttendance].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
  const nextSchedule = [...employeeSchedules].filter((row) => row.status === "Scheduled").sort((a, b) => a.date.localeCompare(b.date))[0];
  const weeklyRoster = [...employeeSchedules].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 7);
  const latestLeave = [...employeeLeaves].sort((a, b) => a.date.localeCompare(b.date))[0];
  const lateFlags = employeeAttendance.filter((row) => row.checkInTime > "09:00:00").length;
  const shortShiftFlags = employeeAttendance.filter((row) => row.workingHours < 7).length;
  const attendanceHealthScore = Math.max(35, Math.min(100, Math.round(100 - lateFlags * 8 - shortShiftFlags * 10 + avgHours)));
  const currentScopedTargets = filterToLatestPeriod(context.scopedTargets);
  const teamSales = currentScopedTargets.reduce((sum, row) => sum + row.salesAmount, 0);

  if (!targetRow) {
    return {
      mood,
      text: `I don't have an active target record for ${targetEmployee.firstName} in the current scoped dataset yet. Even so, I can still support things like schedule visibility, attendance summaries, leave requests, and shift-swap guidance as soon as those records are connected live.`,
      chips: ["Show my weekly roster", "How is my attendance?", "Can I apply for leave?"],
    };
  }

  const ratio = targetRow.targetAmount > 0 ? (targetRow.salesAmount / targetRow.targetAmount) * 100 : 0;
  const gap = Math.max(targetRow.targetAmount - targetRow.salesAmount, 0);
  const shiftCoaching = nextSchedule
    ? `Because your next shift is ${nextSchedule.shiftName.toLowerCase()} on ${nextSchedule.date}, I would focus on ${ratio >= 100 ? "protecting momentum and pushing for higher-ticket wins" : "high-probability closes early in the shift so you build confidence and pace quickly"}.`
    : `Once your next shift is loaded, I can tailor a more precise coaching prompt around timing, shift type, and target pressure.`;
  const adaptiveProfile = buildHistoricalNarrative(targetEmployee.id);
  const categoryRows = getCategoryPerformanceForEmployee(targetEmployee.id);
  const previousTargetRow = getPreviousTargetRow(targetEmployee.id, targetRow);
  const decisionOptions = buildDecisionOptions({ ratio, gap, attendanceHealthScore, nextSchedule, latestLeave });
  const aggregateSalesScope = buildAggregateSalesScope(adminPersona, activeEmployeeId);
  const adminRiskFlags = context.scopedAttendance.filter((row) => row.checkInTime > "09:00:00" || row.workingHours < 7).length;
  const adminPendingRequests = context.scopedLeaveRequests.filter((row) => row.status === "Pending").length;
  const currentPeriod = getLatestPeriod(context.scopedTargets);
  const previousScopedTargets = currentPeriod
    ? context.scopedTargets.filter((row) => row.year * 100 + row.month < currentPeriod.year * 100 + currentPeriod.month)
    : [];
  const previousPeriod = getLatestPeriod(previousScopedTargets);
  const previousScopedPeriodRows = previousPeriod
    ? previousScopedTargets.filter((row) => row.year === previousPeriod.year && row.month === previousPeriod.month)
    : [];
  const requestedValueGoal = resolvedIntent.entities.valueGoal ?? extractExtraSalesAmount(message);

  if (resolvedIntent.masterIntent === "staff_policy_faq" || resolvedIntent.masterIntent === "admin_policy_faq" || intent === "help") {
    if (scopeMode === "ADMIN") {
      return {
        mood: "warm",
        text: `You are in ${adminPersona.replaceAll("_", " ")} mode. The simplest way to use Seyalla here is to ask about performance, approvals, risks, support priorities, or coverage. You do not need perfect wording. For example, you can ask “how is this scope performing”, “show approvals”, “who needs support today”, or “rank the team”. I will answer from the allowed ${aggregateSalesScope.label} scope, not from one individual user only.`,
        chips: ["How is this scope performing?", "Show approvals", "Who needs support today?", "Rank the team"],
        bullets: [
          `Current admin scope: ${aggregateSalesScope.label}`,
          "Admin scope is derived from the selected persona plus the selected demo user",
          `Response mode right now: ${responseMode}`,
          "Best for managers: performance, risk, approvals, support, ranking",
        ],
      };
    }

    return {
      mood: "warm",
      text: `You are in Staff Mode. The easiest way to use Seyalla is to ask about your own commission, target gap, next shift, attendance, leave, or what you should focus on today. You do not need to know the exact feature names. For example, you can ask “how far am I from target”, “when is my next shift”, “review my attendance”, or “help me apply for leave”.`,
      chips: ["How far am I from target?", "When is my next shift?", "Review my attendance", "Help me apply for leave"],
      bullets: [
        `Response mode right now: ${responseMode}`,
        "Best for staff: explanation, coaching, self-service, work requests",
        "Personal scope only: your own records and workflows",
      ],
    };
  }

  if (resolvedIntent.masterIntent === "staff_sales_performance" || resolvedIntent.masterIntent === "shared_performance_query" || intent === "sales_overview") {
    if (scopeMode === "ADMIN") {
      return {
        mood: "focused",
        text: `${aggregateSalesScope.label} is currently at ${formatMoney(aggregateSalesScope.salesAmount)} against ${formatMoney(aggregateSalesScope.targetAmount)}, which is ${formatPct(aggregateSalesScope.achievementPct)} achievement. That is the clean sales headline for the current ${adminPersona.replaceAll("_", " ").toLowerCase()} scope. If you want the management version next, I can break this into performance, risk, and action.`,
        chips: ["How is this scope performing?", "Show approvals", "Who needs support today?"],
        bullets: [
          `Scope: ${aggregateSalesScope.label}`,
          `Sales: ${formatMoney(aggregateSalesScope.salesAmount)}`,
          `Target: ${formatMoney(aggregateSalesScope.targetAmount)}`,
          `Achievement: ${formatPct(aggregateSalesScope.achievementPct)}`,
        ],
      };
    }

    return {
      mood: "focused",
      text: `${targetEmployee.firstName} is currently at ${formatMoney(targetRow.salesAmount)} against a target of ${formatMoney(targetRow.targetAmount)}, which is ${formatPct(ratio)} achievement. Your current recorded payout is ${formatMoney(targetRow.payout)}. If you want, I can explain what is helping your sales, what is slowing you down, or what you should focus on next.`,
      chips: ["Explain my commission", "How far am I from target?", "Give me a suggestion"],
      bullets: [
        `Sales: ${formatMoney(targetRow.salesAmount)}`,
        `Target: ${formatMoney(targetRow.targetAmount)}`,
        `Achievement: ${formatPct(ratio)}`,
        `Payout: ${formatMoney(targetRow.payout)}`,
      ],
    };
  }

  if (intent === "ranking") {
    return buildRankingReply(scopeMode, adminPersona, currentScopedTargets);
  }

  if (intent === "category_performance") {
    return buildCategoryReply(targetEmployee, categoryRows);
  }

  if (resolvedIntent.masterIntent === "staff_historical_comparison" || resolvedIntent.masterIntent === "shared_comparison_query" || intent === "performance_comparison") {
    return buildStaffComparisonReply(targetEmployee, targetRow, previousTargetRow);
  }

  if (resolvedIntent.masterIntent === "staff_commission_breakdown" || resolvedIntent.masterIntent === "shared_explanation_query" || intent === "commission_change") {
    return {
      mood: "coach",
      text: `${explainCommissionChange(targetRow, previousTargetRow)} ${gap > 0 ? `You also still have ${formatMoney(gap)} left to close against target, which means part of the answer is not just payout logic, but also remaining selling opportunity.` : `You are not behind target right now, so the explanation is more about tier shape and timing than raw underperformance.`}`,
      chips: ["Compare my performance to last month", "Show strongest category", "Give me a suggestion"],
      bullets: [
        `Current plan: ${getTierName(targetRow.tierId)}`,
        `Current payout: ${formatMoney(targetRow.payout)}`,
        ...(previousTargetRow ? [`Previous payout: ${formatMoney(previousTargetRow.payout)}`] : []),
      ],
    };
  }

  if (resolvedIntent.masterIntent === "staff_goal_coaching" || intent === "earn_more") {
    const desiredExtraPayout = requestedValueGoal;
    const estimate = estimateSalesNeededForExtraPayout({
      tierId: targetRow.tierId,
      currentSales: targetRow.salesAmount,
      targetAmount: targetRow.targetAmount,
      currentPayout: targetRow.payout,
      desiredExtraPayout,
      teamSalesAmount: teamSales,
    });

    if (!estimate.reachable) {
      return {
        mood: "focused",
        text: `I get what you mean — you want to earn about ${formatMoney(desiredExtraPayout)} more. Based on your current tier logic for ${getTierName(targetRow.tierId)}, I do not see a clean path in this sample data to increase your payout by that amount with only a small sales lift. That usually means the payout changes in bigger steps or you are already sitting in a band where the next meaningful jump needs a stronger trigger. The smarter move now is to aim for the next real payout change instead of assuming a small increase will add exactly ${formatMoney(desiredExtraPayout)}.`,
        chips: ["Give me the next best option", "How much more sales changes my payout?", "Explain my tier"],
        bullets: [
          `Current payout: ${formatMoney(targetRow.payout)}`,
          `Desired uplift: ${formatMoney(desiredExtraPayout)}`,
          `Tier plan: ${getTierName(targetRow.tierId)}`,
        ],
        confidence: 82,
      };
    }

    return {
      mood: "focused",
      text: `Got it — you want to earn around ${formatMoney(desiredExtraPayout)} more. Based on the current payout rule, you would likely need about ${formatMoney(estimate.extraSalesNeeded ?? 0)} in extra sales to move from ${formatMoney(targetRow.payout)} to around ${formatMoney(estimate.projectedPayout ?? targetRow.payout)}. That would bring your projected sales to about ${formatMoney(estimate.projectedSales ?? targetRow.salesAmount)}. So yes, it looks achievable here, but it needs a real sales push rather than just a very small uplift.`,
      chips: ["Turn this into a shift plan", "What should I focus on next shift?", "Give me a suggestion"],
      bullets: [
        `Current payout: ${formatMoney(targetRow.payout)}`,
        `Target uplift: ${formatMoney(desiredExtraPayout)}`,
        `Estimated extra sales needed: ${formatMoney(estimate.extraSalesNeeded ?? 0)}`,
        `Projected payout: ${formatMoney(estimate.projectedPayout ?? targetRow.payout)}`,
      ],
      confidence: 86,
      followUps: [
        "Do you want me to turn that into a practical target for your next shift?",
        "Should I suggest the fastest way to aim for that extra payout?",
      ],
    };
  }

  if (intent === "projection") {
    const extraSales = requestedValueGoal;
    const projectedSales = targetRow.salesAmount + extraSales;
    const projectedPayout = calculatePayout(targetRow.tierId, projectedSales, targetRow.targetAmount, teamSales + extraSales);
    const uplift = projectedPayout - targetRow.payout;

    return {
      mood,
      text: `${targetEmployee.firstName} is currently at ${formatMoney(targetRow.salesAmount)} against a target of ${formatMoney(targetRow.targetAmount)}, which is ${formatPct(ratio)} achievement. If ${formatMoney(extraSales)} in additional sales is closed, projected sales move to ${formatMoney(projectedSales)} and the estimated payout becomes ${formatMoney(projectedPayout)}. That is a likely uplift of ${formatMoney(Math.max(uplift, 0))}${uplift < 0 ? ", which suggests no extra payout benefit under the current rule" : " under the current tier logic"}.`,
      chips: ["Add SGD 5,000", "Add SGD 10,000", "What tier am I in?"],
    };
  }

  if (resolvedIntent.masterIntent === "staff_commission_summary" || intent === "commission") {
    const recalculated = calculatePayout(targetRow.tierId, targetRow.salesAmount, targetRow.targetAmount, teamSales);
    const ratioLabel = formatPct(ratio);
    const tierName = getTierName(targetRow.tierId);
    const planType = tiers.find((t) => t.id === targetRow.tierId)?.category ?? "INDIVIDUAL";

    const commissionTypeExplanation = planType === "TEAM"
      ? "This is a team-based commission type, which means payout depends more on combined team sales performance than on your own sales alone."
      : tierName.toLowerCase().includes("fixed")
      ? "This is a fixed-trigger commission type, which means payout usually jumps when you cross a defined achievement threshold."
      : tierName.toLowerCase().includes("elite") || tierName.toLowerCase().includes("strong")
      ? "This is a milestone-style commission type, which means payout changes more meaningfully when you enter stronger achievement bands."
      : "This is a progressive commission type, which means payout usually grows as your sales and target achievement increase.";

    const whyCurrentPayout = ratio >= 150 && targetRow.tierId === 7
      ? "Because you are already above 150% achievement, you are currently sitting in the top visible payout trigger for this plan in the sample data."
      : ratio >= 120
      ? "Because you are already in a strong achievement range, payout is being supported by a higher-performing band rather than a low starter band."
      : ratio >= 100
      ? "Because you are above target, you are already in a paying range, but the next payout improvement may still require a bigger trigger depending on the plan."
      : "Because you are still below full target, payout is either limited or more sensitive to the next achievement threshold.";

    return {
      mood,
      text: `${targetEmployee.firstName}, here is your commission in a clearer way. You are on the ${tierName} plan, and that is a ${planType === "TEAM" ? "team-based" : "personal"} commission structure. ${commissionTypeExplanation} Right now your sales are ${formatMoney(targetRow.salesAmount)} against a target of ${formatMoney(targetRow.targetAmount)}, which puts you at ${ratioLabel}. Your current recorded payout is ${formatMoney(targetRow.payout)}, and the rule-based estimate from the logic is ${formatMoney(recalculated)}. ${whyCurrentPayout}`,
      chips: ["Explain my tier", "How do I earn more?", "Compare my performance to last month"],
      bullets: [
        `Commission plan: ${tierName}`,
        `Commission type: ${planType === "TEAM" ? "Team-based" : "Personal / individual"}`,
        `Sales: ${formatMoney(targetRow.salesAmount)}`,
        `Target: ${formatMoney(targetRow.targetAmount)}`,
        `Achievement: ${ratioLabel}`,
        `Current payout: ${formatMoney(targetRow.payout)}`,
        `Rule-based estimate: ${formatMoney(recalculated)}`,
      ],
      followUps: [
        "Do you want me to explain your tier in simple terms?",
        "Should I show what would need to change for your payout to move higher?",
      ],
    };
  }

  if (resolvedIntent.masterIntent === "staff_target_progress" || resolvedIntent.masterIntent === "shared_target_query" || intent === "target_progress") {
    return {
      mood,
      text: `${targetEmployee.firstName} has reached ${formatPct(ratio)} of target, with ${formatMoney(targetRow.salesAmount)} achieved from ${formatMoney(targetRow.targetAmount)}. The remaining gap is ${formatMoney(gap)}. You are not in a bad spot, but the smarter move now is not just to chase volume blindly. It is to focus on the type of sales that move you into a better payout outcome. ${shiftCoaching}`,
      chips: ["How much left?", "Project closing the gap", "Give me a shift-based plan"],
    };
  }

  if (resolvedIntent.masterIntent === "staff_attendance_issue" || intent === "attendance") {
    const attendanceStatus = latestAttendance
      ? `${targetEmployee.firstName}'s latest attendance record shows check-in at ${latestAttendance.checkInTime}, check-out at ${latestAttendance.checkOutTime}, with ${latestAttendance.workingHours.toFixed(2)} working hours on ${latestAttendance.date}.`
      : `I do not have a recent attendance entry for ${targetEmployee.firstName} yet.`;

    return {
      mood,
      text: `${attendanceStatus} Across the scoped records, average working time is ${avgHours.toFixed(2)} hours. Your attendance health score is ${attendanceHealthScore}/100, which reflects punctuality and shift consistency rather than sales performance itself. Right now I can see ${lateFlags} late check-in flag${lateFlags === 1 ? "" : "s"} and ${shortShiftFlags} shorter-shift flag${shortShiftFlags === 1 ? "" : "s"}. This helps Seyalla coach you in a more human way instead of just reading raw records back to you.`,
      chips: ["Show my latest attendance", "Am I consistent?", "Compare attendance with sales"],
    };
  }

  if (resolvedIntent.masterIntent === "staff_roster_view" || intent === "schedule") {
    if (!nextSchedule) {
      return {
        mood: "coach",
        text: `I do not have an upcoming scheduled shift for ${targetEmployee.firstName} in the current scoped dataset. Once roster data is connected live, I can tell you when you work next, whether you are opening or closing, who else is on the floor, and what kind of target pressure to expect.`,
        chips: ["Show my attendance", "What should I focus on next?", "Explain Seyalla logic"],
      };
    }

    const rosterText = weeklyRoster
      .map((row) => `${row.date}: ${row.shiftName} (${row.startTime}–${row.endTime})${row.status === "Off" ? " - Off" : ` at ${row.location}`}`)
      .join(" | ");

    return {
      mood: "coach",
      text: `${targetEmployee.firstName}'s next scheduled shift is ${nextSchedule.shiftName} on ${nextSchedule.date} from ${nextSchedule.startTime} to ${nextSchedule.endTime} at ${nextSchedule.location}. For the week ahead, your roster currently looks like this: ${rosterText}. This makes Seyalla feel far more useful because it can speak to you like a real assistant, not just a reporting widget. It knows what is coming up and can coach you around it.`,
      chips: ["Am I working tomorrow?", "Show weekly roster", "What should I focus on for this shift?"],
    };
  }

  if (resolvedIntent.masterIntent === "staff_daily_briefing" || intent === "daily_briefing") {
    return {
      mood: "coach",
      text: `Here is your daily briefing, ${targetEmployee.firstName}. ${nextSchedule ? `Your next shift is ${nextSchedule.shiftName} on ${nextSchedule.date} from ${nextSchedule.startTime} to ${nextSchedule.endTime} at ${nextSchedule.location}.` : "I do not yet have a live next-shift record for you."} You are currently at ${formatPct(ratio)} of target with ${formatMoney(targetRow.salesAmount)} achieved, and your current payout sits at ${formatMoney(targetRow.payout)}. Your attendance health score is ${attendanceHealthScore}/100. ${gap > 0 ? `You still have ${formatMoney(gap)} left to close, so today should be about deliberate, high-quality selling rather than rushing.` : `You are already beyond target, so today is about strengthening margin, preserving service quality, and finding upside opportunities.`} ${shiftCoaching} ${adaptiveProfile.topInsights[0] ? `From your historical pattern, ${adaptiveProfile.topInsights[0]}` : "I will keep learning which situations you respond best to as more history builds up."}`,
      chips: ["Give me today’s focus", "Show my next shift", "Can I request leave?"],
      bullets: [
        `Preferred response style: ${adaptiveProfile.preferredTone}`,
        ...adaptiveProfile.recurringGoals.slice(0, 2).map((goal) => `Recurring goal: ${goal}`),
      ],
    };
  }

  if (resolvedIntent.masterIntent === "staff_leave_request" || resolvedIntent.masterIntent === "staff_shift_swap" || resolvedIntent.masterIntent === "staff_dispute_case" || resolvedIntent.masterIntent === "shared_action_query" || intent === "leave_support") {
    const swapName = latestLeave?.swapWithEmployeeId ? employees.find((e) => e.id === latestLeave.swapWithEmployeeId)?.firstName : null;
    const wantsMedical = message.toLowerCase().includes("medical") || message.toLowerCase().includes("mc");
    const wantsSwap = message.toLowerCase().includes("swap");

    return {
      mood: "coach",
      text: `Yes, you can absolutely make this feel conversational. ${latestLeave ? `Right now, your latest request is ${latestLeave.type} for ${latestLeave.date} and it is ${latestLeave.status}${swapName ? ` with ${swapName} suggested as the swap colleague` : ""}.` : "There is no active leave request loaded for you in the sample data yet."} In the real experience, Seyalla should not dump a form immediately. It should guide you naturally, ask only what is missing, and then help prepare the request for approval.`,
      chips: wantsMedical
        ? ["Use next shift details", "Add medical reason", "Submit leave draft"]
        : wantsSwap
        ? ["Use next shift details", "Suggest swap colleague", "Create swap request"]
        : ["Apply medical leave", "Request shift swap", "Show my pending requests"],
      bullets: [
        "Prefill the affected shift automatically",
        "Ask only the next missing question",
        "Suggest eligible swap colleagues when relevant",
        "Prepare the request before sending for approval",
      ],
      followUps: wantsMedical
        ? [
            "Is this for your next shift or a different date?",
            "Do you want me to prefill your next scheduled shift details?",
            "Will you be attaching a medical certificate later?",
          ]
        : wantsSwap
        ? [
            "Is the swap for your next scheduled shift?",
            "Do you already have a colleague in mind or should I suggest one?",
            "Do you want me to draft the reason for the swap request?",
          ]
        : [
            "Is this for medical leave, annual leave, or a shift swap?",
            "Do you want me to use your next scheduled shift automatically?",
          ],
    };
  }

  if (resolvedIntent.masterIntent === "staff_ai_coaching" || intent === "decision_support") {
    const best = decisionOptions[0];
    const second = decisionOptions[1];
    const confidence = Math.max(resolvedIntent.confidence, getDecisionConfidence(decisionOptions));
    const alternatives = buildAlternatives(decisionOptions);

    return {
      mood: "focused",
      text: `Based on your current situation, my strongest suggestion is ${best.label.toLowerCase()}. I’m ranking that highest because ${best.reason}. I’d put ${second.label.toLowerCase()} as the next-best option, because ${second.reason}. So if you want the practical version, I would start with the top option first, then use the second one as support if your day or shift condition changes. ${adaptiveProfile.topInsights[0] ? `I’m also factoring in your historical pattern here — ${adaptiveProfile.topInsights[0]}` : "I will use your history more deeply as more records become available."}`,
      chips: [best.label, second.label, "Explain why you chose that"],
      confidence,
      bullets: [
        `Top recommendation: ${best.label}`,
        `Why it leads: ${best.reason}`,
        `Second option: ${second.label}`,
        `Why it is second: ${second.reason}`,
        ...adaptiveProfile.recurringGoals.slice(0, 1).map((goal) => `Recurring goal remembered: ${goal}`),
      ],
      followUps: [
        "Do you want me to turn this into a simple action plan for your next shift?",
        "Should I compare this recommendation against a shift swap or leave request?",
      ],
      alternatives,
    };
  }

  if ((resolvedIntent.masterIntent === "admin_historical_comparison" || intent === "admin_comparison") && scopeMode === "ADMIN") {
    return buildAdminComparisonReply({
      adminPersona,
      aggregateSalesScope,
      currentRows: currentScopedTargets,
      previousRows: previousScopedPeriodRows,
    });
  }

  if ((resolvedIntent.masterIntent === "admin_operational_summary" || resolvedIntent.masterIntent === "admin_commission_exception" || intent === "admin_operational") && scopeMode === "ADMIN") {
    return buildAdminOperationalReply({
      adminPersona,
      aggregateSalesScope,
      pendingRequests: adminPendingRequests,
      riskFlags: adminRiskFlags,
      scheduledShifts: context.scopedSchedules.filter((row) => row.status === "Scheduled").length,
    });
  }

  if ((resolvedIntent.masterIntent === "admin_coaching_recommendation" || resolvedIntent.masterIntent === "admin_risk_detection" || intent === "admin_coaching") && scopeMode === "ADMIN") {
    return buildAdminCoachingReply({
      adminPersona,
      currentRows: currentScopedTargets,
      allowedEmployeeIds: context.allowedEmployeeIds,
    });
  }

  if ((resolvedIntent.masterIntent === "admin_brand_performance" || intent === "admin_category") && scopeMode === "ADMIN") {
    return buildAdminCategoryReply({
      aggregateSalesScope,
      scopedSales: context.scopedSales,
    });
  }

  if (resolvedIntent.masterIntent === "admin_approval_inbox" || resolvedIntent.masterIntent === "admin_leave_approval" || resolvedIntent.masterIntent === "admin_shift_approval" || intent === "approvals") {
    if (scopeMode === "ADMIN") {
      const pending = context.scopedLeaveRequests.filter((row) => row.status === "Pending");
      const lines = pending.length
        ? pending
            .map((row) => {
              const emp = employees.find((e) => e.id === row.employeeId)?.firstName ?? "Unknown";
              return `${emp}: ${row.type} for ${row.date}`;
            })
            .join(" | ")
        : "There are no pending approvals in the current scope.";
      return {
        mood: "focused",
        text: `There ${pending.length === 1 ? "is" : "are"} ${pending.length} pending approval item${pending.length === 1 ? "" : "s"} in the current ${adminPersona.replaceAll("_", " ").toLowerCase()} scope. ${lines} My recommendation is to clear the items that affect immediate floor coverage first, then move to lower-risk requests.`,
        chips: ["Open approvals inbox", "Show support watchlist", "Compare risk impact"],
        bullets: pending.length ? pending.map((row) => `${employees.find((e) => e.id === row.employeeId)?.firstName ?? "Unknown"}: ${row.type} on ${row.date}`) : ["No pending approvals in scope"],
      };
    }

    return {
      mood: "coach",
      text: `In Staff Mode, I can show your own request status, but I cannot open team-wide approvals. Right now your requests should stay within your own personal scope.`,
      chips: ["Show my pending requests", "Apply medical leave", "Request shift swap"],
    };
  }

  if (resolvedIntent.masterIntent === "admin_attendance_monitoring" || resolvedIntent.masterIntent === "admin_target_management" || intent === "support_watchlist") {
    if (scopeMode === "ADMIN") {
      const watchlist = buildSupportWatchlist(scopeMode, context.allowedEmployeeIds);
      const highPriority = watchlist.filter((item) => item.priority === "High");
      const summary = highPriority.length
        ? `High priority support is needed for ${highPriority.map((item) => item.name).join(", ")}.`
        : `There are no high-priority support cases right now, but medium-risk cases still deserve monitoring.`;
      return {
        mood: "focused",
        text: `${summary} Across the current ${adminPersona.replaceAll("_", " ").toLowerCase()} scope, the watchlist highlights who may need commercial, attendance, or roster intervention next. The best next move is to coach the high-priority names first, then review whether approvals or shift coverage are contributing to the problem.`,
        chips: ["Review high priority staff", "Open approvals inbox", "See risk reasons"],
        bullets: watchlist.map((item) => `${item.name}: ${item.priority} priority - ${item.reason}`),
      };
    }

    return {
      mood: "coach",
      text: `Support watchlists are an admin-level view. In Staff Mode, I can help with your own target gap, attendance, schedule, and work requests instead.`,
      chips: ["How far am I from target?", "Review my attendance", "Show my next shift"],
    };
  }

  if (resolvedIntent.masterIntent === "admin_store_performance" || resolvedIntent.masterIntent === "admin_country_performance" || resolvedIntent.masterIntent === "admin_commission_review" || resolvedIntent.masterIntent === "admin_payroll_export" || resolvedIntent.masterIntent === "admin_executive_summary" || intent === "admin_summary") {
    if (scopeMode === "ADMIN") {
      const ranked = currentScopedTargets
        .map((row) => {
          const emp = employees.find((e) => e.id === row.employeeId)!;
          const achievement = row.targetAmount > 0 ? (row.salesAmount / row.targetAmount) * 100 : 0;
          return { ...row, firstName: emp.firstName, achievement };
        })
        .sort((a, b) => b.achievement - a.achievement);

      const top = ranked[0];
      return buildAdminManagerialSummary({
        adminPersona,
        aggregateSalesScope,
        strongestPerformerName: top?.firstName,
        strongestAchievementPct: top?.achievement,
        strongestSales: top?.salesAmount,
        pendingRequests: adminPendingRequests,
        riskFlags: adminRiskFlags,
      });
    }

    const ranked = currentScopedTargets
      .map((row) => {
        const emp = employees.find((e) => e.id === row.employeeId)!;
        const achievement = row.targetAmount > 0 ? (row.salesAmount / row.targetAmount) * 100 : 0;
        return { ...row, firstName: emp.firstName, achievement };
      })
      .sort((a, b) => b.achievement - a.achievement);

    const top = ranked[0];
    const teamTarget = currentScopedTargets.reduce((sum, row) => sum + row.targetAmount, 0);
    const teamAchievement = teamTarget > 0 ? (teamSales / teamTarget) * 100 : 0;

    return {
      mood,
      text: `You are currently at ${formatMoney(teamSales)} against a combined target of ${formatMoney(teamTarget)}, which is ${formatPct(teamAchievement)} achievement. ${top ? `Your strongest visible performer is ${top.firstName} at ${formatPct(top.achievement)} with ${formatMoney(top.salesAmount)} in sales.` : "I do not yet have enough ranking data to identify the strongest performer."} The next best move is to focus on the remaining target gap and where your strongest conversion opportunities are.`,
      chips: ["Who needs support?", "Best performers", "Team bonus outlook"],
    };
  }

  if (scopeMode === "ADMIN") {
    return buildAdminFallbackReply({
      adminPersona,
      aggregateSalesScope,
      pendingRequests: adminPendingRequests,
      riskFlags: adminRiskFlags,
    });
  }

  return buildFallbackReply({
    employeeName: targetEmployee.firstName,
    ratio,
    salesAmount: targetRow.salesAmount,
    targetAmount: targetRow.targetAmount,
    nextSchedule,
    attendanceHealthScore,
  });
}

function runSelfChecks(): TestResult[] {
  const checks: TestResult[] = [];

  const payout1 = calculatePayout(2, 46000, 42000);
  checks.push({
    name: "Fixed payout tier returns 1500 at 100%+",
    pass: payout1 === 1500,
    details: `Expected 1500, received ${payout1}`,
  });

  const intent1 = resolveIntentFromDictionary("What do I need to sell to earn 500 more?", "STAFF");
  checks.push({
    name: "Dictionary resolves staff goal coaching intent",
    pass: intent1.masterIntent === "staff_goal_coaching",
    details: `Expected staff_goal_coaching, received ${intent1.masterIntent}`,
  });

  const earnMoreIntent = resolveIntentFromDictionary("I want to earn 500 more", "STAFF");
  checks.push({
    name: "Dictionary extracts staff value goal",
    pass: earnMoreIntent.masterIntent === "staff_goal_coaching" && earnMoreIntent.entities.valueGoal === 500,
    details: `Expected staff_goal_coaching with value goal 500, received ${earnMoreIntent.masterIntent} and ${earnMoreIntent.entities.valueGoal}`,
  });

  const extra = extractExtraSalesAmount("What if I sell 12000 more this month?");
  checks.push({
    name: "Extra sales number extracted",
    pass: extra === 12000,
    details: `Expected 12000, received ${extra}`,
  });

  const blocked = buildResponse("Show Priya commission", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Staff mode blocks other employee access",
    pass: blocked.text.toLowerCase().includes("personal scope") || blocked.text.toLowerCase().includes("limited"),
    details: blocked.text,
  });

  const resolvedAdminApprovals = resolveIntentFromDictionary("Show all pending approvals", "ADMIN");
  checks.push({
    name: "Dictionary resolves admin approvals intent",
    pass: resolvedAdminApprovals.masterIntent === "admin_approval_inbox",
    details: `Expected admin_approval_inbox, received ${resolvedAdminApprovals.masterIntent}`,
  });

  const admin = buildResponse("How is this scope performing?", "ADMIN", 1, "STORE_MANAGER");
  checks.push({
    name: "Admin summary returns managerial scope insight",
    pass: admin.text.toLowerCase().includes("marina bay store") && admin.text.toLowerCase().includes("review the support watchlist"),
    details: admin.text,
  });

  checks.push({
    name: "Admin comparison question returns month-on-month comparison or sensible no-history fallback",
    pass: (() => {
      const text = buildResponse("Compare this month vs last month", "ADMIN", 1, "STORE_MANAGER").text.toLowerCase();
      return text.includes("previous period") || text.includes("no earlier scoped period");
    })(),
    details: buildResponse("Compare this month vs last month", "ADMIN", 1, "STORE_MANAGER").text,
  });

  checks.push({
    name: "Admin coaching question returns coaching candidates",
    pass: buildResponse("Who needs coaching?", "ADMIN", 1, "STORE_MANAGER").text.toLowerCase().includes("coaching candidates"),
    details: buildResponse("Who needs coaching?", "ADMIN", 1, "STORE_MANAGER").text,
  });

  checks.push({
    name: "Admin category driver question returns category driver answer",
    pass: buildResponse("Which product categories are driving the most commission?", "ADMIN", 1, "STORE_MANAGER").text.toLowerCase().includes("categories currently driving"),
    details: buildResponse("Which product categories are driving the most commission?", "ADMIN", 1, "STORE_MANAGER").text,
  });

  checks.push({
    name: "Admin operational issue question returns operational answer",
    pass: buildResponse("What operational issues are affecting conversion?", "ADMIN", 1, "STORE_MANAGER").text.toLowerCase().includes("operationally"),
    details: buildResponse("What operational issues are affecting conversion?", "ADMIN", 1, "STORE_MANAGER").text,
  });

  const approvalsReply = buildResponse("Show approvals", "ADMIN", 1, "STORE_MANAGER");
  checks.push({
    name: "Admin approvals intent gives approval-focused answer",
    pass: approvalsReply.text.toLowerCase().includes("pending approval") || approvalsReply.text.toLowerCase().includes("pending approval item"),
    details: approvalsReply.text,
  });

  const watchlistReply = buildResponse("Who needs support today?", "ADMIN", 1, "STORE_MANAGER");
  checks.push({
    name: "Admin support watchlist intent gives support-focused answer",
    pass: (watchlistReply.text.toLowerCase().includes("support") && watchlistReply.text.toLowerCase().includes("high-priority")) || watchlistReply.text.toLowerCase().includes("high priority support"),
    details: watchlistReply.text,
  });

  const categoryReply = buildResponse("Which product categories am I strongest or weakest in?", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Category performance question returns strongest and weakest category",
    pass: categoryReply.text.toLowerCase().includes("strongest visible category") && categoryReply.text.toLowerCase().includes("weakest visible category"),
    details: categoryReply.text,
  });

  const comparisonReply = buildResponse("Compare my performance to last month", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Performance comparison question returns previous-period comparison",
    pass: comparisonReply.text.toLowerCase().includes("compared with the previous period") || comparisonReply.text.toLowerCase().includes("previous sales"),
    details: comparisonReply.text,
  });

  const payoutWhyReply = buildResponse("Why is my commission lower this week?", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Commission-lower question returns explanation instead of generic commission summary",
    pass: payoutWhyReply.text.toLowerCase().includes("payout") && (payoutWhyReply.text.toLowerCase().includes("lower") || payoutWhyReply.text.toLowerCase().includes("previous payout")),
    details: payoutWhyReply.text,
  });

  const salesStaffReply = buildResponse("sales", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Short sales prompt in staff mode stays personal",
    pass: salesStaffReply.text.toLowerCase().includes("arun is currently at") || salesStaffReply.text.toLowerCase().includes("currently at sgd"),
    details: salesStaffReply.text,
  });

  const salesAdminReply = buildResponse("sales", "ADMIN", 1, "STORE_MANAGER");
  checks.push({
    name: "Short sales prompt in admin mode stays scoped and managerial",
    pass: salesAdminReply.text.toLowerCase().includes("marina bay store") && !salesAdminReply.text.toLowerCase().includes("your next shift"),
    details: salesAdminReply.text,
  });

  const helpStaffReply = buildResponse("what can you do", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Help prompt in staff mode explains beginner use clearly",
    pass: helpStaffReply.text.toLowerCase().includes("staff mode") && helpStaffReply.text.toLowerCase().includes("how far am i from target"),
    details: helpStaffReply.text,
  });

  const helpAdminReply = buildResponse("what can you do", "ADMIN", 1, "STORE_MANAGER");
  checks.push({
    name: "Help prompt in admin mode explains beginner use clearly",
    pass: helpAdminReply.text.toLowerCase().includes("store manager") && helpAdminReply.text.toLowerCase().includes("how is this scope performing"),
    details: helpAdminReply.text,
  });

  const rankingReply = buildResponse("rank", "ADMIN", 1, "STORE_MANAGER");
  checks.push({
    name: "Admin ranking prompt returns ranking answer",
    pass: rankingReply.text.toLowerCase().includes("current ranking") || rankingReply.text.toLowerCase().includes("1."),
    details: rankingReply.text,
  });

  const staffRankReply = buildResponse("rank", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Staff ranking prompt stays privacy-safe",
    pass: staffRankReply.text.toLowerCase().includes("should not rank other people") || staffRankReply.text.toLowerCase().includes("staff mode"),
    details: staffRankReply.text,
  });

  const scheduleReply = buildResponse("When is my next shift?", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Schedule intent returns next shift",
    pass: scheduleReply.text.toLowerCase().includes("next scheduled shift"),
    details: scheduleReply.text,
  });

  const attendanceReply = buildResponse("Show my latest attendance", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Attendance reply includes latest record",
    pass: attendanceReply.text.toLowerCase().includes("latest attendance record") || attendanceReply.text.toLowerCase().includes("check-in"),
    details: attendanceReply.text,
  });

  const leaveReply = buildResponse("Can I request medical leave for my next shift?", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Leave support intent is handled",
    pass: leaveReply.text.toLowerCase().includes("medical leave") || leaveReply.text.toLowerCase().includes("shift-swap") || leaveReply.text.toLowerCase().includes("shift swap"),
    details: leaveReply.text,
  });

  const earnMoreReply = buildResponse("I want to earn 500 more", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Earn-more request returns actionable answer",
    pass: earnMoreReply.text.toLowerCase().includes("you want to earn") && !earnMoreReply.text.toLowerCase().includes("is on the elite above 150% plan"),
    details: earnMoreReply.text,
  });

  const decisionReply = buildResponse("Give me a suggestion for my next shift", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Decision support returns ranked suggestion",
    pass: decisionReply.text.toLowerCase().includes("strongest suggestion") || decisionReply.text.toLowerCase().includes("next-best option"),
    details: decisionReply.text,
  });

  checks.push({
    name: "Decision support includes confidence",
    pass: typeof decisionReply.confidence === "number" && decisionReply.confidence >= 55,
    details: `Confidence value: ${decisionReply.confidence}`,
  });

  checks.push({
    name: "Decision support includes alternatives",
    pass: Array.isArray(decisionReply.alternatives) && decisionReply.alternatives.length > 0,
    details: `Alternatives count: ${decisionReply.alternatives?.length ?? 0}`,
  });

  const fallbackReply = buildResponse("Hello there", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Fallback reply is helpful and specific",
    pass: fallbackReply.text.toLowerCase().includes("try asking me something more specific") && !fallbackReply.text.toLowerCase().includes("seyalla is ready to work with role-scoped performance data"),
    details: fallbackReply.text,
  });

  checks.push({
    name: "Adaptive profile returns historical narrative",
    pass: buildHistoricalNarrative(1).topInsights.length > 0,
    details: buildHistoricalNarrative(1).topInsights.join(" | "),
  });

  const storeScope = buildScopedContext("ADMIN", 1, "STORE_MANAGER");
  checks.push({
    name: "Store manager scope is store-limited",
    pass: storeScope.allowedEmployeeIds.length === 5,
    details: `Expected 5 employees in Marina Bay scope, received ${storeScope.allowedEmployeeIds.length}`,
  });

  const countryScope = buildScopedContext("ADMIN", 1, "COUNTRY_MANAGER");
  checks.push({
    name: "Country manager scope is wider than store scope",
    pass: countryScope.allowedEmployeeIds.length > storeScope.allowedEmployeeIds.length,
    details: `Store scope ${storeScope.allowedEmployeeIds.length}, country scope ${countryScope.allowedEmployeeIds.length}`,
  });

  const storeAggregate = buildAggregateSalesScope("STORE_MANAGER", 1);
  checks.push({
    name: "Store aggregate uses latest scoped period",
    pass: storeAggregate.salesAmount === 221000 && storeAggregate.targetAmount === 165000,
    details: `Expected 221000 / 165000, received ${storeAggregate.salesAmount} / ${storeAggregate.targetAmount}`,
  });

  const brandAggregate = buildAggregateSalesScope("BRAND_MANAGER", 1);
  checks.push({
    name: "Brand aggregate uses brand scope rather than store scope",
    pass: brandAggregate.salesAmount >= storeAggregate.salesAmount,
    details: `Store aggregate ${storeAggregate.salesAmount}, brand aggregate ${brandAggregate.salesAmount}`,
  });

  const countryAggregate = buildAggregateSalesScope("COUNTRY_MANAGER", 1);
  checks.push({
    name: "Country aggregate uses wider scope than brand aggregate",
    pass: countryAggregate.salesAmount >= brandAggregate.salesAmount,
    details: `Brand aggregate ${brandAggregate.salesAmount}, country aggregate ${countryAggregate.salesAmount}`,
  });

  const adminFallback = buildResponse("hello there", "ADMIN", 1, "STORE_MANAGER");
  checks.push({
    name: "Admin fallback stays managerial, not staff-like",
    pass: adminFallback.text.toLowerCase().includes("operationally") && !adminFallback.text.toLowerCase().includes("your next shift is"),
    details: adminFallback.text,
  });

  const staffRequestsReply = buildResponse("My requests", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Staff quick action My requests maps to leave-support flow",
    pass: staffRequestsReply.text.toLowerCase().includes("request") || staffRequestsReply.text.toLowerCase().includes("leave"),
    details: staffRequestsReply.text,
  });

  const briefingReply = buildResponse("Give me today's briefing", "STAFF", 1, "STORE_MANAGER");
  checks.push({
    name: "Daily briefing intent is handled",
    pass: briefingReply.text.toLowerCase().includes("daily briefing"),
    details: briefingReply.text,
  });

  return checks;
}

function getStarterMessages(scopeMode: ScopeMode, adminPersona: AdminPersona): Message[] {
  if (scopeMode === "ADMIN") {
    return [
      {
        id: "m1",
        sender: "assistant",
        mood: "warm",
        text: `Hi, I am Seyalla. You are in ${adminPersona.replaceAll("_", " ")} mode, so I should respond like an intelligence and decision-support assistant for the allowed store, brand, or country scope. The selected demo user determines which store, brand, or country scope is being simulated. The easiest place to start is with a question like “how is this scope performing”, “show approvals”, “who needs support today”, or “rank the team”.`,
        chips: ["How is this scope performing?", "Show approvals", "Who needs support today?", "Rank the team"],
        bullets: [
          "Admin: oversight, analysis, approvals, risk monitoring",
          "Scope-aware: store, brand, or country depending on your role"
        ]
      },
    ];
  }

  return [
    {
      id: "m1",
      sender: "assistant",
      mood: "warm",
      text: "Hi, I am Seyalla. In Staff Mode, I behave like a personal commission coach and work assistant. The easiest place to start is with a question like ‘how far am I from target’, ‘when is my next shift’, ‘review my attendance’, or ‘help me apply for leave’.",
      chips: ["How far am I from target?", "When is my next shift?", "Review my attendance", "Help me apply for leave"],
      bullets: [
        "Staff: coaching, explanation, self-service, work requests",
        "Personal scope only: your own performance, schedule, and workflows"
      ]
    },
  ];
}

function StatCard({ title, value, sub, icon: Icon }: { title: string; value: string; sub: string; icon: React.ElementType }) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">{title}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
            <p className="mt-1 text-sm text-white/60">{sub}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white/80">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CodeBlock({ title, code, icon: Icon }: { title: string; code: string; icon: React.ElementType }) {
  return (
    <Card className="border-white/10 bg-[#08101d] backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-white">
          <Icon className="h-4 w-4 text-cyan-300" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-6 text-white/75">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-white">
          <Icon className="h-4 w-4 text-cyan-300" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function SeyallaAgentDemo() {
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const [scopeMode, setScopeMode] = useState<ScopeMode>("STAFF");
  const [adminPersona, setAdminPersona] = useState<AdminPersona>("STORE_MANAGER");
  const [activeEmployeeId, setActiveEmployeeId] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>(getStarterMessages("STAFF", "STORE_MANAGER"));
  const [input, setInput] = useState("");
  const [mascotMood, setMascotMood] = useState<MascotMood>("warm");
  const [viewMode, setViewMode] = useState<ViewMode>("assistant");

  const activeEmployee = useMemo(() => employees.find((e) => e.id === activeEmployeeId) ?? employees[0], [activeEmployeeId]);
  const scope = useMemo(() => buildScopedContext(scopeMode, activeEmployeeId, adminPersona), [scopeMode, activeEmployeeId, adminPersona]);
  const selfChecks = useMemo(() => runSelfChecks(), []);

  useEffect(() => {
    setMessages(getStarterMessages(scopeMode, adminPersona));
    setMascotMood("warm");
  }, [scopeMode, adminPersona]);
  const adaptiveProfileForCard = useMemo(() => buildHistoricalNarrative(activeEmployeeId), [activeEmployeeId]);
  const weeklyRoster = useMemo(
    () => scope.scopedSchedules.filter((row) => row.employeeId === activeEmployeeId).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 7),
    [scope, activeEmployeeId]
  );
  const latestAttendanceForCard = useMemo(
    () => [...scope.scopedAttendance.filter((row) => row.employeeId === activeEmployeeId)].sort((a, b) => a.date < b.date ? 1 : -1)[0],
    [scope, activeEmployeeId]
  );
  const nextShiftForCard = useMemo(
    () => scope.scopedSchedules.filter((row) => row.employeeId === activeEmployeeId && row.status === "Scheduled").sort((a, b) => a.date.localeCompare(b.date))[0],
    [scope, activeEmployeeId]
  );
  const lateFlagsForCard = useMemo(
    () => scope.scopedAttendance.filter((row) => row.employeeId === activeEmployeeId && row.checkInTime > "09:00:00").length,
    [scope, activeEmployeeId]
  );
  const shortShiftFlagsForCard = useMemo(
    () => scope.scopedAttendance.filter((row) => row.employeeId === activeEmployeeId && row.workingHours < 7).length,
    [scope, activeEmployeeId]
  );
  const avgHoursForCard = useMemo(() => {
    const rows = scope.scopedAttendance.filter((row) => row.employeeId === activeEmployeeId);
    return rows.length ? rows.reduce((sum, row) => sum + row.workingHours, 0) / rows.length : 0;
  }, [scope, activeEmployeeId]);
  const attendanceHealthScoreForCard = Math.max(35, Math.min(100, Math.round(100 - lateFlagsForCard * 8 - shortShiftFlagsForCard * 10 + avgHoursForCard)));
  const workflowCards = useMemo(() => buildWorkflowCards(scopeMode, activeEmployeeId), [scopeMode, activeEmployeeId]);
  const supportWatchlist = useMemo(() => buildSupportWatchlist(scopeMode, scope.allowedEmployeeIds), [scopeMode, scope.allowedEmployeeIds]);
  const goalMode = useMemo(() => inferGoalMode(input || "", adaptiveProfileForCard), [input, adaptiveProfileForCard]);
  const historicalComparisonRows = useMemo(() => historicalComparisons.filter((row) => row.employeeId === activeEmployeeId), [activeEmployeeId]);

  const activeTarget = useMemo(() => {
    const rows = scope.scopedTargets
      .filter((row) => row.employeeId === activeEmployeeId)
      .sort((a, b) => b.year * 100 + b.month - (a.year * 100 + a.month));
    return rows[0];
  }, [scope, activeEmployeeId]);

  const currentScopedTargets = useMemo(() => filterToLatestPeriod(scope.scopedTargets), [scope.scopedTargets]);
  const teamSales = currentScopedTargets.reduce((sum, row) => sum + row.salesAmount, 0);
  const teamTarget = currentScopedTargets.reduce((sum, row) => sum + row.targetAmount, 0);
  const teamAchievement = teamTarget > 0 ? (teamSales / teamTarget) * 100 : 0;
  const aggregateSalesScope = useMemo(() => buildAggregateSalesScope(adminPersona, activeEmployeeId), [adminPersona, activeEmployeeId]);

  const suggestionSets = {
    STAFF: [
      "What can you do?",
      "Explain my commission",
      "How far am I from target?",
      "What if I sell 10000 more?",
      "Show strongest category",
      "Compare my performance to last month",
      "Review my attendance",
      "When is my next shift?",
      "Give me today’s briefing",
      "Can I request leave?",
      "Give me a suggestion"
    ],
    ADMIN: [
      "What can you do?",
      "How is this scope performing?",
      "Compare this month vs last month",
      "Who needs coaching?",
      "Show approvals",
      "What operational issues are affecting conversion?",
      "Which product categories are driving the most commission?",
      "Rank the team",
      "Give me a recommendation"
    ],
  } as const;

  const adminQuickActions = getAdminQuickActions(adminPersona);

  const staffQuickActions = [
    "My next shift",
    "My attendance",
    "My target gap",
    "My requests",
    "My categories",
  ] as const;

  const navItems: { key: ViewMode; label: string; icon: React.ElementType }[] = [
    { key: "assistant", label: "Assistant", icon: Bot },
    { key: "operations", label: "Operations", icon: Users },
    { key: "coverage", label: "Coverage", icon: MessagesSquare },
    { key: "decisions", label: "Decisions", icon: Brain },
    { key: "workflow", label: "Workflow", icon: ClipboardList },
    { key: "architecture", label: "Architecture", icon: Layers3 },
    { key: "prompts", label: "Prompts", icon: FileText },
    { key: "schema", label: "Backend", icon: Database },
    { key: "analytics", label: "Analytics", icon: Activity },
    { key: "implementation", label: "Implementation", icon: ServerCog },
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `${Date.now()}-u`,
      sender: "user",
      text,
    };

    const response = buildResponse(text, scopeMode, activeEmployeeId, adminPersona);

    const assistantMessage: Message = {
      id: `${Date.now()}-a`,
      sender: "assistant",
      text: response.text,
      chips: response.chips,
      mood: response.mood,
      bullets: response.bullets,
      confidence: response.confidence,
      followUps: response.followUps,
      alternatives: response.alternatives,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setMascotMood(response.mood ?? "warm");
    setInput("");
  };

  const mascot = moodConfig(mascotMood);

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Button
              key={item.key}
              variant="outline"
              onClick={() => setViewMode(item.key)}
              className={`rounded-2xl border-white/10 ${viewMode === item.key ? "bg-white text-slate-900" : "bg-white/5 text-white"}`}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>

        {viewMode === "assistant" && (
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
              >
                <div className="border-b border-white/10 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-300">
                        <Sparkles className="h-4 w-4" />
                        Seyalla AI Agent
                      </div>
                      <h1 className="text-3xl font-semibold tracking-tight">Performance-aware AI inside Seyal</h1>
                      <p className="mt-2 max-w-2xl text-sm text-white/65">
                        Trusted business logic first, conversational explanation second. Scoped by role, shaped for commission, targets, attendance context, and admin insight.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="outline" onClick={() => setScopeMode("STAFF")} className={`rounded-2xl border-white/10 ${scopeMode === "STAFF" ? "bg-white text-slate-900" : "bg-white/5 text-white"}`}>
                        Staff Mode
                      </Button>
                      <Button variant="outline" onClick={() => setScopeMode("ADMIN")} className={`rounded-2xl border-white/10 ${scopeMode === "ADMIN" ? "bg-white text-slate-900" : "bg-white/5 text-white"}`}>
                        Admin Mode
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-0 lg:grid-cols-[0.72fr_0.28fr]">
                  <div className="border-r border-white/10">
                    <ScrollArea className="h-[640px] px-4 py-5 md:px-5">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`max-w-[85%] rounded-3xl border p-4 shadow-lg ${message.sender === "user" ? "border-cyan-400/20 bg-cyan-400/10" : "border-white/10 bg-white/5"}`}
                            >
                              <div className="flex items-center gap-2">
                                <Badge className="rounded-full border-0 bg-white/10 text-white/70">{message.sender === "user" ? "You" : "Seyalla"}</Badge>
                                {message.mood && <Badge className="rounded-full border-0 bg-white/10 text-white/70">{moodConfig(message.mood).label}</Badge>}
                              </div>
                              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/90">{message.text}</p>
                              {typeof message.confidence === "number" ? (
                                <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">
                                  Decision confidence: {message.confidence}%
                                </div>
                              ) : null}
                              {message.bullets?.length ? (
                                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                                  <div className="space-y-2 text-xs leading-6 text-white/75">
                                    {message.bullets.map((bullet) => (
                                      <div key={bullet}>• {bullet}</div>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                              {message.alternatives?.length ? (
                                <div className="mt-4 space-y-3">
                                  {message.alternatives.map((alt) => (
                                    <div key={alt.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                      <div className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">Alternative option</div>
                                      <div className="mt-2 text-sm font-medium text-white">{alt.label}</div>
                                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                                        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-3 text-xs text-white/75">
                                          <div className="mb-2 font-medium text-emerald-200">Pros</div>
                                          {alt.pros.map((item) => (
                                            <div key={item}>• {item}</div>
                                          ))}
                                        </div>
                                        <div className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-3 text-xs text-white/75">
                                          <div className="mb-2 font-medium text-amber-200">Cons</div>
                                          {alt.cons.map((item) => (
                                            <div key={item}>• {item}</div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                              {message.followUps?.length ? (
                                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/45">Follow-up questions</div>
                                  <div className="space-y-2 text-xs leading-6 text-white/75">
                                    {message.followUps.map((question) => (
                                      <div key={question}>• {question}</div>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                              {message.chips?.length ? (
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {message.chips.map((chip) => (
                                    <button
                                      key={chip}
                                      onClick={() => sendMessage(chip)}
                                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75 transition hover:bg-white/10"
                                    >
                                      {chip}
                                    </button>
                                  ))}
                                </div>
                              ) : null}
                            </motion.div>
                          </div>
                        ))}
                        <div ref={chatBottomRef} />
                      </div>
                    </ScrollArea>

                    <div className="border-t border-white/10 p-4">
                      <div className="mb-3 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {(scopeMode === "ADMIN" ? adminQuickActions : staffQuickActions).map((chip) => (
                            <button
                              key={chip}
                              onClick={() => sendMessage(chip)}
                              className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-100 transition hover:bg-cyan-400/15"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {suggestionSets[scopeMode].map((chip) => (
                            <button
                              key={chip}
                              onClick={() => sendMessage(chip)}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/10"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") sendMessage(input);
                          }}
                          placeholder={scopeMode === "STAFF" ? "Ask about commission, target progress, extra sales, attendance, roster, or leave" : "Ask about store, brand, country, approvals, risks, support priorities, or performance"}
                          className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/35"
                        />
                        <Button onClick={() => sendMessage(input)} className="h-12 rounded-2xl bg-white text-slate-900 hover:bg-white/90">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 md:p-5">
                    <motion.div
                      key={mascotMood}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br ${mascot.gradient} p-5 ring-1 ${mascot.ring}`}
                    >
                      <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/70">
                        {mascot.label}
                      </div>
                      <div className="pt-6 text-6xl">{mascot.emoji}</div>
                      <div className="mt-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/55">Mascot state</p>
                        <h3 className="mt-2 text-xl font-semibold">Seyalla is visually tied to response intent</h3>
                        <p className="mt-2 text-sm leading-6 text-white/70">Greeting feels warm, calculations feel focused, coaching feels guided, and wins feel celebratory.</p>
                      </div>
                    </motion.div>

                    <SectionCard title="Active scope" icon={ShieldCheck}>
                      <div className="space-y-3 text-sm text-white/75">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Role boundary</p>
                          <p className="mt-2 font-medium text-white">{scopeMode === "STAFF" ? "My Data Only" : `${adminPersona.replaceAll("_", " ")} View`}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Current identity</p>
                          <p className="mt-2 font-medium text-white">{activeEmployee.firstName} · {activeEmployee.employeeCode}</p>
                          <p className="mt-1 text-xs text-white/45">Demo identity used to simulate the current signed-in user. In Admin Mode, this also anchors the store, brand, or country scope.</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Mode behavior</p>
                          <p className="mt-2 font-medium text-white">{scopeMode === "STAFF" ? "Personal assistant for my own workday" : "Operational assistant for team oversight"}</p>
                          <p className="mt-1 text-xs text-white/45">{scopeMode === "STAFF" ? "Staff answers should stay personal and self-service focused." : "Admin answers should prioritize business meaning, risk, approvals, intervention, and next action."}</p>
                        </div>
                        {scopeMode === "ADMIN" ? (
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Admin persona</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {(["STORE_MANAGER", "BRAND_MANAGER", "COUNTRY_MANAGER"] as AdminPersona[]).map((persona) => (
                                <button
                                  key={persona}
                                  onClick={() => setAdminPersona(persona)}
                                  className={`rounded-full border px-3 py-1.5 text-xs transition ${adminPersona === persona ? "border-cyan-300/40 bg-cyan-300/10 text-white" : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"}`}
                                >
                                  {persona.replaceAll("_", " ")}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {employees.slice(0, 6).map((employee) => (
                            <button
                              key={employee.id}
                              onClick={() => setActiveEmployeeId(employee.id)}
                              className={`rounded-2xl border px-3 py-2 text-left text-xs transition ${activeEmployeeId === employee.id ? "border-cyan-300/40 bg-cyan-300/10 text-white" : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10"}`}
                            >
                              {employee.firstName}
                            </button>
                          ))}
                        </div>
                      </div>
                    </SectionCard>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {scopeMode === "STAFF" ? (
                  <>
                    <StatCard title="Performance Snapshot" value={activeTarget ? formatMoney(activeTarget.salesAmount) : "—"} sub={activeTarget ? `${formatPct((activeTarget.salesAmount / activeTarget.targetAmount) * 100)} of target` : "No target loaded"} icon={TrendingUp} />
                    <StatCard title="Commission" value={activeTarget ? formatMoney(activeTarget.payout) : "—"} sub={activeTarget ? getTierName(activeTarget.tierId) : "Awaiting data"} icon={Wallet} />
                    <StatCard title="Target" value={activeTarget ? formatMoney(activeTarget.targetAmount) : "—"} sub={activeTarget ? activeTarget.status : "No status"} icon={Target} />
                    <StatCard title="Team Momentum" value={formatPct(teamAchievement)} sub={`${formatMoney(teamSales)} sales in active scope`} icon={Users} />
                    <StatCard title="Next Shift" value={nextShiftForCard?.startTime ?? "—"} sub={nextShiftForCard?.shiftName ?? "No shift loaded"} icon={Users} />
                    <StatCard title="Attendance Health" value={`${attendanceHealthScoreForCard}/100`} sub={`${lateFlagsForCard} late flag(s), ${shortShiftFlagsForCard} short shift flag(s)`} icon={ShieldCheck} />
                  </>
                ) : (
                  <>
                    <StatCard title={adminPersona === "STORE_MANAGER" ? "Store Sales" : adminPersona === "BRAND_MANAGER" ? "Brand Sales" : "Country Sales"} value={formatMoney(aggregateSalesScope.salesAmount)} sub={`${formatPct(aggregateSalesScope.achievementPct)} of ${aggregateSalesScope.label} target`} icon={TrendingUp} />
                    <StatCard title={adminPersona === "STORE_MANAGER" ? "Coverage" : adminPersona === "BRAND_MANAGER" ? "Brand Coverage" : "National Coverage"} value={`${scope.scopedSchedules.filter((row) => row.status === "Scheduled").length}`} sub="scheduled shifts in scope" icon={Users} />
                    <StatCard title="Requests" value={`${scope.scopedLeaveRequests.length}`} sub="leave or swap records in scope" icon={FileText} />
                    <StatCard title="Attendance Risks" value={`${scope.scopedAttendance.filter((row) => row.checkInTime > "09:00:00" || row.workingHours < 7).length}`} sub="late or short-shift flags" icon={ShieldCheck} />
                    <StatCard title={adminPersona === "BRAND_MANAGER" ? "Top Brand Performer" : adminPersona === "COUNTRY_MANAGER" ? "Top Region / Store" : "Top Performer"} value={(() => {
                      const ranked = currentScopedTargets
                        .map((row) => ({
                          ...row,
                          achievement: row.targetAmount > 0 ? (row.salesAmount / row.targetAmount) * 100 : 0,
                          firstName: employees.find((e) => e.id === row.employeeId)?.firstName ?? "Unknown",
                        }))
                        .sort((a, b) => b.achievement - a.achievement);
                      return ranked[0]?.firstName ?? "—";
                    })()} sub="current leader in admin scope" icon={BarChart3} />
                    <StatCard title="Approvals Inbox" value={`${scope.scopedLeaveRequests.filter((row) => row.status === "Pending").length}`} sub="pending actions to review" icon={CheckCircle2} />
                  </>
                )}
              </div>

              <SectionCard title={scopeMode === "STAFF" ? "Today’s Briefing" : getAdminBriefingLabel(adminPersona)} icon={Brain}>
                <div className="space-y-3 text-sm leading-7 text-white/72">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    {scopeMode === "STAFF"
                      ? (nextShiftForCard
                        ? `You are scheduled for ${nextShiftForCard.shiftName} on ${nextShiftForCard.date} from ${nextShiftForCard.startTime} to ${nextShiftForCard.endTime} at ${nextShiftForCard.location}.`
                        : "No next shift is loaded right now.")
                      : `${adminPersona === "STORE_MANAGER" ? "Store view" : adminPersona === "BRAND_MANAGER" ? "Brand view" : "Country view"}: there are ${scope.scopedSchedules.filter((row) => row.status === "Scheduled").length} scheduled shifts in the current admin scope, with ${scope.scopedLeaveRequests.filter((row) => row.status === "Pending").length} pending request(s) that may need attention.`}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    {scopeMode === "STAFF"
                      ? (activeTarget
                        ? `You are currently at ${formatPct((activeTarget.salesAmount / activeTarget.targetAmount) * 100)} of target, with ${formatMoney(activeTarget.payout)} recorded as your current payout.`
                        : "No active target is loaded yet.")
                      : `${adminPersona === "STORE_MANAGER" ? "Store" : adminPersona === "BRAND_MANAGER" ? "Brand" : "Country"} momentum is ${formatPct(aggregateSalesScope.achievementPct)}, with ${formatMoney(aggregateSalesScope.salesAmount)} already achieved across ${aggregateSalesScope.label}.`}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    {scopeMode === "STAFF"
                      ? `Attendance health is ${attendanceHealthScoreForCard}/100. ${latestAttendanceForCard ? `Your latest check-in was ${latestAttendanceForCard.checkInTime} on ${latestAttendanceForCard.date}.` : "No recent attendance record yet."}`
                      : `${adminPersona === "STORE_MANAGER" ? "Store attention" : adminPersona === "BRAND_MANAGER" ? "Brand attention" : "Country attention"}: ${scope.scopedAttendance.filter((row) => row.checkInTime > "09:00:00").length} late check-in flag(s) and ${scope.scopedAttendance.filter((row) => row.workingHours < 7).length} short-shift flag(s) appear in the current scope.`}
                  </div>
                  <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
                    {buildTimeAwareBriefing(scopeMode === "STAFF" ? "Current" : "Operations", nextShiftForCard)}
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Adaptive profile" icon={MessagesSquare}>
                <div className="space-y-3 text-sm leading-7 text-white/72">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    Preferred style: {adaptiveProfileForCard.preferredTone}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    Recurring goals: {adaptiveProfileForCard.recurringGoals.length ? adaptiveProfileForCard.recurringGoals.join(", ") : "No recurring goals learned yet."}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    Historical insight: {adaptiveProfileForCard.topInsights[0] ?? "No historical insight surfaced yet."}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    Goal mode right now: {goalMode.replaceAll("_", " ")}
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Production stack" icon={ServerCog}>
                <div className="grid gap-3 text-sm text-white/72">
                  {[
                    "Frontend: Next.js or React app with Seyalla chat and analytics surfaces.",
                    "Backend: API route or server action that validates role scope before model calls.",
                    "LLM: OpenAI Chat Completions or Responses API for polished explanation.",
                    "Database: Supabase Postgres or Firebase Firestore for threads, memory, and events.",
                    "Rules engine: application-owned commission and target calculations.",
                  ].map((step, idx) => (
                    <div key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-white/80">{idx + 1}</div>
                      <p className="leading-6">{step}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {viewMode === "operations" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Weekly roster view" icon={Users}>
              <div className="space-y-3 text-sm text-white/75">
                {weeklyRoster.map((row) => (
                  <div key={row.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="font-medium text-white">{row.date} · {row.shiftName}</div>
                    <div className="mt-1 text-white/65">{row.status === "Off" ? "Off day" : `${row.startTime} to ${row.endTime} at ${row.location}`}</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Leave, medical, and shift-swap support" icon={FileText}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Seyalla should let staff apply for annual leave, medical leave, and shift swaps directly from chat.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">It should prefill the affected shift, ask for the reason, attach documentation if needed, and submit it to the approval flow.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">For shift swaps, it should suggest eligible colleagues based on role, availability, and store assignment.</div>
              </div>
            </SectionCard>

            <SectionCard title="Historical comparison module" icon={GitCompareArrows}>
              <div className="space-y-3 text-sm text-white/75">
                {historicalComparisonRows.length ? historicalComparisonRows.map((row) => (
                  <div key={row.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="font-medium text-white">{row.title}</div>
                    <div className="mt-1 text-white/65">{row.summary}</div>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">No historical comparison rows loaded for this user yet.</div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Goal-driven coaching mode" icon={Goal}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/75">
                {buildGoalDrivenCoaching({
                  goalMode,
                  ratio: activeTarget && activeTarget.targetAmount > 0 ? (activeTarget.salesAmount / activeTarget.targetAmount) * 100 : 0,
                  gap: activeTarget ? Math.max(activeTarget.targetAmount - activeTarget.salesAmount, 0) : 0,
                  attendanceHealthScore: attendanceHealthScoreForCard,
                  nextSchedule: nextShiftForCard,
                })}
              </div>
            </SectionCard>
          </div>
        )}

        {viewMode === "coverage" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Staff scenario coverage" icon={Users}>
              <div className="space-y-4 text-sm text-white/75">
                {Object.entries(staffScenarioGroups).map(([group, items]) => (
                  <div key={group} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300">{group}</div>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item}>• {item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Admin scenario coverage" icon={ShieldCheck}>
              <div className="space-y-4 text-sm text-white/75">
                {Object.entries(adminScenarioGroups).map(([group, items]) => (
                  <div key={group} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300">{group}</div>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item}>• {item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title={`${adminPersona.replaceAll("_", " ")} coverage`} icon={ShieldCheck}>
              <div className="space-y-4 text-sm text-white/75">
                {Object.entries(adminPersonaScenarioGroups[adminPersona]).map(([group, items]) => (
                  <div key={group} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300">{group}</div>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item}>• {item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Adaptive behaviour" icon={Brain}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Seyalla should adapt its tone, guidance depth, and priorities based on saved preferences and previous interactions.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">It should remember recurring goals such as improving payout, stabilising attendance, or preparing better for weekend shifts.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">It should surface historical patterns like stronger shift types, repeated risks, or common questions, then use them in recommendations.</div>
              </div>
            </SectionCard>

            <SectionCard title="Role-aware AI modes" icon={Bot}>
              <div className="grid gap-3 md:grid-cols-2 text-sm text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300">Staff modes</div>
                  <div className="space-y-2">
                    {aiRoleModes.staff.map((item) => (
                      <div key={item}>• {item}</div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300">Admin modes</div>
                  <div className="space-y-2">
                    {aiRoleModes.admin.map((item) => (
                      <div key={item}>• {item}</div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Admin and staff separation" icon={ShieldCheck}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/75">
                Staff mode should stay personal and private, focused on the logged-in user’s own roster, attendance, targets, leave requests, and history. Admin mode should shift into team, store, and operational oversight, with access to workforce coverage, coaching priorities, trend patterns, and approval-related insights.
              </div>
            </SectionCard>
          </div>
        )}

        {viewMode === "decisions" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Decision-support layer" icon={Brain}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Seyalla should not stop at reporting. It should rank options and explain why one action is stronger than another.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">A lightweight decision model can combine target gap, attendance health, next shift context, and leave status to recommend the best next move.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">That makes suggestions feel practical, consistent, and much smarter than a generic chatbot answer.</div>
              </div>
            </SectionCard>

            <SectionCard title="Suggested decision models" icon={BarChart3}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="font-medium text-white">Weighted scoring:</span> rank actions like high-value selling, attendance recovery, or shift-swap requests based on business importance.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="font-medium text-white">Rule-based coaching:</span> if attendance is weak, prioritise stability; if target gap is small, prioritise conversion; if a shift issue exists, prioritise leave or swap resolution.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="font-medium text-white">Next-best-action logic:</span> return the top recommendation, second-best fallback, and the reason behind both.</div>
              </div>
            </SectionCard>

            <SectionCard title="Why the old generic message appeared" icon={MessagesSquare}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/75">
                That message was the default fallback. It showed up whenever a question did not clearly match the available intents, so instead of helping properly, the demo gave a broad capability statement. This version replaces that with a contextual fallback that uses the user’s actual target, shift, and attendance situation, then suggests clearer next questions.
              </div>
            </SectionCard>

            <SectionCard title="Better fallback behavior" icon={CheckCircle2}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/75">
                The fallback now stays useful. Instead of saying what Seyalla can theoretically do, it says what it already knows about you and guides you toward the most relevant next question.
              </div>
            </SectionCard>
          </div>
        )}

        {viewMode === "workflow" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title={scopeMode === "STAFF" ? "Workflow execution cards" : "Admin approvals inbox"} icon={ClipboardList}>
              <div className="space-y-3 text-sm text-white/75">
                {workflowCards.map((card) => (
                  <div key={card.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-white">{card.title}</div>
                      <Badge className="rounded-full border-0 bg-white/10 text-white/70">{card.status}</Badge>
                    </div>
                    <div className="mt-2 text-white/65">{card.description}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-100">{card.primaryAction}</button>
                      {card.secondaryAction ? <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">{card.secondaryAction}</button> : null}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Support watchlist" icon={ShieldCheck}>
              <div className="space-y-3 text-sm text-white/75">
                {scopeMode === "ADMIN" ? supportWatchlist.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-white">{item.name}</div>
                      <Badge className="rounded-full border-0 bg-white/10 text-white/70">{item.priority}</Badge>
                    </div>
                    <div className="mt-2 text-white/65">{item.reason}</div>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Support watchlist is shown in Admin Mode for team oversight.</div>
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {viewMode === "architecture" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Intent dictionary as routing model" icon={Bot}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Seyalla should not route only from loose keywords. It should classify role, intent, entities, scope, and response mode before answering.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">The same AI engine can still be used, but its business logic becomes more reliable when staff intents, admin intents, and shared intents are explicitly modeled.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">This dictionary gives Seyalla a more premium internal structure: role detection → intent classification → entity extraction → response mode.</div>
              </div>
            </SectionCard>

            <SectionCard title="Role-aware AI design" icon={Bot}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">One AI engine should sit behind the product, but the answer style, permissions, actions, and dashboard context must change based on role.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">In Staff Mode, the same question should lead to personal coaching, self-service explanation, and own-record visibility only.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">In Admin Mode, the same question should lead to broader analysis, operational causes, approvals, and management action suggestions at the allowed scope.</div>
              </div>
            </SectionCard>

            <SectionCard title="Runtime flow" icon={Layers3}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                {[
                  "Frontend sends user message.",
                  "Backend authenticates user and resolves role scope.",
                  "Scoped business context is loaded from trusted data sources.",
                  "Commission, target, and projection logic is computed by the application.",
                  "Thread memory and recent messages are fetched.",
                  "Prompt payload is assembled with role boundary plus trusted context.",
                  "OpenAI generates explanation and next-action guidance.",
                  "Response, analytics event, and memory summary are saved.",
                ].map((item, idx) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300">Step {idx + 1}</div>
                    <div>{item}</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Connected data required" icon={Database}>
              <div className="grid gap-2 text-sm text-white/75">
                {connectedDataSources.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{item}</div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Security model" icon={KeyRound}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                {[
                  "Never pass unrestricted records to the model.",
                  "Scope filtering happens before the prompt is built.",
                  "Admin still receives only store, brand, or team-scoped data.",
                  "Use row-level security in Supabase or rules in Firebase.",
                  "Persist audit events for blocked access requests and admin summaries.",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">{item}</div>
                ))}
              </div>
            </SectionCard>

            <CodeBlock title="OpenAI API route skeleton" code={sampleApiRoute} icon={Bot} />
            <CodeBlock title="Prompt payload example" code={promptPayloadExample} icon={FileText} />
          </div>
        )}

        {viewMode === "prompts" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <CodeBlock title="System prompt" code={systemPrompt} icon={Brain} />
            <CodeBlock title="Developer prompt" code={developerPrompt} icon={UserCog} />
            <SectionCard title="Intent groups and return styles" icon={MessagesSquare}>
              <div className="grid gap-4 md:grid-cols-2 text-sm text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300">Intent groups</div>
                  <div className="space-y-2">
                    <div>• Staff: commission, target, sales performance, coaching, roster, leave, shift swap, attendance, policy, disputes, historical comparison</div>
                    <div>• Admin: team performance, store performance, brand performance, country performance, commission review, approvals, operations, attendance risk, coaching intervention, payroll, permissions, executive summary</div>
                    <div>• Shared: performance, target, comparison, explanation, action, policy</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300">Return styles</div>
                  <div className="space-y-2">
                    {recommendedReturnTypes.map((item) => (
                      <div key={item}>• {item}</div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Prompting strategy" icon={MessagesSquare}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">System prompt sets identity, tone, and commercial behavior.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Developer prompt enforces scope, anti-hallucination, and output shape.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">User payload should be JSON-like and include only trusted calculations and scoped data.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Keep temperature low for reliability and crisp business language.</div>
              </div>
            </SectionCard>
            <SectionCard title="Recommended answer shape" icon={FileText}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/75">Current position → implication → next best action → optional quick chips.</div>
            </SectionCard>
          </div>
        )}

        {viewMode === "schema" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <CodeBlock title="Supabase schema" code={sampleSupabaseSchema} icon={Database} />
            <CodeBlock title="Firebase collection structure" code={firebaseCollections} icon={Database} />
            <SectionCard title="Intent dictionary in backend design" icon={Database}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Each incoming message should first be classified into a role-aware intent like staff_commission_summary, admin_risk_detection, or shared_policy_query.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Then Seyalla should extract entities such as time period, scope, store name, brand, metric, action, person, request type, or value goal.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">After that, the backend should decide whether the response mode is answer, explain, recommend, or act.</div>
              </div>
            </SectionCard>

            <SectionCard title="Memory threads per user" icon={MessagesSquare}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Each user can have multiple chat threads.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Each thread stores chronological messages plus derived intent.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">A separate memory table stores durable preferences such as preferred tone, common questions, and last viewed performance area.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Summarize older threads into compact memory so token usage stays controlled.</div>
              </div>
            </SectionCard>
            <SectionCard title="Which backend to pick" icon={ServerCog}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="font-medium text-white">Supabase</span> is stronger when you want SQL analytics, joins, row-level security, and admin reporting.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="font-medium text-white">Firebase</span> is simpler for rapid app syncing and flexible document storage, but analytics-heavy admin views usually become more work.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">For Seyalla, Supabase is the better default because commission, targets, roles, and admin analytics are relational by nature.</div>
              </div>
            </SectionCard>
          </div>
        )}

        {viewMode === "analytics" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Intent analytics" icon={BarChart3}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Track which formal intents appear most often by role, store, brand, and country.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">This is more useful than generic message counting because it shows where users actually need help: staff commission understanding, admin risk detection, approvals, coaching, and so on.</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Intent analytics should also show which return types are most used, such as watchlists, breakdown tables, or workflow forms.</div>
              </div>
            </SectionCard>

            <SectionCard title="Admin analytics" icon={BarChart3}>
              <div className="space-y-3 text-sm leading-7 text-white/75">
                {[
                  "Top intents by day, store, brand, and user role.",
                  "How often staff ask for commission vs target vs roster topics.",
                  "Blocked access attempts in Staff Mode.",
                  "Average response rating and follow-up depth.",
                  "Which quick actions convert into useful next steps.",
                  "Store teams with high chat usage but low achievement, which may indicate coaching needs.",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">{item}</div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Events to track" icon={Activity}>
              <div className="grid gap-2 text-sm text-white/75">
                {analyticsEvents.map((event) => (
                  <div key={event} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">{event}</div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="KPI ideas for admins" icon={TrendingUp}>
              <div className="grid gap-3 md:grid-cols-2 text-sm text-white/75">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Chat adoption rate</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Resolution without manager escalation</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Most requested projection amount</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Commission explanation completion rate</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Thread retention over 7 and 30 days</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Average admin insight usage by store</div>
              </div>
            </SectionCard>

            <SectionCard title="Recommended first production milestone" icon={Target}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white/75">
                Build phase one with Supabase, OpenAI, scoped API routes, persisted threads, lightweight per-user memory, and an admin dashboard showing intents, blocked scope attempts, and projection usage.
              </div>
            </SectionCard>
          </div>
        )}

        {viewMode === "implementation" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <CodeBlock title="/api/seyalla/chat route" code={sampleApiRoute} icon={Bot} />
            <CodeBlock title="Supabase schema + RLS" code={sampleSupabaseSchema} icon={Database} />
            <CodeBlock title="Memory summarizer" code={summarizerCode} icon={Brain} />
            <CodeBlock title="Admin dashboard component" code={dashboardComponent} icon={BarChart3} />
            <CodeBlock title="Analytics SQL queries" code={dashboardQueries} icon={Activity} />
            <SectionCard title="Self-checks" icon={CheckCircle2}>
              <div className="space-y-3 text-sm text-white/75">
                {selfChecks.map((test) => (
                  <div key={test.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 font-medium text-white">
                      {test.pass ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <XCircle className="h-4 w-4 text-red-300" />}
                      {test.name}
                    </div>
                    <div className="mt-2 text-white/65">{test.details}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
