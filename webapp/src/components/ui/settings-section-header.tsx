interface SettingsSectionHeaderProps {
  title: string;
}

export function SettingsSectionHeader({ title }: SettingsSectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-2 py-2">
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      <div className="flex-1 h-px bg-gray-300" />
    </div>
  );
}
