const fs = require('fs');
let content = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

// Add import
content = content.replace(
  /import \{ supabase \} from "\.\.\/lib\/supabase";/,
  "import { createDocument } from '../services/db';"
);

// Replace submit logic
const submitLogic = `
      const payload = {
        name: \`\${firstName} \${lastName}\`.trim(),
        email,
        phone,
        company: companyName,
        message: \`Role: \${role}\\nInquiry Type: \${activeTab}\\nMessage: \${message}\`,
        status: 'New',
        createdAt: new Date().toISOString()
      };

      await createDocument('inquiries', payload);
`;

content = content.replace(
  /const payload = \{[\s\S]*?console\.log\("Mock lead payload:", payload\);\s*\}/,
  submitLogic
);

// Fix TS errors for formTabs without project
content = content.replace(
  /const \[activeTab, setActiveTab\] = useState<"general" \| "quote" \| "project" \| "showroom">\("general"\);/,
  'const [activeTab, setActiveTab] = useState<"general" | "quote" | "showroom">("general");'
);

// Delete the project branch from the tab switcher
content = content.replace(
  /\{ id: "project", label: "Project Inquiry" \},\s*/,
  ''
);

fs.writeFileSync('src/pages/Contact.tsx', content);
