import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        originalFileName: {
            type: String,
            required: true,
            trim: true,
        },
        storedFileName: {
            type: String,
            required: true,
            trim: true,
        },
        filePath: {
            type: String,
            required: true,
            trim: true,
        },
        fileSize: {
            type: Number,
            required: true,
            min: 0,
        },
        mimeType: {
            type: String,
            required: true,
            trim: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        processingStatus: {
            type: String,
            enum: ["pending", "processing", "completed", "failed"],
            default: "pending",
        },
        extractedText: {
            type: String,
            default: "",
        }
    },
    {
        timestamps: true,
    }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;