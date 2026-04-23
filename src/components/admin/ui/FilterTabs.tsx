'use client';

interface FilterTab {
  value: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  active: string;
  onChange: (value: string) => void;
}

export default function FilterTabs({ tabs, active, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
            active === tab.value
              ? 'bg-primary text-white shadow-sm shadow-primary/20'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/80'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
