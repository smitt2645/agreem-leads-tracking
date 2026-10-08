const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_STATUSES = ['new', 'contacted', 'qualified', 'lost'];

const validateCreateLead = (req, res, next) => {
  const { name, email, phone, status } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (phone !== undefined && phone !== null && typeof phone !== 'string') {
    errors.push('Phone must be a string');
  }

  if (status && !ALLOWED_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  if (phone) req.body.phone = phone.trim();
  if (status) req.body.status = status.toLowerCase();

  next();
};

const validateUpdateLead = (req, res, next) => {
  const { name, email, phone, status } = req.body;
  const errors = [];

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      errors.push('Name cannot be empty');
    } else {
      req.body.name = name.trim();
    }
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.push('A valid email address is required');
    } else {
      req.body.email = email.trim().toLowerCase();
    }
  }

  if (phone !== undefined && phone !== null) {
    if (typeof phone !== 'string') {
      errors.push('Phone must be a string');
    } else {
      req.body.phone = phone.trim();
    }
  }

  if (status !== undefined) {
    if (!ALLOWED_STATUSES.includes(status)) {
      errors.push(`Status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
    } else {
      req.body.status = status.toLowerCase();
    }
  }

  if (Object.keys(req.body).length === 0) {
    errors.push('At least one field must be provided for update');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateCreateNote = (req, res, next) => {
  const { content } = req.body;
  const errors = [];

  if (!content || typeof content !== 'string' || !content.trim()) {
    errors.push('Note content is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  req.body.content = content.trim();
  next();
};

module.exports = {
  validateCreateLead,
  validateUpdateLead,
  validateCreateNote,
  ALLOWED_STATUSES
};
