export interface TextItem {
  id: number;
  text: string;
  position?: 'top' | 'middle' | 'bottom';
  x: number;
  y: number;
  fontFamily: string;
  fontColor: string;
  fontSize: number;
}
