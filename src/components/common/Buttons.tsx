import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
  variant?: 'purple' | 'ai-gradient' | 'danger';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  isLoading,
  variant = 'purple',
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    purple: 'bg-[#4C1D95] hover:bg-[#3B0764] text-white shadow-sm shadow-purple-900/10',
    'ai-gradient':
      'bg-gradient-to-r from-[#4C1D95] to-[#6366F1] hover:opacity-95 text-white shadow-md shadow-indigo-900/20',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-900/10',
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`w-full min-h-[48px] py-3 px-5 rounded-2xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none ${variantStyles[variant]} ${className}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  icon,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      className={`min-h-[44px] py-2.5 px-4 rounded-2xl font-semibold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none shadow-xs ${className}`}
    >
      {icon && <span className="shrink-0 text-slate-500">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  badge?: number | boolean;
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  badge,
  active,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      aria-label={label}
      className={`relative min-w-[44px] min-h-[44px] p-2 rounded-2xl flex items-center justify-center transition-colors cursor-pointer active:scale-95 ${
        active
          ? 'bg-purple-100 text-purple-900'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
      } ${className}`}
    >
      {icon}
      {badge && (
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-600 ring-2 ring-white" />
      )}
    </button>
  );
};

interface FilterChipProps {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active,
  count,
  onClick,
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
        active
          ? 'bg-[#4C1D95] text-white shadow-xs'
          : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            active ? 'bg-purple-400/30 text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
