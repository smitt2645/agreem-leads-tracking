const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const getStoredAuth = () => {
  try {
    const auth = localStorage.getItem('leads_app_auth');
    return auth ? JSON.parse(auth) : null;
  } catch {
    return null;
  }
};

export const setStoredAuth = (user, pass) => {
  if (user && pass) {
    const token = btoa(`${user}:${pass}`);
    const authObj = { user, token };
    localStorage.setItem('leads_app_auth', JSON.stringify(authObj));
    return authObj;
  } else {
    localStorage.removeItem('leads_app_auth');
    return null;
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem('leads_app_auth');
};

const getAuthHeaders = () => {
  const auth = getStoredAuth();
  if (auth && auth.token) {
    return { Authorization: `Basic ${auth.token}` };
  }
  return {};
};

export const checkAuth = async (user, pass) => {
  const token = btoa(`${user}:${pass}`);
  const res = await fetch(`${BASE_URL}/health`, {
    headers: {
      Authorization: `Basic ${token}`
    }
  });
  if (res.status === 401) {
    throw new Error('Invalid username or password');
  }
  if (!res.ok) {
    throw new Error('Failed to connect to server');
  }
  return { user, token };
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('leads_auth_required'));
  }
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.errors ? data.errors.join(', ') : data.message || 'Request failed';
    throw new Error(errorMsg);
  }
  return data;
};

export const fetchLeads = async ({ search = '', status = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);

  const res = await fetch(`${BASE_URL}/leads?${params.toString()}`, {
    headers: {
      ...getAuthHeaders()
    }
  });
  return handleResponse(res);
};

export const fetchLeadById = async (id) => {
  const res = await fetch(`${BASE_URL}/leads/${id}`, {
    headers: {
      ...getAuthHeaders()
    }
  });
  return handleResponse(res);
};

export const createLead = async (leadData) => {
  const res = await fetch(`${BASE_URL}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(leadData)
  });
  return handleResponse(res);
};

export const updateLead = async (id, leadData) => {
  const res = await fetch(`${BASE_URL}/leads/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(leadData)
  });
  return handleResponse(res);
};

export const deleteLead = async (id) => {
  const res = await fetch(`${BASE_URL}/leads/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    }
  });
  return handleResponse(res);
};

export const fetchLeadNotes = async (leadId) => {
  const res = await fetch(`${BASE_URL}/leads/${leadId}/notes`, {
    headers: {
      ...getAuthHeaders()
    }
  });
  return handleResponse(res);
};

export const createLeadNote = async (leadId, noteData) => {
  const res = await fetch(`${BASE_URL}/leads/${leadId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(noteData)
  });
  return handleResponse(res);
};
