# **Thrifty Bites — Limitations & Future Work**

## **Overview**
Thrifty Bites has grown into a dynamic, bilingual digital cookbook and community resource hub designed to support families in the Upper Cumberland region. While the platform already includes searchable recipes, community resources, kitchen tools, and an admin portal, several areas can be expanded or refined to improve usability, accessibility, and long‑term sustainability.

---

## **Current Limitations**

### **1. User Accounts Not Fully Functional**
- Users can register and log in, but **saved recipes, shopping lists, and personalized features are not yet tied to user accounts**.
- Saved items currently rely on local storage rather than persistent database storage.
- No user profile page or account management settings exist yet.

### **2. Recipe Loading & Performance Constraints**
- Featured recipes display a “Loading…” state for an extended period, suggesting:
  - Slow API responses
  - Missing caching strategy
  - Potential inefficiencies in database queries
- No skeleton loaders or fallback UI for slow networks.

### **3. Limited Mobile Optimization in Certain Tools**
- Some tools (e.g., meal planner, shopping list) are functional but not fully optimized for small screens.
- Multi-step interactions (adding ingredients, editing items) can feel cramped on mobile.

### **4. Incomplete Localization**
- The site offers English and Spanish, but:
  - Some pages still contain untranslated text.
  - Certain UI elements (buttons, tool labels, error messages) remain English-only.
  - No language toggle persistence across sessions.

### **5. Accessibility Gaps**
- Some images lack alt text or use generic placeholders.
- Keyboard navigation is inconsistent in multi-step tools.
- Screen reader labels are missing in several form fields.

### **6. Resource Map Limitations**
- The map loads but lacks:
  - Filtering by resource type
  - Directions or integration with external map apps

### **7. Admin Portal Still Basic**
- Admins can add/edit content, but:
  - No analytics dashboard
  - No bulk upload for recipes or resources
  - No version history or rollback for edited content

---

## **Future Work**

### **1. Fully Implement Persistent User Accounts**
- Enable saving recipes, shopping lists, and meal plans to the user’s database profile.
- Add a “My Account” dashboard for:
  - Saved recipes
  - Saved shopping lists
  - Dietary preferences
  - Language preferences
- Add password reset and email verification flows.

### **2. Enhance Performance & Loading States**
- Add skeleton loaders for recipes and tools.
- Implement caching (ISR, SWR, or Redis) for:
  - Featured recipes
  - Community resources
  - Partner data
- Optimize image delivery using responsive image sets.

### **3. Expand Kitchen & Meal Tools**
- Add:
  - A calorie or nutrition estimator
  - A pantry tracker

### **4. Strengthen Accessibility**
- Conduct a full WCAG 2.1 AA audit.
- Add:
  - Proper alt text for all images
  - ARIA labels for interactive components
  - High-contrast mode toggle
  - Better keyboard navigation support


### **5. Expand Localization**
- Complete Spanish translations across all pages.
- Add translation support for:
  - Admin portal
  - Error messages
  - Tool interfaces
- Store language preference in user accounts.

### **6. Strengthen Admin Portal**
- Add:
  - Analytics (page views, recipe popularity, search trends)
  - Bulk CSV upload for recipes
  - Version history for edits
  - Role-based permissions (Admin, Editor, Volunteer)
- Improve UI for editing long-form content.

### **7. Add Community Engagement Features**
- Allow users to:
  - Leave comments or tips (moderated)
  - Rate recipes
- Add a “Featured Community Recipe” section.

---

## **Conclusion**
Thrifty Bites already provides a strong foundation for supporting families with affordable, nutritious recipes and local resources. By expanding user account functionality, improving accessibility, enhancing performance, and deepening community engagement features, the platform can evolve into a fully personalized, sustainable, and community-driven tool. These future improvements will help ensure that Thrifty Bites remains adaptable to the changing needs of the Upper Cumberland region and continues to empower families for years to come.
