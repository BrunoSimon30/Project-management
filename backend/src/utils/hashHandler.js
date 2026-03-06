import bcrypt from "bcrypt";


const hashPassword = async (password) => {

    const hashedPassword = await bcrypt.hash(password, 8);
    return hashedPassword;
   
}

const comparePassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
   
}

export { hashPassword, comparePassword };