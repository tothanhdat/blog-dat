const ObjectID = require('mongoose').Types.ObjectId;
const USER_COLL= require('../database/user-coll');
const { hash, compare } = require('bcryptjs');
const { sign, verify } = require('../utils/jwt');

module.exports = class user {
    static register(username, password) {
        return new Promise(async resolve => {
            try {

                let checkExist = await USER_COLL.findOne({ username });

                if (checkExist)
                    return resolve({ error: true, message: 'Username đã tồn tại, vui lòng nhập username khác' });

                let hashPassword = await hash(password, 8);
                let newUser = new USER_COLL({ username, password: hashPassword });
                let infoUser = await newUser.save();

                if (!infoUser) return resolve({ error: true, message: 'Bị lỗi trong quá trình đăng ký' });
                resolve({ error: false, data: infoUser });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static signIn(username, password) {
        return new Promise(async resolve => {
            try {
                const infoUser = await USER_COLL.findOne({ username });
                if (!infoUser)
                    return resolve({ error: true, message: 'Tài khoản không tồn tại' });
                    
                const checkPass = await compare(password, infoUser.password);
                if (!checkPass)
                    return resolve({ error: true, message: 'Sai mật khẩu' });

                await delete infoUser.password;

                let token = await sign({ data: infoUser });
                return resolve({ error: false, data: { infoUser, token } });
                
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static getList() {
        return new Promise(async resolve => {
            try {
                let listUser = await USER_COLL.find();

                if (!listUser) return resolve({ error: true, message: 'cannot_get_list_data' });

                return resolve({ error: false, data: listUser });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }

    static getInfo(userID) {
        return new Promise(async resolve => {
            try {
                let infoUser = await USER_COLL.findById(userID);

                if (!infoUser) return resolve({ error: true, message: 'cannot_get_list_data' });

                return resolve({ error: false, data: infoUser });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }
    
}