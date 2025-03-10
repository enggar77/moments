import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useNavigate } from 'react-router';
import Button from '../../Button';
import { useToast } from '../../../libs/useToast';
import { useStorageUrl } from '../../../libs/utils';
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
	name: z.string().min(1, 'Event name is required'),
	description: z.string().min(1, 'Description is required'),
	location: z.string().min(1, 'Location is required'),
	eventDate: z.date().min(new Date(), 'Event date must be in the future'),
	price: z.number().min(0, 'Price must be 0 or greater'),
	totalTickets: z.number().min(1, 'Must have at least 1 ticket'),
});

export default function EventForm({ mode = 'create', initialData }) {
	const { user } = useUser();
	const navigate = useNavigate();
	const { addToast, ToastContainer } = useToast();
	const imageInput = useRef(null);
	const [selectedImage, setSelectedImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [removedCurrentImage, setRemovedCurrentImage] = useState(false);
	const currentImageUrl = useStorageUrl(initialData?.imageStorageId);

	const createEvent = useMutation(api.events.create);
	const updateEvent = useMutation(api.events.updateEvent);
	const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
	const updateEventImage = useMutation(api.storage.updateEventImage);
	const deleteImage = useMutation(api.storage.deleteImage);

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? {
					...initialData,
					eventDate: initialData.eventDate // format date to show in edit mode
						? new Date(initialData.eventDate)
								.toISOString()
								.split('T')[0]
						: '',
				}
			: {},
	});

	async function handleImageUpload(file) {
		try {
			const postUrl = await generateUploadUrl();
			const response = await fetch(postUrl, {
				method: 'POST',
				headers: { 'Content-Type': file.type },
				body: file,
			});
			const { storageId } = await response.json();
			return storageId;
		} catch (error) {
			console.error('Image upload failed:', error);
			return null;
		}
	}

	const onSubmit = async (data) => {
		setIsSubmitting(true);
		try {
			let imageStorageId = null;
			if (selectedImage) {
				imageStorageId = await handleImageUpload(selectedImage);
			}

			// Handle image deletion/update in edit mode
			if (mode === 'edit' && initialData?.imageStorageId) {
				if (removedCurrentImage || selectedImage) {
					// Delete old image from storage
					await deleteImage({
						storageId: initialData.imageStorageId,
					});
				}
			}

			if (mode === 'create') {
				const eventId = await createEvent({
					...data,
					userId: user.id,
					eventDate: data.eventDate.getTime(),
					price: Number(data.price),
					totalTickets: Number(data.totalTickets),
				});

				if (imageStorageId) {
					await updateEventImage({
						eventId,
						storageId: imageStorageId,
					});
				}
				navigate(`/event/${eventId}`);
			} else {
				await updateEvent({
					eventId: initialData._id,
					...data,
					eventDate: data.eventDate.getTime(),
					price: Number(data.price),
					totalTickets: Number(data.totalTickets),
				});

				// Update image - handle both adding new image and removing existing image
				if (imageStorageId || removedCurrentImage) {
					await updateEventImage({
						eventId: initialData._id,
						// If we have a new image, use its ID, otherwise if we're removing the image, pass null
						storageId: imageStorageId ? imageStorageId : null,
					});
				}
				addToast('Event updated successfully', 'success');
				navigate(`/event/${initialData._id}`);
			}
		} catch (error) {
			addToast('Failed to save event', 'error');
			console.error('Submission error:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-6 max-w-2xl mx-auto p-6"
			>
				{mode === 'edit' && (
					<div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
						<div className="flex gap-2 text-amber-800">
							<AlertCircle className="w-5 h-5 shrink-0" />
							<p className="text-sm">
								Note: If you modify the total number of tickets,
								any tickets already sold will remain valid. You
								can only increase the total number of tickets,
								not decrease it below the number of tickets
								already sold.
							</p>
						</div>
					</div>
				)}
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">
							Event Name
						</label>
						<input
							{...register('name')}
							className="input input-bordered w-full"
							placeholder="Event name"
						/>
						{errors.name && (
							<p className="text-error text-sm mt-1">
								{errors.name.message}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Description
						</label>
						<textarea
							{...register('description')}
							className="textarea textarea-bordered w-full h-32"
							placeholder="Event description"
						/>
						{errors.description && (
							<p className="text-error text-sm mt-1">
								{errors.description.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">
								Location
							</label>
							<input
								{...register('location')}
								className="input input-bordered w-full"
								placeholder="Event location"
							/>
							{errors.location && (
								<p className="text-error text-sm mt-1">
									{errors.location.message}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">
								Event Date
							</label>
							<input
								type="date"
								{...register('eventDate', {
									valueAsDate: true,
								})}
								className="input input-bordered w-full"
								min={new Date().toISOString().split('T')[0]}
							/>
							{errors.eventDate && (
								<p className="text-error text-sm mt-1">
									{errors.eventDate.message}
								</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">
								Price (SGD)
							</label>
							<input
								type="number"
								{...register('price', { valueAsNumber: true })}
								className="input input-bordered w-full"
								step="0.01"
							/>
							{errors.price && (
								<p className="text-error text-sm mt-1">
									{errors.price.message}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">
								Tickets Available
							</label>
							<input
								type="number"
								{...register('totalTickets', {
									valueAsNumber: true,
								})}
								className="input input-bordered w-full"
							/>
							{errors.totalTickets && (
								<p className="text-error text-sm mt-1">
									{errors.totalTickets.message}
								</p>
							)}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">
							Event Image
						</label>
						<div className="flex items-center gap-4">
							{(imagePreview ||
								(!removedCurrentImage && currentImageUrl)) && (
								<div className="relative w-full rounded-lg overflow-hidden">
									<img
										src={imagePreview || currentImageUrl}
										alt="Preview"
										className="object-cover w-full h-full"
									/>
									<Button
										onClick={() => {
											setSelectedImage(null);
											setImagePreview(null);
											setRemovedCurrentImage(true);
											if (imageInput.current) {
												imageInput.current.value = '';
											}
										}}
										className="btn btn-circle btn-xs absolute top-1 right-1"
									>
										×
									</Button>
								</div>
							)}

							{!imagePreview &&
								(removedCurrentImage || !currentImageUrl) && (
									<input
										type="file"
										accept="image/*"
										ref={imageInput}
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
												setSelectedImage(file);
												const reader = new FileReader();
												reader.onload = () =>
													setImagePreview(
														reader.result
													);
												reader.readAsDataURL(file);
											}
										}}
										className="file-input file-input-bordered"
									/>
								)}
						</div>
					</div>
				</div>

				<Button
					type="submit"
					disabled={isSubmitting}
					className="btn-primary w-full"
				>
					{isSubmitting
						? 'Saving...'
						: mode === 'create'
							? 'Create Event'
							: 'Update Event'}
				</Button>
			</form>
			<ToastContainer />
		</>
	);
}
