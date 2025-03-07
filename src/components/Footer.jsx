export default function Footer() {
	return (
		<footer className="flex items-center justify-center text-sm py-5 border-t border-base-content/10">
			<p>
				© {new Date().getFullYear()}{' '}
				<span className="font-semibold">MOMENTS.</span> All rights
				reserved.
			</p>
		</footer>
	);
}
