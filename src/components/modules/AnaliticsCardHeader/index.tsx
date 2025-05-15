import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/select.tsx";

interface AnaliticsCardHeaderProps {
  title: string;
  subtitle?: string;
  selectId: string;
  period?: string; // Добавленный пропс для текущего значения периода
  onPeriodChange?: (newPeriod: string) => void; // Добавленный пропс для функции изменения периода
}

export const AnaliticsCardHeader: React.FC<AnaliticsCardHeaderProps> = ({
  title,
  subtitle,
  selectId,
  period,
  onPeriodChange,
}) => {
  return (
    <div className="justify-between items-start flex">
      <div className="flex-col justify-between items-start flex gap-1">
        <div className="text-[#9B9A9D] text-sm font-medium uppercase">
          {title}
        </div>
        {subtitle && <div className="text-[#D8DADF] text-sm">{subtitle}</div>}
      </div>
      <Select
        defaultValue={selectId}
        value={period}
        onValueChange={onPeriodChange}
      >
        <SelectTrigger className="w-full text-[12px] max-w-[95px] py-1.5 pl-3 pr-2 h-8">
          <SelectValue placeholder="Select renewal term" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
