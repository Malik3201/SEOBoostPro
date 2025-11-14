import crypto from 'crypto';
import ServiceContract from '../models/ServiceContract.js';
import Setting from '../models/Setting.js';

const WHATSAPP_KEY = 'whatsappNumber';

const generateUniqueKey = () => crypto.randomBytes(5).toString('hex').toUpperCase();

const getWhatsAppSetting = async () => {
  const setting = await Setting.findOne({ key: WHATSAPP_KEY });
  return setting?.value || null;
};

export async function getWhatsAppNumber(_req, res) {
  try {
    const value = await getWhatsAppSetting();
    res.json({ whatsappNumber: value });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load contact information' });
  }
}

export async function updateWhatsAppNumber(req, res) {
  try {
    const { whatsappNumber } = req.body;

    if (!whatsappNumber) {
      return res.status(400).json({ message: 'WhatsApp number is required' });
    }

    const updated = await Setting.findOneAndUpdate(
      { key: WHATSAPP_KEY },
      { value: whatsappNumber },
      { upsert: true, new: true }
    );

    res.json({ whatsappNumber: updated.value });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update contact information' });
  }
}

export async function createServiceRequest(req, res) {
  try {
    const { url, durationValue, durationUnit } = req.body;

    if (!url || !durationValue || !durationUnit) {
      return res.status(400).json({ message: 'URL, duration value, and unit are required' });
    }

    const contract = await ServiceContract.create({
      url,
      durationValue,
      durationUnit,
    });

    const whatsappNumber = await getWhatsAppSetting();

    res.status(201).json({
      contract,
      whatsappNumber,
    });
  } catch (error) {
    console.error('createServiceRequest error:', error);
    res.status(500).json({ message: 'Failed to create service request' });
  }
}

export async function listServiceContracts(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [contracts, total] = await Promise.all([
      ServiceContract.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      ServiceContract.countDocuments(),
    ]);

    res.json({
      data: contracts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('listServiceContracts error:', error);
    res.status(500).json({ message: 'Failed to fetch contracts' });
  }
}

export async function startServiceContract(req, res) {
  try {
    const { id } = req.params;

    const contract = await ServiceContract.findById(id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (!contract.uniqueKey) {
      contract.uniqueKey = generateUniqueKey();
    }

    contract.status = 'in_progress';
    contract.progress.push({ message: 'Processing started' });
    await contract.save();

    res.json({ contract });
  } catch (error) {
    console.error('startServiceContract error:', error);
    res.status(500).json({ message: 'Failed to start contract' });
  }
}

export async function updateServiceContractStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const contract = await ServiceContract.findById(id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    contract.status = status;

    if (note) {
      contract.progress.push({ message: note });
    }

    if (status === 'completed') {
      contract.progress.push({ message: 'SEO boost service completed' });
    }

    await contract.save();

    res.json({ contract });
  } catch (error) {
    console.error('updateServiceContractStatus error:', error);
    res.status(500).json({ message: 'Failed to update contract' });
  }
}

export async function getProgressByKey(req, res) {
  try {
    const { uniqueKey } = req.params;

    if (!uniqueKey) {
      return res.status(400).json({ message: 'Unique key is required' });
    }

    const contract = await ServiceContract.findOne({ uniqueKey });

    if (!contract) {
      return res.status(404).json({ message: 'No contract found for this key' });
    }

    res.json({
      url: contract.url,
      status: contract.status,
      durationValue: contract.durationValue,
      durationUnit: contract.durationUnit,
      progress: contract.progress,
      createdAt: contract.createdAt,
    });
  } catch (error) {
    console.error('getProgressByKey error:', error);
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
}

