const status = {};

status.message = {
    data: [],
    message: "",
    error: ""
};

status.code = {
    success: 200,
    error: 500,
    notfound: 404,
    conflict: 409,
    badRequest: 400
}

module.exports = status;