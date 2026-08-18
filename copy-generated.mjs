import { cp } from "node:fs/promises";

await cp(
    "./src/generated",
    "./dist/generated",
    {
        recursive: true,
        force: true,
    }
);

console.log("Prisma generated client copied successfully.");