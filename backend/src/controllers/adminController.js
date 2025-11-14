import Admin from '../models/Admin.js';

export const listAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    return res.json(admins);
  } catch (error) {
    console.error('listAdmins error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to retrieve admins.',
    });
  }
};

