import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const RoleSelectionCard = ({
  role,
  title,
  description,
  icon: Icon,
  badgeText,
  features = [],
  buttonText,
  onClick,
  accentColor = 'emerald',
}) => {
  const isEmerald = accentColor === 'emerald';

  return (
    <Card
      hoverEffect={true}
      onClick={onClick}
      className={`
        p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer border-2 transition-all duration-300
        ${isEmerald ? 'hover:border-agri-primary bg-gradient-to-br from-white via-white to-agri-softGreen/30' : 'hover:border-blue-500 bg-gradient-to-br from-white via-white to-agri-softBlue/30'}
      `}
    >
      <div>
        {/* Top Icon and Badge */}
        <div className="flex items-center justify-between mb-6">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300 ${
              isEmerald ? 'bg-agri-primary' : 'bg-agri-textDark'
            }`}
          >
            <Icon className="w-8 h-8 stroke-[2]" />
          </div>

          <span
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              isEmerald
                ? 'bg-agri-softGreen text-agri-dark border-agri-primary/20'
                : 'bg-agri-softBlue text-blue-700 border-blue-200'
            }`}
          >
            {badgeText}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-agri-textDark mb-3 group-hover:text-agri-primary transition-colors">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-agri-textSecondary leading-relaxed mb-6 font-normal">
          {description}
        </p>

        {/* Highlight features */}
        {features.length > 0 && (
          <ul className="space-y-2 mb-8 pt-4 border-t border-gray-100">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs font-medium text-agri-textDark">
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isEmerald ? 'text-agri-primary' : 'text-blue-600'}`} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <Button
          variant={isEmerald ? 'primary' : 'dark'}
          size="md"
          icon={ArrowRight}
          iconPosition="right"
          className="w-full justify-center font-bold py-3"
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};
