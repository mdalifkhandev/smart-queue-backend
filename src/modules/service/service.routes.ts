import express from 'express';
import { createService, getServices } from './service.controller';

const router = express.Router();

router.post('/', createService);
router.get('/', getServices);

export default router;
