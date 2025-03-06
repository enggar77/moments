import { supabase } from '../../supabaseClient';

function validateFile(file) {
	const allowedTypes = ['image/jpeg', 'image/png'];
	const maxSize = 2 * 1024 * 1024; // 2MB

	if (!allowedTypes.includes(file.type)) {
		alert('Please upload JPEG or PNG');
		return false;
	}

	if (file.size > maxSize) {
		alert('File size can not exceed 2MB.');
		return false;
	}

	return true;
}

export async function uploadImage(fileInput, bucket = 'prea-images') {
	const file = fileInput.files[0];
	if (!file || !validateFile(file)) {
		fileInput.value = '';
		return null;
	}

	const filePath = `${Date.now()}-${file.name}`; // Unique filename

	const { data, error } = await supabase.storage
		.from(bucket)
		.upload(filePath, file);

	if (error) {
		console.error('Upload error:', error);
		fileInput.value = '';
		return null;
	}

	return supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
}
