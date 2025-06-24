export interface TextItem {
  id: string;
  text: string;
  position?: 'top' | 'middle' | 'bottom';
  x?: number;
  y?: number;
  fontFamily?: string;
  fontColor?: string;
  fontSize?: number;
}
