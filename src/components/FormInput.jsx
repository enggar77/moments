const FormInput = ({
	label,
	name,
	type = 'text',
	value,
	onChange,
	error,
	placeholder = '',
	required = false,
	disabled = false,
	options = [], // For select inputs
	min, // For number inputs
	max, // For number inputs
	className = '',
	rows = 3, // For textarea
}) => {
	const renderInput = () => {
		switch (type) {
			case 'textarea':
				return (
					<textarea
						id={name}
						name={name}
						value={value || ''}
						onChange={onChange}
						placeholder={placeholder}
						required={required}
						disabled={disabled}
						rows={rows}
						className={`textarea textarea-bordered w-full ${
							error ? 'textarea-error' : ''
						} ${className}`}
					/>
				);

			case 'select':
				return (
					<select
						id={name}
						name={name}
						value={value || ''}
						onChange={onChange}
						required={required}
						disabled={disabled}
						className={`select select-bordered w-full ${
							error ? 'select-error' : ''
						} ${className}`}
					>
						<option value="" disabled>
							{placeholder || 'Select an option'}
						</option>
						{options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				);

			case 'number':
				return (
					<input
						type="number"
						id={name}
						name={name}
						value={value || ''}
						onChange={onChange}
						placeholder={placeholder}
						required={required}
						disabled={disabled}
						min={min}
						max={max}
						className={`input input-bordered w-full ${
							error ? 'input-error' : ''
						} ${className}`}
					/>
				);

			default:
				return (
					<input
						type={type}
						id={name}
						name={name}
						value={value || ''}
						onChange={onChange}
						placeholder={placeholder}
						required={required}
						disabled={disabled}
						className={`input input-bordered w-full ${
							error ? 'input-error' : ''
						} ${className}`}
					/>
				);
		}
	};

	return (
		<div className="form-control w-full mb-4">
			<label className="label" htmlFor={name}>
				<span className="label-text">
					{label} {required && <span className="text-error">*</span>}
				</span>
			</label>
			{renderInput()}
			{error && (
				<label className="label">
					<span className="label-text-alt text-error">{error}</span>
				</label>
			)}
		</div>
	);
};

export default FormInput;
