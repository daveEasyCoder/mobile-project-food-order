import AppError from "../utils/appError.js";

const  authorizeRoles = (...allowedRole) =>{
 return (req,res,next) =>{
  if (!allowedRole.includes(req.user.role)) {
    return next(new AppError('Access denied',403));
  }
  next();
 }
}

export default authorizeRoles;