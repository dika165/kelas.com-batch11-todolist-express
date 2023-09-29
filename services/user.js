import { getData, createData, deleteData, getDataById, getUserByEmail } from "../repositories/users.js";
import { errorResponse, successResponse } from "../utils/response.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_ACCESS_TOKEN = 'kelas.com';
const SECRET_REFRESH_TOKEN = 'backend';

export const getUser = async (request, response, next) => {
    try {
        const [result] = await getData();
        console.log(result);

        successResponse(response, "success", result);
    } catch(error) {
        next(error);
    }
}

export const createUser = async (request, response, next) => {
    try {
        let name = request.body.name;
        let email = request.body.email;
        let pass = request.body.password;
        let createdBy = request.claims.id;
        let saltRound = 10;
        console.log(createdBy);
        bcrypt.hash(pass, saltRound, async (error, hash) => {
            const [result] = await createData(name, email, createdBy,  hash);

            const [user] = await getDataById(result.insertId);


            successResponse(response, "sucess create data", user[0]);
        })
        
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (request, response, next) => {
    try {
        let id = request.params.id;
        const [result] = await deleteData(id);

        if(result.affectedRows > 0) {
            successResponse(response, "success", "success delete data");
        } else {
            errorResponse(response, "failed", 401)
        }
    } catch(error) {
        next(error);
    }
}

export const authUser = async (request, response, next) => {
    try {
        let email = request.body. email;
        let pass = request.body.password;

        const [result] = await getUserByEmail(email);

        if( result.length > 0) {
            const user = result[0];
            bcrypt.compare(pass, user.password, (error, result) => {
                if(result) {
                    let payload = {
                        id: user.user_id, 
                        name: user.name, 
                        email: user.email,
                    }
                    let accessToken = jwt.sign(payload, SECRET_ACCESS_TOKEN,{expiresIn: '15m'} );
                    let refreshToken = jwt.sign(payload, SECRET_REFRESH_TOKEN, {expiresIn: '30m'});
                    let data = {
                        access_token: accessToken,
                        refresh_token: refreshToken, 
                    }
                    successResponse(response, "success login", data)
                }
            })
        } else {
            errorResponse(response, "invalid email or password", 401);
        }
    } catch (error) {
        next(error)
    }
}

export const validateToken = (request, response, next) => {
    const authHeader = request.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1];

    if(accessToken){
        jwt.verify(accessToken, SECRET_ACCESS_TOKEN, (error, claims) => {
            if(error) {
                errorResponse(response, error.message, 403);
            } else {
                request.claims = claims;
                // console.log(claims);
                next()
            }
        })
    } else {
        errorResponse(response, "invalid request, authorization not found!!")
    }
}