const { sequelize, Lead, Note } = require('../models');

const sampleLeads = [
  {
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne.io',
    phone: '+1 555-0199',
    status: 'qualified',
    notes: [
      'Showed strong interest in our enterprise plan.',
      'Requested a demo for her technical team next Tuesday.'
    ]
  },
  {
    name: 'Alex Johnson',
    email: 'alex.j@novasoft.dev',
    phone: '+1 555-0143',
    status: 'new',
    notes: [
      'Inbounded through the landing page contact form.'
    ]
  },
  {
    name: 'Maria Garcia',
    email: 'm.garcia@apexlogistics.com',
    phone: '+1 555-0177',
    status: 'contacted',
    notes: [
      'Introductory call completed. Sent pricing overview deck.',
      'Follow-up scheduled for Friday afternoon.'
    ]
  },
  {
    name: 'David Kim',
    email: 'david.kim@summitcap.co',
    phone: '+1 555-0122',
    status: 'lost',
    notes: [
      'Currently under contract with a competitor until next year.'
    ]
  },
  {
    name: 'Elena Rostova',
    email: 'elena@quantumscale.tech',
    phone: '+1 555-0188',
    status: 'qualified',
    notes: [
      'Budget approved. Reviewing security and SLA requirements.'
    ]
  },
  {
    name: 'Marcus Vance',
    email: 'm.vance@blueharbor.org',
    phone: '+1 555-0165',
    status: 'new',
    notes: []
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@zenithcloud.in',
    phone: '+91 98765 43210',
    status: 'contacted',
    notes: [
      'Discussed API integration capabilities and rate limits.'
    ]
  }
];

const seed = async () => {
  try {
    console.log('Seeding database with Sequelize...');
    await sequelize.sync({ force: true });

    for (const leadData of sampleLeads) {
      const { notes, ...leadFields } = leadData;
      const lead = await Lead.create(leadFields);
      if (notes && notes.length > 0) {
        for (const content of notes) {
          await Note.create({
            leadId: lead.id,
            content
          });
        }
      }
    }

    console.log('Database seeded successfully with sample leads and notes.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
