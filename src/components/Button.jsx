export default function Button({ className, onClick, children, icon }) {
	return (
		<button
			className={`btn btn-sm btn-primary ${className}`}
			onClick={onClick}
		>
			{icon}
			{children}
		</button>
	);
}
