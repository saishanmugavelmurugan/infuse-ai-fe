/**
 * Safe response parser that avoids "Response body is already used" errors
 * This error occurs because monitoring tools (like rrweb) may clone responses
 * 
 * Solution: Read response body as text first, then parse as JSON
 */

export const safeJsonParse = async (response) => {
  // Read response body as text first to avoid conflicts with monitoring tools
  const text = await response.text();
  
  if (!text) {
    return null;
  }
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return { detail: 'Invalid response format' };
  }
};

export const handleApiResponse = async (response) => {
  const data = await safeJsonParse(response);
  
  if (!response.ok) {
    throw new Error(data?.detail || 'Request failed');
  }
  
  return data;
};

export default { safeJsonParse, handleApiResponse };
