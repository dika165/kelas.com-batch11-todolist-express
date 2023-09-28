export const successResponse = (response, message, data, status = 200) => {
    return response.status(status).json({
        status, 
        message, 
        data,
    });
}

export const errorResponse = (response, message, status=400) => {
    return response.status(status).json({
        status,
        message
    });
}