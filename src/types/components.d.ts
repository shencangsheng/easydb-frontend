// 定义 FilterList 组件的 Props 接口
export interface FilterListProps {
  items: string[];
  placeholderText?: string;
  icon?: React.ReactNode;
  onSelect?: (item: string) => void;
}

// 声明 FilterList 组件
export const FilterList: <T>(props: FilterListProps<T>) => JSX.Element;
