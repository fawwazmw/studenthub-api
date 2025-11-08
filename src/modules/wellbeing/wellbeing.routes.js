const express = require('express');
const router = express.Router();
const wellbeingController = require('./wellbeing.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const { createWellbeingSchema, updateWellbeingSchema } = require('./wellbeing.validation');

// All routes are protected
router.use(authMiddleware);

router.post('/', validate(createWellbeingSchema), wellbeingController.createEntry);
router.get('/', wellbeingController.getEntries);
router.get('/stats', wellbeingController.getStats);
router.get('/:date', wellbeingController.getEntryByDate);
router.put('/:id', validate(updateWellbeingSchema), wellbeingController.updateEntry);

module.exports = router;
