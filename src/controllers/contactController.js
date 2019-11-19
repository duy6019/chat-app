const { contact } = require('./../services/index');

module.exports.findUserContact = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;
        let users = await contact.findUserContact(currentUserId, keyword);
        return res.render("main/contact/sections/_findUserContact", { users });
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports.addNew = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;
        let newContact = await contact.addNew(currentUserId, contactId);
        return res.status(200).send({ success: !!newContact });
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports.removeRequestContact = async (req, res) => {
    try {
        let currentUserId = req.user._id;
        let contactId = req.body.uid;
        let removeReq = await contact.removeRequestContact(currentUserId, contactId);
        return res.status(200).send({ success: !!removeReq });
    } catch (error) {
        return res.status(500).send(error);
    }
};
