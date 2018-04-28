interface ChartItem {
  value: number | number[];
  name: string;
  type?: string;
  label?: any;
  [prop: string]: any;
}

interface Column {
  dataIndex: string;
  name: string;
  align?: string;
  width?: string;
}
interface Menu {
  text: string;
  name: string;
}
