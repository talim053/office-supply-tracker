export interface DailySupply {
  id: string;
  date: string; // Full ISO 8601 date-time string (e.g., YYYY-MM-DDTHH:mm:ss.sssZ)
  teaQuantity: number;
  samosaQuantity: number;
  snacksQuantity: number;
}