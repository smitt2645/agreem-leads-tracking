import React from 'react';
import { UserCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function StatsBar({ stats }) {
  const cards = [
    {
      title: 'New Leads',
      count: stats.new || 0,
      icon: <Clock size={20} color="#0284c7" />,
      bg: '#e0f2fe'
    },
    {
      title: 'Contacted',
      count: stats.contacted || 0,
      icon: <UserCheck size={20} color="#d97706" />,
      bg: '#fef3c7'
    },
    {
      title: 'Qualified',
      count: stats.qualified || 0,
      icon: <CheckCircle2 size={20} color="#16a34a" />,
      bg: '#dcfce7'
    },
    {
      title: 'Lost',
      count: stats.lost || 0,
      icon: <XCircle size={20} color="#dc2626" />,
      bg: '#fee2e2'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div key={card.title} className="stat-card">
          <div className="stat-info">
            <h4>{card.title}</h4>
            <p>{card.count}</p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: card.bg }}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
