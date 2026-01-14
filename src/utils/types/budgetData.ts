export interface BudgetData {
  budgetNumber: string;
  companyName: string;
  budgetTitle?: string;
  date: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  clientName?: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
}
