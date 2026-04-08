import { LandAllocation } from "../../types";

export async function calculateFinance(
  allocation: LandAllocation[],
  budget: number
): Promise<{ total_investment: number; expected_profit: number; roi: number; loan_eligibility: number }> {
  const serviceUrl = import.meta.env.VITE_FINANCE_AGENT_URL;
  if (serviceUrl && serviceUrl.startsWith('http')) {
    try {
      const cleanUrl = serviceUrl.replace(/\/$/, '');
      const response = await fetch(`${cleanUrl}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allocation, budget }),
      });
      if (response.ok) return await response.json();
      console.warn(`Finance service returned ${response.status}: ${response.statusText}`);
    } catch (e) {
      console.warn("Finance service failed, falling back to local AI logic:", e);
    }
  }

  const total_revenue = allocation.reduce((sum, item) => sum + item.expected_revenue, 0);
  const total_investment = budget * 0.8; // Simplified: assume 80% of budget is used
  const expected_profit = total_revenue - total_investment;
  const roi = (expected_profit / total_investment) * 100;
  const loan_eligibility = total_investment * 1.5; // Simplified: 150% of investment

  return {
    total_investment,
    expected_profit,
    roi,
    loan_eligibility,
  };
}
