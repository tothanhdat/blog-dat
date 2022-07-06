const ObjectID = require('mongoose').Types.ObjectId;
const BLOG_COLL = require('../database/blog-coll');

module.exports = class BLOG extends BLOG_COLL {

    static insert({ title, content, image, category, shortDesc }) {
        return new Promise(async resolve => {
            try {

                if (!title || !content || !image || !category || !shortDesc)
                    return resolve({ error: true, message: 'params_invalid' });

                let infoAfterInsert = new BLOG({ title, content, image, category, shortDesc });
                let saveDataInsert = await infoAfterInsert.save();

                if (!saveDataInsert) return resolve({ error: true, message: 'cannot_insert' });
                resolve({ error: false, data: infoAfterInsert });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static getList({ categoryID }) {
        return new Promise(async resolve => {
            try {
                let listBlog;
                
                if(categoryID){
                    listBlog = await BLOG.find({category: categoryID, status: 1}).sort({ createAt: -1 });
                }else{
                    listBlog = await BLOG.find({ status: 1 }).sort({ createAt: -1 });
                }

                if (!listBlog) return resolve({ error: true, message: 'cannot_get_list' });

                return resolve({ error: false, data: listBlog });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }

    static getListTrending() {
        return new Promise(async resolve => {
            try {
                
                let listBlogTrending = await BLOG.find({status: 1}).sort({ views: -1 });

                if (!listBlogTrending) return resolve({ error: true, message: 'cannot_get_list' });

                return resolve({ error: false, data: listBlogTrending });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }

    static countViews({}) {
        return new Promise(async resolve => {
            try {
                let totalViews = await BLOG_COLL.aggregate([
                    { $group: { _id: null, views: { $sum: "$views" } } }
                ])

                return resolve({ error: false, data: totalViews[0].views });

            } catch (error) {

                return resolve({ error: true, message: error.message });
            }
        })
    }

    static getInfo({ blogID, views }) {
        return new Promise(async resolve => {
            try {
                
                if (!ObjectID.isValid(blogID))
                    return resolve({ error: true, message: 'params_invalid' });

                let infoBlog = await BLOG.findById(blogID)

                let viewsCurrent = infoBlog.views;

                //Update view when seen detai blog
                if(views){
                    await BLOG.findByIdAndUpdate(blogID, {views: viewsCurrent + 1}, {new: true})
                }

                if (!infoBlog) return resolve({ error: true, message: 'cannot_get_info' });

                return resolve({ error: false, data: infoBlog });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static update({ blogID, title, content, category, shortDesc }) {
        return new Promise(async resolve => {
            try {

                if (!ObjectID.isValid(blogID))
                    return resolve({ error: true, message: 'params_invalid' });

                let infoUpdate = await BLOG_COLL.findByIdAndUpdate(blogID, { title, content, category, shortDesc }, {new: true})

                if (!infoUpdate) return resolve({ error: true, message: 'cannot_update' });
                resolve({ error: false, data: infoUpdate });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static remove({ blogID }) {
        return new Promise(async resolve => {
            try {

                if (!ObjectID.isValid(blogID))
                    return resolve({ error: true, message: 'params_invalid' });

                let infoAfterRemove = await BLOG.findByIdAndDelete(blogID);

                if (!infoAfterRemove)
                    return resolve({ error: true, message: 'cannot_remove' });

                return resolve({ error: false, data: infoAfterRemove, message: "remove_data_success" });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }
}