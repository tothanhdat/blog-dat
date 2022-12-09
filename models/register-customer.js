const ObjectID = require('mongoose').Types.ObjectId;
const REGISTER_CUSTOMER_COLL = require('../database/register-customer-coll');
const nodemailer = require("nodemailer");
const { OAuth2Client  } = require('google-auth-library');

require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_EMAIL_ID
const CLIENT_SECRET = process.env.CLIENT_EMAIL_SECRET
// const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const PASSWORD_EMAIL = process.env.PASSWORD_EMAIL

// const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
// oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const myOAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET
)

// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
})

module.exports = class REGISTER_CUSTOMER extends REGISTER_CUSTOMER_COLL {

    static register({ name, email, questionContent }) {
        return new Promise(async resolve => {
            try {

                if (!email){
                    return resolve({ error: true, message: 'Vui lòng nhập email' });
                }

                // let accountExisted = await REGISTER_CUSTOMER.findOne({email});

                // if(accountExisted)
                //     return resolve({ error: true, code: 400, message: 'Bạn đã đăng ký email này' });

                let infoAfterInsert = new REGISTER_CUSTOMER({ name, email, questionContent });
                let saveDataInsert = await infoAfterInsert.save();

                if (!saveDataInsert) return resolve({ error: true, message: 'Lỗi hệ thống' });
                resolve({ error: false, data: infoAfterInsert });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static getList() {
        return new Promise(async resolve => {
            try {
                let listAccountRegister = await REGISTER_CUSTOMER.find().sort({ createAt: -1 });
                
                if (!listAccountRegister) return resolve({ error: true, message: 'cannot_get_list' });

                return resolve({ error: false, data: listAccountRegister });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }

    static sendEmail({ title, content }) {
        return new Promise(async resolve => {
            try {

                let listCustomer = await REGISTER_CUSTOMER_COLL.find();
                let listEmail = listCustomer.map(item => item.email);

                console.log({ listEmail });

                listEmail && listEmail.length && listEmail.forEach(async email => {

                    const myAccessTokenObject = await myOAuth2Client.getAccessToken()

                    const myAccessToken = myAccessTokenObject?.token

                    const transport = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          type: 'OAuth2',
                          user: 'todat999@gmail.com',
                          clientId: CLIENT_ID,
                          clientSecret: CLIENT_SECRET,
                          refresh_token: REFRESH_TOKEN,
                          accessToken: myAccessToken
                        }
                    })

                    const mailOptions = {
                        to: email, // Gửi đến ai?
                        subject: title, // Tiêu đề email
                        html: content // Nội dung email
                    }

                    let info = await transport.sendMail(mailOptions)
                    //console.log({ info });

                })

                return resolve({ error: false, data: 'Gửi email thành công' });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }
    
}