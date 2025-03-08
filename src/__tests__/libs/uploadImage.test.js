import { beforeEach, describe, expect, it, vi } from 'vitest';
import Swal from 'sweetalert2';
import { supabase } from '../../../supabaseClient';
import { validateFile, uploadImage } from '../../libs/uploadImage';

vi.mock('sweetalert2', async () => {
	const originalModule = await vi.importActual('sweetalert2');
	return {
		...originalModule,
		default: {
			fire: vi.fn(),
		},
	};
});

vi.mock('../../../supabaseClient.js', () => ({
	supabase: {
		storage: {
			from: vi.fn().mockReturnThis(),
			upload: vi.fn(),
			getPublicUrl: vi.fn(),
		},
	},
}));

describe('validateFile', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should reject invalid file types', () => {
		const invalidFile = new File(['dummy'], 'test.txt', {
			type: 'text/plain',
		});

		expect(validateFile(invalidFile)).toBe(false);
		expect(Swal.fire).toHaveBeenCalledWith({
			title: 'Please upload JPEG or PNG',
			confirmButtonColor: 'black',
		});
	});

	it('should reject files larger than 2MB', () => {
		const largeFile = new File(['dummy'.repeat(1024 * 1024)], 'large.png', {
			type: 'image/png',
		});
		Object.defineProperty(largeFile, 'size', { value: 3 * 1024 * 1024 }); // 3MB

		expect(validateFile(largeFile)).toBe(false);
		expect(Swal.fire).toHaveBeenCalledWith({
			title: 'File size can not exceed 2MB.',
			confirmButtonColor: 'black',
		});
	});

	it('should accept valid files', () => {
		const validFile = new File(['dummy'], 'valid.png', {
			type: 'image/png',
		});

		expect(validateFile(validFile)).toBe(true);
		expect(Swal.fire).not.toHaveBeenCalled();
	});
});

describe('uploadImage', () => {
	let fileInput;

	beforeEach(() => {
		fileInput = {
			files: [new File(['dummy'], 'valid.png', { type: 'image/png' })],
			value: '',
		};
	});

	it('should return null if no file is selected', async () => {
		fileInput.files = [];
		expect(await uploadImage(fileInput)).toBe(null);
		expect(fileInput.value).toBe('');
	});

	it('should return null if file validation fails', async () => {
		fileInput.files = [
			new File(['dummy'], 'invalid.txt', { type: 'text/plain' }),
		];

		expect(await uploadImage(fileInput)).toBe(null);
		expect(fileInput.value).toBe('');
	});

	it('should return the public URL on successful upload', async () => {
		const mockUrl = 'https://example.com/public/image.png';

		supabase.storage.upload.mockResolvedValueOnce({
			data: {},
			error: null,
		});
		supabase.storage.getPublicUrl.mockReturnValueOnce({
			data: { publicUrl: mockUrl },
		});

		const result = await uploadImage(fileInput);
		expect(result).toBe(mockUrl);
	});

	it('should return null if upload fails', async () => {
		supabase.storage.upload.mockResolvedValueOnce({
			data: null,
			error: 'Upload failed',
		});

		expect(await uploadImage(fileInput)).toBe(null);
		expect(fileInput.value).toBe('');
	});
});
