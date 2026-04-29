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
    <div className="flex flex-wrap gap-1.5 p-1 bg-gray-100/80 rounded-2xl">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 ${
            active === tab.value
              ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
