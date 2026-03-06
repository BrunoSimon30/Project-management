import mongoose from "mongoose";
 

const fileUploadSchema = new mongoose.Schema(
    {
    file: {
        type: String,
        required: true,
    },
    fileType: {
        type: String,
        required: true,
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

export const FileUpload = mongoose.model("FileUpload", fileUploadSchema);
 