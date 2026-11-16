import styles from "./Button.module.css";

function Button({
  variante = "primary",
  children,
  onClick,
  type = "button",
  disabled = false,
  ...resto
}) {
  const classeVariante = styles[variante] || styles.primary;
  return (
    <button
      className={`${styles.button} ${classeVariante}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...resto}
    >
      {children}
    </button>
  );
}

export default Button;
