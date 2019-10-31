'use strict';
const router = require('express').Router();
const AV = require('leanengine');
const Comment = AV.Object.extend('Comment');
const stop_data = AV.Object.extend('stop_data');
// Comment 列表
router.get('/', function (req, res, next) {
    if (req.currentUser) {
        let query = new AV.Query(Comment);
        let qShopdata = new AV.Query(stop_data);
        query.descending('createdAt');
        qShopdata.descending('createdAt');
        qShopdata.limit(50);
        query.limit(50);
       
       
 
        
         query.find().then(function (results) {
            res.render('comments', {
                title: process.env.SITE_NAME + '上的新评论',
                domain: process.env.SITE_URL,
                comment_list: results
            });
        }, function (err) {
            if (err.code === 101) {
                res.render('comments', {
                    title: process.env.SITE_NAME + '上的新评论',
                    domain: process.env.SITE_URL,
                    comment_list: []
                });
            } else {
                next(err);
            } 
        }).catch(next);
        
        
         qShopdata.find().then(function (results) {
             console.log(results);
             res.render('comments', {
            
                stop_data_list: results
            });
        }, function (err) {
            if (err.code === 101) {
                res.render('comments', {
                   stop_data_list: []
                });
            } else {
                next(err);
            }
        }).catch(next);
        
        
    } else {
        res.redirect('/');
    }
});


router.get('/delete', function (req, res, next) {
    if (req.currentUser) {
        let query = new AV.Query(Comment);
        query.get(req.query.id).then(function (object) {
            object.destroy();
            res.redirect('/comments')
        }, function (err) {
        }).catch(next);
    } else {
        res.redirect('/');
    }
});

module.exports = router;
