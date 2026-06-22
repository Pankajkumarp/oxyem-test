const { execSync } = require("node:child_process");

function runStep(command, title, failMessage) {
  try {
    console.log(`\n${title}\n`);

    execSync(command, {
      stdio: "inherit",
    });
  } catch {
    console.error(`\n❌ ${failMessage}\n`);
    process.exit(1);
  }
}

runStep(
 "npm run lint",
  "🔍 Running ESLint...",
  "ESLint validation failed."
);

runStep(
  "npm run audit",
  "🔐 Checking vulnerabilities...",
  "Security vulnerability check failed."
);

runStep(
  "npm run typecheck",
  "🧠 Running TypeScript checks...",
  "TypeScript validation failed."
);

runStep(
  "next build",
  "🏗 Creating production build...",
  "Production build failed."
);

console.log("\n✅ Build completed successfully!\n");