export default function EventImage({ imageUrl, eventName }) {
	if (!imageUrl) return null;

	return (
		<div className="relative w-full h-52">
			<img
				src={imageUrl}
				alt={eventName}
				className="object-cover h-full w-full"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
		</div>
	);
}
