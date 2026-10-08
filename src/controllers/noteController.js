const { Lead, Note } = require('../models');

const getNotesByLeadId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leadId = parseInt(id, 10);

    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const notes = await Note.findAll({
      where: { leadId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const leadId = parseInt(id, 10);

    const lead = await Lead.findByPk(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const createdNote = await Note.create({
      leadId,
      content
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: createdNote
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotesByLeadId,
  createNote
};
