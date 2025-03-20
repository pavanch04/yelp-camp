let wrapAsync = fn =>{
    return (req,res,next) => {
        fn(req,res,next).catch(e =>{
            console.dir(e)
            next(e)
        });
    }
}
module.exports = wrapAsync;