const mongoose = require('mongoose');

const UserAuthSocialSchema = new mongoose.Schema({
    accountId: { type: String, required: true, unique: true }, // Add this line
    id_User: { type: String, required: true },
    email: { type: String, required: true },
    TokenAcess: { type: String, required: true },
    TokenRefress: { type: String, required: true },
    KeyPublic: { type: String, required: true },
    KeyPrivate: { type: String, required: true },
    HistoryToken: { type: Array, default: [] },
    provider: { type: String, required: true },
});


module.exports = mongoose.model('UserAuthSocial', UserAuthSocialSchema);
