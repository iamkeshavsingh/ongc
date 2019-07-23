const express = require('express');
const router = express.Router();
const conn = require('../../config/db');
const authChecker = require('../../middlewares/auth');
const userChecker = require('../../middlewares/user');


//using the authChecker and the userChecker
router.use(authChecker);
router.use(userChecker);

//1.API for getting the basic info of the user
router.post('/',(req,res) => {

    const session_value = req.session.email;
    const query = `select * from members where email = '${session_value}'`;

    conn.query(query,(err,results) => {
        if(err){
            res.send({
                error : true,
                errorMsg : err.message
            });
            res.end();
        }
        else{
            res.send(results);
            res.end();
        }
    });
});


//2.API for handling the form data submitted by the user
router.post('/data',(req,res) => {

    const ref_id = req.session.idx;
    const {dob,gender,category,address,mobile,fathers_name,occupation} = req.body;

    let query = `insert into personal_info(members_id,dob,gender,category,address,mobile,fathers_name,occupation) values('${ref_id}','${dob}','${gender}','${category}','${address}','${mobile}','${fathers_name}','${occupation}')`;


    conn.query(query,(err) => {
        if(err){
            res.send({
                success : false,
                errorMsg : err.message
            });
            res.end();
        }
        else{

            const {degination,cpf,section,location} = req.body;
            query = `insert into employee_info(members_id,degination,cpf,section,location) values('${ref_id}','${degination}','${cpf}','${section}','${location}')`;

            conn.query(query,(err) => {
                if(err){
                    res.send({
                        success : false,
                        errorMsg : err.message
                    });
                    res.end();
                }
                else{

                    const {college,course,year} = req.body;
                    query = `insert into academics_info(members_id,college,course,present_year,marksheet_url) values('${ref_id}','${college}','${course}','${year}','${req.file.filename}')`;

                    conn.query(query,(err) => {
                        if(err){
                            res.send({
                                success : false,
                                errorMsg : err.message
                            });
                            res.end();
                        }
                        else{
                            
                            const val = 1;
                            query = `update members set status = ${val} where id = ${ref_id}`;
                            conn.query(query,(err) => {
                                if(err){
                                    res.send({
                                        success : false,
                                        errorMsg : err.message
                                    });
                                    res.end();
                                }
                                else{
                                    res.redirect('http://localhost:3000/dbuser.html');
                                    res.end();
                                }
                            });
                        }
                    });
                }
            });
        }
    });

});




module.exports = router;