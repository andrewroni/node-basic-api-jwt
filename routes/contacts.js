const router = require('express').Router();
const contactsController = require('../controllers/contactsController');

router.post('/', contactsController.createContact);
router.get('/', contactsController.getContacts);
router.get('/:id', contactsController.getContact);
router.patch('/:id', contactsController.updateContact);
router.delete('/:id', contactsController.removeContact);

module.exports = router;