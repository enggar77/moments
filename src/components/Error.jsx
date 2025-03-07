import { useNavigate, useRouteError } from 'react-router';
import Button from './Button';
import { ArrowLeft } from 'lucide-react';

export default function Error() {
	const navigate = useNavigate();
	const error = useRouteError();

	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<div className="flex flex-col items-center space-y-4">
				<h1 className="font-semibold text-2xl">
					Something went wrong.
				</h1>
				<p>{error.data || error.message}</p>

				<Button
					className={'btn-primary'}
					onClick={() => navigate(-1)}
					icon={<ArrowLeft className="w-5" />}
				>
					Go back
				</Button>
			</div>
		</div>
	);
}
