import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

export function useToast() {
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback((message, type = 'info') => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, message, type }]);

		// Auto-remove toast after 3 seconds
		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, 3000);
	}, []);

	const ToastContainer = () => {
		return createPortal(
			<div className="toast toast-end z-50">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={`alert ${getAlertClass(toast.type)}`}
					>
						<span>{toast.message}</span>
					</div>
				))}
			</div>,
			document.body
		);
	};

	// Helper function to get the correct alert class based on type
	const getAlertClass = (type) => {
		switch (type) {
			case 'success':
				return 'alert-success';
			case 'error':
				return 'alert-error';
			case 'warning':
				return 'alert-warning';
			case 'info':
			default:
				return 'alert-info';
		}
	};

	return {
		addToast,
		ToastContainer,
	};
}
