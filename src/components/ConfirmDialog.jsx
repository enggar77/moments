const ConfirmDialog = ({
	isOpen,
	onClose,
	onConfirm,
	title = 'Confirm Action',
	message = 'Are you sure you want to continue?',
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	confirmButtonClass = 'btn-error',
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70">
			<div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full">
				<div className="p-4">
					<h3 className="text-lg font-semibold mb-2">{title}</h3>
					<p>{message}</p>
				</div>

				<div className="flex justify-end gap-2 p-4 border-t">
					<button onClick={onClose} className="btn btn-ghost">
						{cancelText}
					</button>
					<button
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className={`btn ${confirmButtonClass}`}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDialog;
