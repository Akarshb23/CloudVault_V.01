// so we use try catch block in many places , so instead of hardcoding it everywhere , we can make a utility function 
// wrapper function
const asyncHandler = (fn) => async (req , res , next) => {
    try {
        await fn(req , res , next)
    } catch (error) {
        res.status(error.code || 500).json({
            success : false ,
            message : error.message
        })
    }

}

export {asyncHandler}