export default function Footer() {
	return (
		<footer className="flex items-center justify-between text-sm py-5 px-5 lg:px-10 border-t border-base-content/10">
			<p>
				© {new Date().getFullYear()}{' '}
				<span className="font-semibold">MOMENTS.</span> All rights
				reserved.
			</p>
			<p>
				Want to become a seller?{' '}
				<a
					href="mailto:ejihandoko@gmail.com"
					className="underline font-semibold"
				>
					ejihandoko@gmail.com
				</a>
			</p>
		</footer>
	);
}
