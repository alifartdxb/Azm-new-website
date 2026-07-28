const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('AdminTestimonials')) {
  content = content.replace(
    /const AdminCategories = lazy\(\(\) => import\("\.\/pages\/admin\/AdminCategories"\)\.then\(module => \(\{ default: module\.AdminCategories \}\)\)\);/,
    `const AdminCategories = lazy(() => import("./pages/admin/AdminCategories").then(module => ({ default: module.AdminCategories })));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials").then(module => ({ default: module.AdminTestimonials })));`
  );

  content = content.replace(
    /<Route path="categories" element=\{<AdminCategories \/>\} \/>/,
    `<Route path="categories" element={<AdminCategories />} />
                <Route path="testimonials" element={<AdminTestimonials />} />`
  );

  fs.writeFileSync('src/App.tsx', content);
}
