import { useParams } from 'react-router';
import { api } from '../../../../convex/_generated/api';
import { useQuery } from 'convex/react';
import EventForm from './EventForm';
import Loading from '../../../components/Loading';

export default function EditEvent() {
	const params = useParams();

	const event = useQuery(
		api.events.getById,
		params.id ? { eventId: params.id } : 'skip'
	);

	if (!event) return <Loading />;

	return <EventForm mode="edit" initialData={event} />;
}
