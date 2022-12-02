import type {
  Dispatch,
  PointerEvent,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";

export type DrawingContextProps = [
  RefObject<HTMLCanvasElement> | undefined,
  {
    type: DrawingType;
    lineWidth: number;
    rotate: number;
    color: string;
    fill: boolean;
  },
  {
    pointerDown: (event: PointerEvent<HTMLCanvasElement>) => void;
    pointerMove: (event: PointerEvent<HTMLCanvasElement>) => void;
    pointerUp: (event: PointerEvent<HTMLCanvasElement>) => void;
    pointerLeave: (event: PointerEvent<HTMLCanvasElement>) => void;
    scale: (scale: number) => void;
    changeColor: (color: string) => void;
    changeLineWidth: (lineWidth: number) => void;
    fillStyle: (style: string | CanvasGradient | CanvasPattern) => void;
    strokeStyle: (style: string | CanvasGradient | CanvasPattern) => void;
    eraseCanvas: () => void;
    changeRotate: Dispatch<SetStateAction<number>>;
    changeType: Dispatch<SetStateAction<DrawingType>>;
    changeFill: Dispatch<SetStateAction<boolean>>;
    resizeCanvas: (width: number, height: number) => void;
    updateEvents: (events: DrawingEvent[]) => void;
    clearEvents: () => void;
    getEvents: () => DrawingEvent[];
    revert: () => void;
    restore: () => void;
  }
];

export interface DrawingProviderProps {
  children?: ReactNode;
}

export type DrawingType =
  | "draw"
  | "clear"
  | "erase"
  | "rectangle"
  | "circle"
  | "triangle"
  | "line";

export interface DrawingPath {
  x: number;
  y: number;
  pressure: number;
}

export interface DrawingEvent {
  color: string;
  type: DrawingType;
  rotate: number;
  lineWidth: number;
  fill: boolean;
  path: DrawingPath[];
}
