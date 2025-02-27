import { useState } from 'react';

const COLORS = [
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Pink', value: '#EC4899' },
];

export default function ColorPicker({ selectedColor, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center px-3 py-2 border rounded-lg"
      >
        <span className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: selectedColor }} />
        <span className="text-gray-700">Select Color</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 p-2 bg-white rounded-lg shadow-xl border grid grid-cols-5 gap-2">
          {COLORS.map(color => (
            <button
              key={color.value}
              type="button"
              onClick={() => {
                onChange(color.value);
                setIsOpen(false);
              }}
              className={`w-8 h-8 rounded-full hover:scale-110 transition-transform ${
                selectedColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
