import { getData, createData, deleteData } from "../repositories/users.js";
import { errorResponse, successResponse } from "../utils/response.js";

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

        const [result] = await createData(name, email, pass);

        successResponse(response, "sucess create data", `berhasil menambahkan user dengan id:${result.insertId}`)
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