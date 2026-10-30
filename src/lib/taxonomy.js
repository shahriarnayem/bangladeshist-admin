/**
 * Builds a hierarchical tree array from flat category records.
 * Roots (depth: 0) are ordered by their sort weight, followed immediately
 * by their child categories (depth: 1, 2) indented with visual hierarchy.
 */
export function buildCategoryTree(categories = []) {
  if (!Array.isArray(categories)) return [];

  const categoryMap = new Map();
  const roots = [];
  const childrenMap = new Map();

  categories.forEach((cat) => {
    categoryMap.set(cat.id, cat);
    if (!cat.parentId || cat.parentId === 'none') {
      roots.push(cat);
    } else {
      if (!childrenMap.has(cat.parentId)) {
        childrenMap.set(cat.parentId, []);
      }
      childrenMap.get(cat.parentId).push(cat);
    }
  });

  // Sort roots by order weight, then alphabetical name
  roots.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name));

  // Sort each parent's children by order weight, then alphabetical name
  childrenMap.forEach((children) => {
    children.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name));
  });

  const flatTree = [];

  function appendBranch(cat, depth = 0) {
    const parentObj = cat.parent || (cat.parentId ? categoryMap.get(cat.parentId) : null);
    const directChildren = childrenMap.get(cat.id) || [];

    flatTree.push({
      ...cat,
      depth,
      hasParent: depth > 0,
      parent: parentObj,
      parentName: parentObj?.name || null,
      childCount: directChildren.length,
      displayName: depth > 0 ? `${'— '.repeat(depth)}${cat.name}` : cat.name
    });

    directChildren.forEach((child) => {
      appendBranch(child, depth + 1);
    });
  }

  roots.forEach((root) => appendBranch(root, 0));

  // Catch any orphaned items whose parentId didn't match a listed root
  categories.forEach((cat) => {
    if (
      cat.parentId &&
      cat.parentId !== 'none' &&
      !categoryMap.has(cat.parentId) &&
      !flatTree.some((t) => t.id === cat.id)
    ) {
      appendBranch(cat, 0);
    }
  });

  return flatTree;
}
