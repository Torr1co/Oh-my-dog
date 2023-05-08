import React from "react";
import { cn } from "~/utils/styles";
import { type FC } from "~/utils/types";

const SIZES = {
  xs: "w-1 h-1",
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2 h-2",
  xl: "w-2.5 h-2.5",
};

type Size = keyof typeof SIZES;
const Sizes = Object.fromEntries(Object.keys(SIZES).map((s) => [s, s])) as {
  [key in Size]: key;
};

const Dot = ({ className, size }: FC<{ size: Size }>) => (
  <i
    className={cn(
      "mx-px inline-block animate-blink rounded-full bg-white",
      className,
      SIZES[size]
    )}
  />
);

const Loading = ({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: Size;
}) => (
  <div className={cn(className, "inline-flex h-full w-full items-center")}>
    <span className="absolute inset-0 flex h-full w-full select-none items-center justify-center">
      <Dot className={"animation-delay-0 dela"} size={size} />
      <Dot className={"animation-delay-200"} size={size} />
      <Dot className={"animation-delay-400"} size={size} />
    </span>
  </div>
);

Loading.Sizes = Sizes;

export default Loading;
