import { Ticket } from 'lucide-react';

export default function Footer() {
	return (
		<footer className='mt-auto absolute bottom-0 left-0 w-full footer sm:footer-horizontal bg-accent text-base-content p-10 px-20 flex flex-col'>
			<div className='footer sm:footer-horizontal p-10  border-b border-gray-300'>
				<aside>
					<div className='flex gap-3 items-center'>
						<Ticket size={32} />
						<p className='text-2xl font-medium'>MOMENTS</p>
					</div>
					<p>Your premier destination for concert tickets</p>
				</aside>
				<nav>
					<h6 className='footer-title normal-case'>Quick Links</h6>
					<a className='link link-hover'>About us</a>
					<a className='link link-hover'>Contact</a>
					<a className='link link-hover'>FAQ</a>
				</nav>
				<nav>
					<h6 className='footer-title normal-case'>Legal</h6>
					<a className='link link-hover'>Terms of use</a>
					<a className='link link-hover'>Privacy policy</a>
					<a className='link link-hover'>Refund policy</a>
				</nav>
				<nav>
					<h6 className='footer-title normal-case'>Follow Us</h6>
					<div className='grid grid-flow-col gap-4'>
						<a>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
							</svg>
						</a>
						<a>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M17 3H21L14 10L21 21H15L10 14L4 21H3L10 12L3 3H9L14 10L17 3Z' />
							</svg>
						</a>
						<a>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<rect
									width='20'
									height='20'
									x='2'
									y='2'
									rx='5'
									ry='5'
								/>
								<path d='M16 11.37A4 4 0 1 1 12.63 8M17.5 6.5h.01' />
							</svg>
						</a>
					</div>
				</nav>
			</div>
			<p className='self-center'>
				© {new Date().getFullYear()} MOMENTS. All rights reserved.
			</p>
		</footer>
	);
}
