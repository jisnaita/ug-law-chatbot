const API_BASE_URL = 'http://localhost:8000';

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/v1/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  return response.json();
}

export async function getDocuments() {
  const response = await fetch(`${API_BASE_URL}/api/v1/documents`);
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  return response.json();
}

export async function chatWithBot(query: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      message: query,
      user_id: 'demo-user' // TODO: Replace with actual user ID from auth
    }),
  });

  if (!response.ok) {
    throw new Error('Chat request failed');
  }

  const data = await response.json();
  
  // Map backend response to frontend expected format
  return {
    answer: data.response,
    chat_id: data.chat_id,
    citations: data.citations
  };
}
