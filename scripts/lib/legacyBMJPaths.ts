import path from 'node:path'

const legacyDataDir = path.resolve(process.cwd(), 'scripts', 'data', 'legacy-bmj')

export const legacyBMJPagesPath = path.join(legacyDataDir, 'pages.json')
export const legacyBMJGlobalsPath = path.join(legacyDataDir, 'globals.json')
export const legacyBMJPostsPath = path.join(legacyDataDir, 'posts.json')
export const legacyBMJPostCategoriesPath = path.join(legacyDataDir, 'post-categories.json')
export const legacyBMJArticlePagePath = path.join(legacyDataDir, 'article-page.json')

