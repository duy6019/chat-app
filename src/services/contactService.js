const ContactModel = require('./../models/contactModel');
const UserModel = require('./../models/userModel');
const _ = require('lodash');

module.exports.findUserContact = (currentUserId, keyword) => {
    return new Promise(async (resolve, reject) => {
        let deprecateUserIds = [currentUserId];
        let contactByUser = await ContactModel.findAllByUser(currentUserId);
        contactByUser.forEach((contact) => {
            deprecateUserIds.push(contact.userId);
            deprecateUserIds.push(contact.contactId);
        });

        deprecateUserIds = _.uniqBy(deprecateUserIds);

        let users = await UserModel.findAllForAddContact(deprecateUserIds, keyword);
        resolve(users);
    });
};

module.exports.addNew = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
        let contactExists = await ContactModel.checkExists(currentUserId, contactId);
        if (contactExists) {
            return reject(false);
        }
        let newContactItem = {
            userId: currentUserId,
            contactId: contactId
        };
        let newContact = await ContactModel.createNew(newContactItem);
        resolve(newContact);
    });
};

module.exports.removeRequestContact = (currentUserId, contactId) => {
    return new Promise(async (resolve, reject) => {
       let removeReq = await ContactModel.removeRequestContact(currentUserId,contactId);
       if(removeReq.n===0){
           return reject(false);
       }
       resolve(true);
    });
};
