import Button from './Button';
import { useEffect, useState } from 'react';
import { uploadImage } from '../libs/uploadImage';
import { Link, useNavigate, useParams } from 'react-router';
import Loading from '../components/Loading';
import { useUser } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Swal from 'sweetalert2';

export default function FormEvent() {
	const [imageUrl, setImageUrl] = useState(null);
	const [loading, setLoading] = useState(false);
	const { user } = useUser();
	const userId = user?.id;
	const initialFormData = {
		name: '',
		description: '',
		location: '',
		eventDate: '',
		price: '',
		totalTickets: '',
		userId: userId,
		time: '',
		imageUrl: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const { eventId } = useParams();

	const navigate = useNavigate();
	const createEvent = useMutation(api.events.create);
	const eventData = eventId
		? useQuery(api.events.getById, { eventId })
		: null;

	const updateEvent = useMutation(api.events.updateEvent);

	useEffect(() => {
		if (eventData && Object.keys(eventData).length > 0) {
			setFormData((prev) => ({
				...prev,
				...eventData,
				eventId,
				eventDate: eventData.eventDate
					? new Date(eventData.eventDate).toISOString().split('T')[0]
					: '',
			}));
		}
	}, [eventData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		let formattedDate = new Date(formData.eventDate);
		formattedDate = formattedDate.getTime();
		const { imageUrl, time, ...restFormData } = formData;
		const finalFormData = {
			...restFormData,
			eventDate: formattedDate,
			price: Number(formData.price),
			totalTickets: Number(formData.totalTickets),
			// imageUrl: imageUrl || formData.imageUrl, // Use existing image if no new one is uploaded
		};

		if (eventId) {
			const { _id, _creationTime, userId, ...restFormData } =
				finalFormData;

			try {
				await updateEvent(restFormData);
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				await createEvent(finalFormData);
			} catch (error) {
				console.log(error);
			}
		}

		setLoading(false); // Hide Loading after delay
		Swal.fire({
			title: 'Event successfuly saved!',
			confirmButtonColor: 'black',
		});
		// Redirect to event list
		navigate('/');
	};

	async function handleFileUpload(event) {
		setLoading(true);

		const uploadedUrl = await uploadImage(event.target);
		if (uploadedUrl) {
			setImageUrl(uploadedUrl);
			setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
			console.log('Image uploaded:', uploadedUrl);
		}

		setLoading(false);
	}
	return (
		<div className="card bg-white p-5">
			{loading && <Loading />}
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="flex flex-col gap-2">
						<fieldset className="fieldset">
							<legend className="fieldset-legend">
								Concert name
							</legend>
							<input
								value={formData.name}
								type="text"
								className="input w-full"
								placeholder="Enter event name"
								onChange={handleChange}
								name="name"
								required
							/>
							<p className="fieldset-label">
								Required. Maximum 100 characters
							</p>
						</fieldset>
						<fieldset className="fieldset">
							<legend className="fieldset-legend">Date</legend>
							<input
								value={formData.eventDate}
								type="date"
								className="input w-full"
								onChange={handleChange}
								name="eventDate"
								required
							/>
						</fieldset>
						<fieldset className="fieldset">
							<legend className="fieldset-legend">Price</legend>
							<input
								value={formData.price}
								type="number"
								className="input w-full"
								onChange={handleChange}
								name="price"
								required
							/>
						</fieldset>
					</div>
					<div className="flex flex-col gap-2">
						<fieldset className="fieldset">
							<legend className="fieldset-legend">
								Location
							</legend>
							<input
								value={formData.location}
								type="text"
								className="input w-full"
								placeholder="Enter location"
								onChange={handleChange}
								name="location"
								required
							/>
							<p className="fieldset-label">Required.</p>
						</fieldset>

						<fieldset className="fieldset">
							<legend className="fieldset-legend">Time</legend>
							<input
								value={formData.time}
								type="time"
								className="input w-full"
								onChange={handleChange}
								name="time"
								required
							/>
						</fieldset>

						<fieldset className="fieldset">
							<legend className="fieldset-legend">
								Total Tickets
							</legend>
							<input
								value={formData.totalTickets}
								type="number"
								className="input w-full"
								onChange={handleChange}
								name="totalTickets"
								required
							/>
						</fieldset>
					</div>
					<fieldset className="fieldset col-span-1 lg:col-span-2">
						<legend className="fieldset-legend">Description</legend>
						<textarea
							value={formData.description}
							className="textarea w-full"
							placeholder="Enter concert description"
							onChange={handleChange}
							name="description"
							required
						></textarea>
						<p className="fieldset-label">Required.</p>
					</fieldset>

					<fieldset className="fieldset col-span-1 lg:col-span-2">
						<legend className="fieldset-legend">Event Image</legend>
						<input
							disabled={loading}
							type="file"
							onChange={handleFileUpload}
							className="file-input w-full border border-dashed"
							name="imageUrl"
							required={!formData.imageUrl}
						/>
						{imageUrl && (
							<div>
								<img
									src={formData.imageUrl}
									alt="Uploaded"
									className="w-32 h-32 mt-2"
								/>
							</div>
						)}
						<label className="fieldset-label">
							PNG, JPG up to 2MB
						</label>
					</fieldset>
				</div>
				<div className="flex">
					<div className="flex ml-auto gap-3">
						<Link to="/dashboard/events">
							<Button
								type="button"
								className="bg-white text-black border-gray-300"
								onClick={() => setFormData(initialFormData)}
							>
								Cancel
							</Button>
						</Link>
						<Button type="submit" disabled={loading}>
							Save Event
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
