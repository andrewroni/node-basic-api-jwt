const router = require('express').Router();
const rolesController = require('../controllers/rolesController');

router.get('/', rolesController.getRoles);
router.post('/', rolesController.createRole);
router.get('/:id', rolesController.getRole);
router.put('/:id', rolesController.editRole);
router.patch('/:id', rolesController.editRolePermissions);
router.delete('/:id', rolesController.removeRole);
router.delete('/:id/module', rolesController.removeRolePermission);

module.exports = router;
