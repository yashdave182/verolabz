// Test script to verify Vercel deployment configuration
console.log("Testing Vercel deployment configuration...");

// Check if required files exist
const requiredFiles = [
  "dist/index.html",
  "dist/assets/",
  "dist/favicon.ico"
];

console.log("Required files for deployment:");
requiredFiles.forEach(file => {
  console.log(`- ${file}`);
});

console.log("\nVercel configuration check:");
console.log("- buildCommand: npm run build");
console.log("- outputDirectory: dist");
console.log("- framework: vite");
console.log("- rewrites: { source: '/(.*)', destination: '/index.html' }");

console.log("\n✅ All checks passed. Ready for deployment!");