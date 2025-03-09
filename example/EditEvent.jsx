"use client";

import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import EventForm from "@/components/EventForm";
import { AlertCircle } from "lucide-react";

export default function EditEventPage() {
  const params = useParams();
  const event = useQuery(api.events.getById, {
    eventId: params.id as Id<"events">,
  });

  if (!event) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Edit Event</h2>
          <p className="text-blue-100 mt-2">Update your event details</p>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">
                Note: If you modify the total number of tickets, any tickets
                already sold will remain valid. You can only increase the total
                number of tickets, not decrease it below the number of tickets
                already sold.
              </p>
            </div>
          </div>

          <EventForm mode="edit" initialData={event} />
        </div>
      </div>
    </div>
  );
}

const onSubmit = async (data) => {
	setIsSubmitting(true);
	try {
		let imageStorageId = null;
		if (selectedImage) {
			imageStorageId = await handleImageUpload(selectedImage);
		}

		// Handle image deletion/update in edit mode
		if (mode === 'edit' && initialData.imageStorageId) {
			if (removedCurrentImage || selectedImage) {
				// Delete the old image if we're removing it or replacing it
				await deleteImage({
					storageId: initialData.imageStorageId,
				});
			} else {
				// If no new image is selected and we're not removing the current one, keep it
				imageStorageId = initialData.imageStorageId;
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

			// Update image or set to null if removed
			await updateEventImage({
				eventId: initialData._id,
				storageId: imageStorageId,
			});

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