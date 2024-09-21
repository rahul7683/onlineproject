 import bcrypt from 'bcrypt';
 import JWTMiddleware from '../middleware/auth.middleware.js';
 import UserService from '../Service/userService.js';
import {
    Menus
} from '../utils/constant.js';

import {
     sendEmail
 } from "../Service/emailService.js";

 export default class UserController {

     static async login(req, res) {
         try {


             let userFind = {
                 email: req.body.email
             };
             if (req.body.loginCode) {
                 userFind.loginCode = req.body.loginCode;
             }
             const user = await UserService.findOne(userFind);


             if (!user) {
                 return res.status(401).send({
                     success: false,
                     message: "Invalid user"
                 })
             }
             const match = await bcrypt.compare(req.body.password, user.password);
             if (match) {


                const userMenu = Menus.filter(item=>(item.roles.indexOf(user.roles)>-1)); 
                delete user.password;
                delete user.loginCode;
                const result = {...user,                 
                    menu:userMenu
                } 
                
                if(req.body.loginCode){
                    const createToken = await JWTMiddleware.generateJWTToken(user);
                    result.token = createToken;
                }else{
                    const loginCode = Math.floor(1000 + Math.random() * 9000);
                    sendEmail({subject:'Abbostop CMS Login code', to:user.email, body : 'Dear '+user.firstName+' , <p>Please use this code to login into CMS - '+loginCode+' </p>'});
                    UserService.updateOne({id:user._id},{loginCode:loginCode});
                }                               
                
                return res.json({
                     success: true,
                     msg: "success",
                     data: result
                 });


             }else{
                  return res.status(401).send({
                     success: false,
                     message: "Invalid user"
                 })

             }

         } catch (error) {
             console.error('Error in user login', error);
             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })
         }

     }

     static async logout(req, res) {
         try {

             await JWTMiddleware.clearToken(req);
             return res.json({
                 success: true,
                 msg: "success",
                 data: {}
             });

         } catch (error) {

             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })
         }

     }
     static async create(req, res) {
         try {

             const salt = bcrypt.genSaltSync(12);
             req.body.password = bcrypt.hashSync(req.body.password, salt);

             const user = await UserService.create(req.body);

             return res.json({
                 success: true,
                 msg: "success",
                 data: user,
             });

         } catch (error) {

             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })
         }
     }

     static async getOne(req, res) {
         try {

             const user = await UserService.findOne({
                 _id: req.params.id
             });

             return res.json({
                 success: true,
                 msg: "success",
                 data: user,
             });

         } catch (error) {
             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })

         }
     }

     static async update(req, res) {
         try {
             delete req.body.password;
             const user = await UserService.updateOne({
                 id: req.body._id
             }, req.body);
             return res.json({
                 success: true,
                 msg: "success",
                 data: user,
             });
         } catch (error) {

             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })
         }

     }

     static async list(req, res) {
         try {

             let condition = {};
             if (req.body.company) {
                 condition.company = req.body.company
             }
             const users = await UserService.find(condition);
             return res.json({
                 success: true,
                 msg: "success",
                 data: users,
             });

         } catch (error) {
             console.error('Error in user list', error);
             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })
         }
     }

     static async deleteOne(req, res) {
         try {

             let user = {}
             if (req.params.id) {
                 user = await UserService.deleteOne({
                     _id: req.params.id
                 });
             }

             return res.json({
                 success: true,
                 msg: "success",
                 data: user,
             });

         } catch (error) {
             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })

         }
     }


     static async setUserCountry(req, res) {
         try {

            req.user.countryId  = req.body.countryId;
            console.log("req.user", req.user);
            return res.json({
                 success: true,
                 msg: "success",
                 data: user,
             });

         } catch (error) {
             return res.status(500).send({
                 success: false,
                 message: "Failed",
                 error: error,
             })

         }
     }

     

 }