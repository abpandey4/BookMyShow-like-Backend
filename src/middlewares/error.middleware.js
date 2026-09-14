const errorHandler = (err, req, res, next)=>{

   // console.error("ACTUAL ERROR:", err);
   // console.error("STACK:", err.stack); 
    const statusCode = err.statusCode || 500;

    const message = statusCode === 500               // we add this because in deployment the      
        ?"Internal Server Error"                     // user should not see the intrenal main error
        : err.message || "Something went wrong";     // impact is bad ....while giving actual reason of internal failure

    return res
    .status(statusCode)
    .json({
        success : false,
        message,
        errors: err.errors || []
    })
}
export { errorHandler };
