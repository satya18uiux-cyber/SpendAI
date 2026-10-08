import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  HeartPulse,
  GraduationCap,
  Tag,
  LucideIcon,
} from 'lucide-react';
import { ExpenseCategory } from '../../types';
import { CATEGORY_CONFIG } from '../../data/initialExpenses';

interface CategoryIconProps {
  category: ExpenseCategory;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ICON_MAP: Record<ExpenseCategory, LucideIcon> = {
  Food: Utensils,
  Travel: Car,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Entertainment: Film,
  Health: HeartPulse,
  Education: GraduationCap,
  Other: Tag,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 'md',
  className = '',
}) => {
  const Icon = ICON_MAP[category] || Tag;
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.Other;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const iconSizes = {
    sm: 15,
    md: 18,
    lg: 22,
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 transition-colors ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: config.bgLight,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      <Icon size={iconSizes[size]} strokeWidth={2.2} />
    </div>
  );
};
