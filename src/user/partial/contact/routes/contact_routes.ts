import { Router } from 'express';
import ContactController from '../controller/contact_controller';
import {
  contactUsValidationRules,
  updateStatus,
} from '../validator/contact_validator';
import { authenticateToken, checkRole } from '@middleware/auth';
import { validateSchema } from 'helper/validation_helper';

const router = Router();

router.get('/', ContactController.getContacts);
router.get('/:id', ContactController.getContact);
router.post(
  '/',
  validateSchema(contactUsValidationRules),
  ContactController.createNewContact,
);
router.delete(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  ContactController.deleteContactPost,
);
router.put(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema(updateStatus),
  ContactController.updateContactStatus,
);

export default router;
