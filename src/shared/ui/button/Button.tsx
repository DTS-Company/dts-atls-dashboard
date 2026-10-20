import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void | Promise<void>; // Изменено!
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "h-9 px-3 text-[13px]",
    md: "h-10 px-4 text-sm",
  };

  // Градиент — фоновая картинка: если кнопке задан свой фон (например, красный «Удалить»), градиент не нужен
  const hasCustomBg = /(^|\s)bg-/.test(className);

  // Variant Classes
  const variantClasses = {
    primary: `${hasCustomBg ? "" : "atls-gradient"} text-white shadow-theme-md hover:brightness-110 disabled:opacity-60`,
    outline:
      "bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-300 dark:hover:bg-brand-500/25",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
