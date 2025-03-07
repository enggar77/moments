import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function EditUser({ setIsOpen, user }) {
	const updateRole = useMutation(api.users.updateUserRole);
	const [role, setRole] = useState(user.role);

	function handleClose() {
		setIsOpen(false);
	}

	async function handleSave() {
		const result = await Swal.fire({
			title: 'Are you sure?',
			text: `Change role to "${role}"?`,
			showCancelButton: true,
			confirmButtonText: 'Yes, change role',
			cancelButtonText: 'Cancel',
			width: '25rem',
			customClass: {
				confirmButton: 'btn btn-sm btn-primary mx-2',
				cancelButton: 'btn btn-sm btn-outline mx-2',
				popup: 'rounded-lg',
			},
			buttonsStyling: false,
		});

		if (!result.isConfirmed) return;

		try {
			await updateRole({ userId: user._id, role });

			Swal.fire({
				title: 'Updated!',
				text: 'User role changed successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
				customClass: {
					confirmButton: 'btn btn-sm btn-primary',
					popup: 'rounded-lg',
				},
				buttonsStyling: false,
			});
		} catch (error) {
			console.error(error);

			Swal.fire({
				title: 'Error',
				text: 'Failed to update role.',
				icon: 'error',
				confirmButtonText: 'OK',
				customClass: {
					confirmButton: 'btn btn-sm btn-error',
					popup: 'rounded-lg',
				},
				buttonsStyling: false,
			});
		}

		setIsOpen(false);
	}

	return (
		<dialog className="modal modal-open flex items-center justify-center">
			<div className="modal-box w-[80%] flex flex-col gap-4">
				<h3 className="font-bold text-lg ml-5 lg:ml-15">Edit User</h3>
				<form
					method="dialog"
					className="w-full flex flex-col gap-4 px-5 lg:px-15"
				>
					<fieldset className="fieldset flex items-center gap-4 w-full">
						<legend className="fieldset-legend">Name</legend>
						<input
							disabled
							type="text"
							className="input w-full"
							value={user.name}
						/>
					</fieldset>

					<fieldset className="fieldset flex items-center gap-4 w-full">
						<legend className="fieldset-legend">Email</legend>
						<input
							disabled
							type="text"
							className="input w-full"
							value={user.email}
						/>
					</fieldset>

					{/* Role Selection */}
					<fieldset className="fieldset flex items-center gap-4 w-full">
						<legend className="fieldset-legend">Role</legend>
						<select
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="select w-full"
						>
							<option value="user">User</option>
							<option value="organizer">Organizer</option>
							<option value="admin">Admin</option>
						</select>
					</fieldset>
				</form>

				<div className="modal-action w-full flex justify-end pr-5 lg:pr-15">
					<button className="btn btn-outline" onClick={handleClose}>
						Cancel
					</button>
					<button
						className="btn btn-primary ml-2"
						onClick={handleSave}
					>
						Save
					</button>
				</div>
			</div>
		</dialog>
	);
}
