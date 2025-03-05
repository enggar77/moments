import { Link, useRouteError } from 'react-router';
import Button from './Button';

export default function Error() {
	const error = useRouteError();
	console.log(error);

	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<div className="flex flex-col items-center space-y-4">
				<h1>Something went wrong.</h1>
				<p>{error.data || error.message}</p>

				<Link to="/">
					<Button>Go back to homepage</Button>
				</Link>
			</div>
		</div>
	);
}
