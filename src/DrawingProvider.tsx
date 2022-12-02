import type { PointerEvent, ReactElement } from "react";
import type {
  DrawingContextProps,
  DrawingProviderProps,
  DrawingEvent,
  DrawingPath,
  DrawingType,
} from "./interface";
import {
  createContext,
  useCallback,
  useRef,
  useState,
  useContext,
} from "react";
import { cloneDeep } from "lodash";

const DrawingContext = createContext<DrawingContextProps>([
  undefined,
  {
    type: "draw",
    lineWidth: 2,
    rotate: 0,
    color: "#000000",
    fill: false,
  },
  {
    pointerDown: () => undefined,
    pointerLeave: () => undefined,
    pointerMove: () => undefined,
    pointerUp: () => undefined,
    scale: () => undefined,
    changeColor: () => undefined,
    changeLineWidth: () => undefined,
    fillStyle: () => undefined,
    strokeStyle: () => undefined,
    eraseCanvas: () => undefined,
    changeRotate: () => undefined,
    changeType: () => undefined,
    resizeCanvas: () => undefined,
    updateEvents: () => undefined,
    clearEvents: () => undefined,
    getEvents: () => [],
    changeFill: () => undefined,
    restore: () => undefined,
    revert: () => undefined,
  },
]);

export const useDrawing = (): DrawingContextProps =>
  useContext<DrawingContextProps>(DrawingContext);

