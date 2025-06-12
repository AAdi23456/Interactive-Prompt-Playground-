declare module 'rc-slider' {
  import * as React from 'react';

  export interface SliderProps {
    min?: number;
    max?: number;
    step?: number;
    value?: number | number[];
    defaultValue?: number | number[];
    onChange?: (value: number | number[]) => void;
    marks?: Record<number, string | React.ReactNode>;
    allowCross?: boolean;
    pushable?: boolean | number;
    range?: boolean;
    className?: string;
  }

  const Slider: React.FC<SliderProps>;
  export default Slider;
}

declare module 'rc-slider/assets/index.css'; 