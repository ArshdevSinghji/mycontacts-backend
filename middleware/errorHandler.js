const {constants}=require("../constants");
const errorHandler=(err,req,res,next) => {
    const statusCode=res.statusCode?res.statusCode:500;
    switch(statusCode){
        case constants.VALIDATION_ERROR:
            res.json({
                title:"Validation Failure",
                message:err.message,
                stuckTrace:err.stack
            });
            break;
        case constants.NOT_FOUND:
            res.json({
                title:"Not Found",
                message:err.message,
                stuckTrace:err.stack
            });
            break;
        case constants.UNAUTHORIZED:
            res.json({
                title:"Unauthorized",
                message:err.message,
                stuckTrace:err.stack
            });
            break;
        case constants.SERVER_ERROR:
            res.json({
                title:"Server Error",
                message:err.message,
                stuckTrace:err.stack
            });
            break;
        case constants.FORBIDDEN:
                res.json({
                    title:"Forbidden",
                    message:err.message,
                    stuckTrace:err.stack
                });
                break;
        default:
            console.log("no error");
    }
};

module.exports=errorHandler;