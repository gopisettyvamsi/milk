import fs from "fs";
import path from "path";
import handlebars from "handlebars";

export async function renderEmailTemplate(templateName: string, data: Record<string, any>) {
  const filePath = path.join(process.cwd(), "lib", "emailTemplates", `${templateName}.hbs`);
  const source = fs.readFileSync(filePath, "utf-8");
  const template = handlebars.compile(source);
  return template({
    ...data,
    year: new Date().getFullYear(),
  });
}
