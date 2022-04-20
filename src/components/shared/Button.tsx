import { FC, ReactNode, useState } from "react";
import cls from "classnames";

type ButtonSizes = "sm" | "md" | "lg";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  text?: string;
  isPrimary?: boolean;
  disabled?: boolean;
  size?: ButtonSizes;
}

const Button: FC<ButtonProps> = ({
  onClick,
  className,
  disabled = false,
  text = "Button",
  size = "md",
  isPrimary = false,
  ...props
}) => {
  const btnStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cls(
        btnStyles[size] || "",
        className,
        isPrimary ? "bg-red-600 text-green-100" : "bg-green-600 text-green-100",
        "rounded-lg hover:shadow-lg transition-shadow duration-200",
        "outline outline-0 focus:outline-1 active:outline-2 outline-green-800",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
