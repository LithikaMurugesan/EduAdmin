const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', departmentController.getDepartments);
router.get('/all', departmentController.getAllDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.post('/', departmentController.createDepartment);
router.put('/:id', departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);
router.put('/:id/restore', departmentController.restoreDepartment);

module.exports = router;

