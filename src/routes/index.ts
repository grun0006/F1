import { Router } from 'express';
import { getIndex } from '../controllers/indexController.js';
import { getAllRaces } from '../controllers/allRaces.js';
const router: Router = Router();

router.get('/', getIndex);
router.get('/allRaces', getAllRaces);

export default router;
