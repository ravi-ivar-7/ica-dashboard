// Re-export from the main index for backward compatibility
export * from './index';

// Additional helper functions for template management
import { NodeTemplates, getAllNodeTemplates, getNodeTemplatesByCategory, getAllCategories } from './index';

export function getNodeCount(): number {
  return Object.keys(NodeTemplates).length;
}

export function getNodeCountByCategory(): Record<string, number> {
  const categories = getAllCategories();
  const counts: Record<string, number> = {};
  
  categories.forEach(category => {
    counts[category] = getNodeTemplatesByCategory(category).length;
  });
  
  return counts;
}

export function searchNodeTemplates(query: string) {
  const allTemplates = getAllNodeTemplates();
  const lowerQuery = query.toLowerCase();
  
  return allTemplates.filter(template => 
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.category.toLowerCase().includes(lowerQuery)
  );
}

export function getNodeTemplatesByTags(tags: string[]) {
  const allTemplates = getAllNodeTemplates();
  
  return allTemplates.filter(template => 
    tags.some(tag => 
      template.name.toLowerCase().includes(tag.toLowerCase()) ||
      template.description.toLowerCase().includes(tag.toLowerCase())
    )
  );
}

