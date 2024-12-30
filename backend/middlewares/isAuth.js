import jwt from 'jsonwebtoken';
const isAuth = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"user not authenticated",
                success:false
            });
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid Token",
                success:false
            });
        }
        req.id = decode.userId;
        next();
    }catch(err){
        console.log(err);
    }
}

export default isAuth;