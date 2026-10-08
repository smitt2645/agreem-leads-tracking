const { Op } = require('sequelize');
const { Lead, Note } = require('../models');

const getLeads = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    const where = {};

    if (search && typeof search === 'string' && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.like]: searchTerm } },
        { email: { [Op.like]: searchTerm } }
      ];
    }

    if (status && typeof status === 'string' && status.trim()) {
      where.status = status.trim().toLowerCase();
    }

    const { rows: leads, count: total } = await Lead.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByPk(id, {
      include: [
        {
          model: Note,
          as: 'notes'
        }
      ],
      order: [[{ model: Note, as: 'notes' }, 'createdAt', 'DESC']]
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, status = 'new' } = req.body;

    const existing = await Lead.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A lead with this email already exists'
      });
    }

    const createdLead = await Lead.create({
      name,
      email,
      phone: phone || null,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: createdLead
    });
  } catch (error) {
    next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    if (req.body.email && req.body.email !== lead.email) {
      const emailConflict = await Lead.findOne({
        where: {
          email: req.body.email,
          id: { [Op.ne]: id }
        }
      });
      if (emailConflict) {
        return res.status(400).json({
          success: false,
          message: 'A lead with this email already exists'
        });
      }
    }

    const allowedFields = ['name', 'email', 'phone', 'status'];
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    await lead.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    await lead.destroy();

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead
};
