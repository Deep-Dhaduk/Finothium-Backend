const express = require('express')
const Childmenucontroller = require('../controllers/childmenu.controller');
const router = express.Router();

router.post(
    "/create-childmenu",
    Childmenucontroller.CreateChildmenu
);

router.get(
    "/list-childmenu",
    Childmenucontroller.ListChildmenu
);

router.get(
    "/list-childmenu/:id",
    Childmenucontroller.getChildmenuById
);

router.delete(
    "/delete-childmenu/:id",
    Childmenucontroller.deleteChildmenu
);

router.put(
    "/update-childmenu/:id",
    Childmenucontroller.updateChildmenu
);
module.exports = router;