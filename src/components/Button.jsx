export default function Button({
	className,
	onClick,
	children,
	icon,
	type,
	disabled,
}) {
	return (
		<button
			className={`btn ${className}`}
			onClick={onClick}
			type={type}
			disabled={disabled}
		>
			{icon}
			{children}
		</button>
	);
}