export function DrawingProvider({
  children,
}: DrawingProviderProps): ReactElement {
  const [type, setType] = useState<DrawingType>("draw");
  const [lineWidth, setLineWidth] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [color, setColor] = useState("#000000");
  const [fill, setFill] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathRef = useRef<DrawingPath[]>([]);
  const eventsRef = useRef<DrawingEvent[]>([]);
  const revertsRef = useRef<DrawingEvent[]>([]);

  const clearRect = useCallback(
    (x: number, y: number, w: number, h: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      return context.clearRect(x, y, w, h);
    },
    []
  );

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    return context.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const fillRect = useCallback((x: number, y: number, w: number, h: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    return context.fillRect(x, y, w, h);
  }, []);

  const strokeRect = useCallback(
    (x: number, y: number, w: number, h: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      return context.strokeRect(x, y, w, h);
    },
    []
  );

  const strokeTriangle = useCallback(
    (x: number, y: number, w: number, h: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y + h);
      context.lineTo(x + w, y + h);
      context.closePath();
      context.stroke();
    },
    []
  );

  const fillTriangle = useCallback(
    (x: number, y: number, w: number, h: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y + h);
      context.lineTo(x + w, y + h);
      context.closePath();
      context.fill();
    },
    []
  );

  const strokeCircle = useCallback(
    (x: number, y: number, w: number, h: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      context.beginPath();
      context.arc(
        x + w / 2,
        y + h / 2,
        Math.sqrt((w * w) / 4 + (h * h) / 4),
        0,
        Math.PI * 2
      );
      context.closePath();
      context.stroke();
    },
    []
  );

  const fillCircle = useCallback(
    (x: number, y: number, w: number, h: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      context.beginPath();
      context.arc(
        x + w / 2,
        y + h / 2,
        Math.sqrt((w * w) / 4 + (h * h) / 4),
        0,
        Math.PI * 2
      );
      context.closePath();
      context.fill();
    },
    []
  );

  const fillStyle = useCallback(
    (style: string | CanvasGradient | CanvasPattern) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      context.fillStyle = style;
    },
    []
  );

  const strokeStyle = useCallback(
    (style: string | CanvasGradient | CanvasPattern) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      context.fillStyle = style;
    },
    []
  );

  const strokeLine = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    },
    []
  );

  const changeLineWidth = useCallback(
    (value: number) =>
      setLineWidth(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return value;
        context.lineWidth = value;
        return value;
      }),
    []
  );

  const changeColor = useCallback(
    (value: string) =>
      setColor(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return value;
        context.fillStyle = value;
        context.strokeStyle = value;
        return value;
      }),
    []
  );

  const rotateCanvas = useCallback((degree: number, x = 0, y = 0) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.translate(x, y);
    const radian = (Math.PI / 180) * degree;
    context.rotate(radian);
    context.translate(-x, -y);
  }, []);

  const saveContext = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.save();
  }, []);

  const restoreContext = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.restore();
  }, []);

  const multiplyPoint = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return [x, y];
    return [x * canvas.width, y * canvas.height];
  }, []);

  const dividePoint = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return [x, y];
    return [x / canvas.width, y / canvas.height];
  }, []);

  const scale = useCallback((scale: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.scale(scale, scale);
  }, []);

  const pointerDown = useCallback(
    ({ pressure, nativeEvent }: PointerEvent<HTMLCanvasElement>) => {
      if (!pressure) return;
      const { offsetX, offsetY } = nativeEvent;
      switch (type) {
        case "draw":
          fillRect(offsetX, offsetY, lineWidth, lineWidth);
          break;
        case "erase":
          clearRect(offsetX, offsetY, lineWidth, lineWidth);
          break;
      }
      const [x, y] = dividePoint(offsetX, offsetY);
      pathRef.current.push({
        x,
        y,
        pressure,
      });
    },
    [fillRect, clearRect, dividePoint, type, lineWidth]
  );

  const restoreDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.save();
    eventsRef.current.forEach(
      ({ color, type, path, lineWidth, rotate, fill }) => {
        context.fillStyle = color;
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        const start = path.at(0);
        const end = path.at(-1);
        switch (type) {
          case "draw":
            path.forEach(({ x, y }) => {
              const [sx, sy] = multiplyPoint(x, y);
              fillRect(sx, sy, lineWidth, lineWidth);
            });
            break;
          case "erase":
            path.forEach(({ x, y }) => {
              const [sx, sy] = multiplyPoint(x, y);
              clearRect(sx, sy, lineWidth, lineWidth);
            });
            break;
          case "clear":
            clearCanvas();
            break;
          case "line": {
            if (!start || !end) break;
            const [sx, sy] = multiplyPoint(start.x, start.y);
            const [ex, ey] = multiplyPoint(end.x, end.y);
            strokeLine(sx, sy, ex, ey);
            break;
          }
          case "rectangle": {
            if (!start || !end) break;
            const [sx, sy] = multiplyPoint(start.x, start.y);
            const [ex, ey] = multiplyPoint(end.x, end.y);
            saveContext();
            rotateCanvas(rotate, (sx + ex) / 2, (sy + ey) / 2);
            const draw = fill ? fillRect : strokeRect;
            draw(sx, sy, ex - sx, ey - sy);
            restoreContext();
            break;
          }
          case "triangle": {
            if (!start || !end) break;
            const [sx, sy] = multiplyPoint(start.x, start.y);
            const [ex, ey] = multiplyPoint(end.x, end.y);
            saveContext();
            rotateCanvas(rotate, (sx + ex) / 2, (sy + ey) / 2);
            const draw = fill ? fillTriangle : strokeTriangle;
            draw(sx, sy, ex - sx, ey - sy);
            restoreContext();
            break;
          }
          case "circle": {
            if (!start || !end) break;
            const [sx, sy] = multiplyPoint(start.x, start.y);
            const [ex, ey] = multiplyPoint(end.x, end.y);
            saveContext();
            rotateCanvas(rotate, (sx + ex) / 2, (sy + ey) / 2);
            const draw = fill ? fillCircle : strokeCircle;
            draw(sx, sy, ex - sx, ey - sy);
            restoreContext();
            break;
          }
        }
      }
    );
    restoreContext();
  }, [
    clearCanvas,
    clearRect,
    fillCircle,
    fillRect,
    fillTriangle,
    multiplyPoint,
    restoreContext,
    rotateCanvas,
    saveContext,
    strokeCircle,
    strokeLine,
    strokeRect,
    strokeTriangle,
  ]);

  const pointerMove = useCallback(
    ({ pressure, nativeEvent }: PointerEvent<HTMLCanvasElement>) => {
      if (!pressure) return;
      const { offsetX, offsetY } = nativeEvent;
      const start = pathRef.current[0];
      if (!start) return;
      const [sx, sy] = multiplyPoint(start.x, start.y);
      switch (type) {
        case "draw":
          fillRect(offsetX, offsetY, lineWidth, lineWidth);
          break;
        case "erase":
          clearRect(offsetX, offsetY, lineWidth, lineWidth);
          break;
        case "line":
          clearCanvas();
          restoreDrawing();
          strokeLine(sx, sy, offsetX, offsetY);
          break;
        case "rectangle": {
          clearCanvas();
          restoreDrawing();
          saveContext();
          rotateCanvas(rotate, (sx + offsetX) / 2, (sy + offsetY) / 2);
          const draw = fill ? fillRect : strokeRect;
          draw(sx, sy, offsetX - sx, offsetY - sy);
          restoreContext();
          break;
        }
        case "triangle": {
          clearCanvas();
          restoreDrawing();
          saveContext();
          rotateCanvas(rotate, (sx + offsetX) / 2, (sy + offsetY) / 2);
          const draw = fill ? fillTriangle : strokeTriangle;
          draw(sx, sy, offsetX - sx, offsetY - sy);
          restoreContext();
          break;
        }
        case "circle": {
          clearCanvas();
          restoreDrawing();
          saveContext();
          rotateCanvas(rotate, (sx + offsetX) / 2, (sy + offsetY) / 2);
          const draw = fill ? fillCircle : strokeCircle;
          draw(sx, sy, offsetX - sx, offsetY - sy);
          restoreContext();
          break;
        }
      }
      const [x, y] = dividePoint(offsetX, offsetY);
      pathRef.current.push({
        x,
        y,
        pressure,
      });
    },
    [
      fillRect,
      clearRect,
      dividePoint,
      restoreDrawing,
      clearCanvas,
      strokeCircle,
      fillCircle,
      strokeLine,
      strokeRect,
      strokeTriangle,
      fillTriangle,
      rotateCanvas,
      saveContext,
      restoreContext,
      multiplyPoint,
      type,
      lineWidth,
      rotate,
      fill,
    ]
  );

  const pointerUp = useCallback(() => {
    eventsRef.current.push({
      path: pathRef.current,
      color,
      type,
      rotate,
      fill,
      lineWidth,
    });
    pathRef.current = [];
  }, [type, color, rotate, lineWidth, fill]);

  const pointerLeave = useCallback(
    ({ pressure }: PointerEvent<HTMLCanvasElement>) => {
      if (pressure) pointerUp();
    },
    [pointerUp]
  );

  const resizeCanvas = useCallback((width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
  }, []);

  const updateEvents = useCallback(
    (events: DrawingEvent[]) => {
      eventsRef.current = cloneDeep(events);
      restoreDrawing();
    },
    [restoreDrawing]
  );

  const clearEvents = useCallback(() => {
    eventsRef.current = [];
    revertsRef.current = [];
  }, []);

  const getEvents = useCallback(() => cloneDeep(eventsRef.current), []);

  const eraseCanvas = useCallback(() => {
    clearCanvas();
    eventsRef.current.push({
      path: [],
      color: "#FFFFFF",
      type: "clear",
      rotate: 0,
      fill: false,
      lineWidth: 0,
    });
  }, [clearCanvas]);

  const revert = useCallback(() => {
    const popped = eventsRef.current.pop();
    if (!popped) return;
    revertsRef.current.push(popped);
    clearCanvas();
    restoreDrawing();
  }, [clearCanvas, restoreDrawing]);

  const restore = useCallback(() => {
    const popped = revertsRef.current.pop();
    if (!popped) return;
    eventsRef.current.push(popped);
    clearCanvas();
    restoreDrawing();
  }, [clearCanvas, restoreDrawing]);

  return (
    <DrawingContext.Provider
      value={[
        canvasRef,
        {
          type,
          lineWidth,
          rotate,
          color,
          fill,
        },
        {
          pointerDown,
          pointerLeave,
          pointerMove,
          pointerUp,
          scale,
          changeColor,
          changeLineWidth,
          changeRotate: setRotate,
          changeType: setType,
          changeFill: setFill,
          fillStyle,
          strokeStyle,
          resizeCanvas,
          updateEvents,
          getEvents,
          eraseCanvas,
          clearEvents,
          restore,
          revert,
        },
      ]}
    >
      {children}
    </DrawingContext.Provider>
  );
}
