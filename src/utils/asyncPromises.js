// this is the same as async handler , the only this changed is that i have used .then .catch in this , while try n catch in the previous
const asyncPromises = (requestHandler) => {
    return (req , res , next) => {
        Promise.resolve(requestHandler(req , res , next)).catch((error)=>next(error))
    }
}

export {asyncPromises}