const basicAuth = (req, res, next) => {
  if (process.env.BASIC_AUTH_ENABLED !== 'true') {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Leads API"');
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = credentials[0];
  const pass = credentials[1];

  const validUser = process.env.BASIC_AUTH_USER || 'admin';
  const validPass = process.env.BASIC_AUTH_PASSWORD || 'admin123';

  if (user === validUser && pass === validPass) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
};

module.exports = { basicAuth };
