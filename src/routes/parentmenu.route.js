const express = require('express')
const Parentmenucontroller = require('../controllers/parentmenu.controller');
const router = express.Router();

router.post(
    "/create-parentmenu",
    Parentmenucontroller.CreateParentmenu
);

router.get(
    "/list-parentmenu",
    Parentmenucontroller.ListParentmenu
);

router.get(
    "/list-parentmenu/:id",
    Parentmenucontroller.getParentmenuById
);

router.delete(
    "/delete-parentmenu/:id",
    Parentmenucontroller.deleteParentmenu
);

router.put(
    "/update-parentmenu/:id",
    Parentmenucontroller.updateParentmenu
);
module.exports = router;