import React, { type ButtonHTMLAttributes } from "react";
import { hasKey } from "~/utils/objUtils";
import { cn } from "~/utils/styles";
import { type FC } from "~/utils/types";
import Loading from "./Loading";

const SIZES = {
  sm: "px-4 py-2",
  md: "px-6 py-3",
} as const;

const KINDS = {
  primary:
    "bg-primary-400 text-white font-semibold disabled:brightness-90 disabled:text-opacity-50",
  secondary: "bg-secondary-400 text-white font-semibold",
  gray: "bg-gray-300 text-gray-600 font-regular",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: keyof typeof SIZES | string;
  kind?: keyof typeof KINDS | string;
  loading?: boolean;
}

const Button = ({
  size = "md",
  kind = "primary",
  loading = false,
  className,
  children,
  ...props
}: FC<ButtonProps>) => {
  return (
    <button
      className={cn(
        className,
        "relative rounded-md ",
        hasKey(SIZES, size) ? SIZES[size] : size,
        hasKey(KINDS, kind) ? KINDS[kind] : kind
      )}
      disabled={loading}
      {...props}
    >
      {loading && (
        <Loading
          className="absolute inset-0"
          size={hasKey(SIZES, size) ? size : "md"}
        />
      )}
      {children}
    </button>
  );
};

export default Object.assign(Button, { SIZES, KINDS });
