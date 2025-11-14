import mongoose from 'mongoose';
import Report from '../models/Report.js';

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid report ID.' });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    return res.json(report);
  } catch (error) {
    console.error('getReportById error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to retrieve report.',
    });
  }
};

export const getAdminReports = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      Report.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Report.countDocuments(),
    ]);

    return res.json({
      data: reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('getAdminReports error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to retrieve reports.',
    });
  }
};

