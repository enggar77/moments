export default function Button({ className, onClick, children, icon, type }) {
	return (
		<button
			className={`btn btn-sm btn-neutral ${className}`}
			onClick={onClick}
			type={type}
		>
			{icon}
			{children}
		</button>
	);
}
