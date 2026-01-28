import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../utils/helpers';

export default function Reports({ transactions, currency }) {
  const [year, setYear] = useState(new Date().getFullYear());

  const monthlyData = useMemo(() => {
    const data = Array(12).fill(0).map((_, i) => ({ 
      month: new Date(0, i).toLocaleString('default', { month: 'short' }), 
      revenue: 0, 
      guests: 0, 
      subs: 0 
    }));

    transactions.forEach(t => {
      const d = new Date(t.date);
      if (d.getFullYear() === year) {
        const m = d.getMonth();
        data[m].revenue += Number(t.amount);
        if (t.type === 'guest') data[m].guests += 1;
        if (t.type === 'subscription') data[m].subs += 1;
      }
    });
    return data;
  }, [transactions, year]);

  const totalRev = monthlyData.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Financial Reports</h3>
        <select 
          className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-indigo-900 text-white border-none">
          <p className="text-indigo-200 text-sm mb-1">Total Revenue ({year})</p>
          <h2 className="text-4xl font-bold">{formatCurrency(totalRev, currency)}</h2>
        </Card>
        <Card>
          <p className="text-gray-500 text-sm mb-1">Top Performing Month</p>
          <h2 className="text-2xl font-bold text-gray-800">
            {monthlyData.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current).month}
          </h2>
        </Card>
      </div>

      <Card>
        <h4 className="font-bold text-gray-800 mb-6">Monthly Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-500">Month</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-right">Revenue</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-right">Subscriptions</th>
                <th className="px-4 py-3 font-semibold text-gray-500 text-right">Guest Walk-ins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {monthlyData.map((d, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{d.month}</td>
                  <td className="px-4 py-3 text-right font-medium text-emerald-600">{formatCurrency(d.revenue, currency)}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{d.subs}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{d.guests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}