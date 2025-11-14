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

    // Ensure suggestions is always an array
    const reportData = report.toObject ? report.toObject() : report;
    if (!Array.isArray(reportData.suggestions)) {
      if (typeof reportData.suggestions === 'string') {
        reportData.suggestions = reportData.suggestions
          .split('\n')
          .map(s => s.trim())
          .filter(s => s.length > 0);
      } else {
        reportData.suggestions = reportData.suggestions || [];
      }
    }

    // Debug logging
    console.log('Report ID:', id);
    console.log('Suggestions count:', reportData.suggestions?.length || 0);
    console.log('Suggestions type:', typeof reportData.suggestions);
    console.log('First suggestion:', reportData.suggestions?.[0]);

    return res.json(reportData);
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

