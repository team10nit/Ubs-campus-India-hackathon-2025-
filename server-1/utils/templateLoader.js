import fs from "fs";
import path from "path";

export const loadTemplate = (templateName, data) => {
    try {
        const filePath = path.join(process.cwd(), "emailTemplate", templateName);
        let template = fs.readFileSync(filePath, "utf-8");

        // Replace placeholders {{key}} with actual values
        Object.keys(data).forEach((key) => {
            template = template.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
        });

        return template;
    } catch (error) {
        console.error("❌ Error loading template:", error);
        throw error;
    }
};
