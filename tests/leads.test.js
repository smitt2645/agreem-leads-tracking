const request = require('supertest');
const app = require('../src/app');
const { sequelize, Lead, Note } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Leads API Endpoints', () => {
  let createdLeadId;

  test('POST /api/leads - should create a new lead successfully', async () => {
    const payload = {
      name: 'Michael Scott',
      email: 'michael.scott@dundermifflin.com',
      phone: '+1 555-1234',
      status: 'new'
    };

    const res = await request(app)
      .post('/api/leads')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe(payload.name);
    expect(res.body.data.email).toBe(payload.email);
    expect(res.body.data.status).toBe('new');

    createdLeadId = res.body.data.id;
  });

  test('POST /api/leads - should fail when email is invalid', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Invalid Email User',
        email: 'invalid-email-format',
        phone: '+1 555-9999'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toContain('A valid email address is required');
  });

  test('POST /api/leads - should fail when duplicate email is used', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Michael Duplicate',
        email: 'michael.scott@dundermifflin.com',
        phone: '+1 555-0000'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/leads - should return list of leads with pagination', async () => {
    const res = await request(app)
      .get('/api/leads?page=1&limit=10');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
  });

  test('GET /api/leads?search= - should filter leads by search term', async () => {
    const res = await request(app)
      .get('/api/leads?search=Michael');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Michael Scott');
  });

  test('GET /api/leads/:id - should return single lead with notes', async () => {
    const res = await request(app)
      .get(`/api/leads/${createdLeadId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdLeadId);
    expect(Array.isArray(res.body.data.notes)).toBe(true);
  });

  test('GET /api/leads/:id - should return 404 for non-existent lead', async () => {
    const res = await request(app)
      .get('/api/leads/999999');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('PATCH /api/leads/:id - should update lead status and phone', async () => {
    const res = await request(app)
      .patch(`/api/leads/${createdLeadId}`)
      .send({
        status: 'qualified',
        phone: '+1 555-8888'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('qualified');
    expect(res.body.data.phone).toBe('+1 555-8888');
  });

  test('POST /api/leads/:id/notes - should add a note to the lead', async () => {
    const res = await request(app)
      .post(`/api/leads/${createdLeadId}/notes`)
      .send({
        content: 'Client requested a custom software development proposal.'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.leadId).toBe(createdLeadId);
    expect(res.body.data.content).toBe('Client requested a custom software development proposal.');
  });

  test('POST /api/leads/:id/notes - should reject empty note content', async () => {
    const res = await request(app)
      .post(`/api/leads/${createdLeadId}/notes`)
      .send({
        content: ''
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/leads/:id/notes - should list all notes for a lead', async () => {
    const res = await request(app)
      .get(`/api/leads/${createdLeadId}/notes`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
  });

  test('DELETE /api/leads/:id - should delete the lead and cascade delete notes', async () => {
    const res = await request(app)
      .delete(`/api/leads/${createdLeadId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const getRes = await request(app).get(`/api/leads/${createdLeadId}`);
    expect(getRes.status).toBe(404);
  });
});
