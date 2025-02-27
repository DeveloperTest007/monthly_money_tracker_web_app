import { useState } from 'react';
import * as Icons from 'react-icons/ri';

const ICONS = [
  { name: 'Shopping', icon: Icons.RiShoppingBag2Line },
  { name: 'Food', icon: Icons.RiRestaurant2Line },
  { name: 'Transport', icon: Icons.RiCarLine },
  { name: 'House', icon: Icons.RiHome2Line },
  { name: 'Entertainment', icon: Icons.RiGamepadLine },
  { name: 'Health', icon: Icons.RiHeartPulseLine },
  { name: 'Education', icon: Icons.RiBookOpenLine },
  { name: 'Work', icon: Icons.RiBriefcaseLine },
  { name: 'Gift', icon: Icons.RiGiftLine },
  { name: 'Savings', icon: Icons.RiSafeLine },
  { name: 'Investment', icon: Icons.RiLineChartLine },
  { name: 'Income', icon: Icons.RiMoneyDollarCircleLine },
];

export default function IconPicker({ selectedIcon, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const SelectedIcon = Icons[selectedIcon] || Icons.RiQuestionLine;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center px-3 py-2 border rounded-lg"
      >
        <SelectedIcon className="w-6 h-6 mr-2" />
        <span className="text-gray-700">Select Icon</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 p-3 bg-white rounded-lg shadow-xl border grid grid-cols-4 gap-3">
          {ICONS.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                onChange(Icon.name);
                setIsOpen(false);
              }}
              className={`p-2 rounded-lg hover:bg-gray-100 flex flex-col items-center ${
                selectedIcon === Icon.name ? 'bg-blue-50 text-blue-600' : ''
              }`}
              title={name}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
