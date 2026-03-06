import jwt from "jsonwebtoken";


const generateToken = (data)=>{
    const token = jwt.sign(data, process.env.JWT_SECRET);
    return token;
}

const verifyToken = (data)=>{
    const decoded = jwt.verify(data, process.env.JWT_SECRET);
    return decoded;
}

export { generateToken, verifyToken };