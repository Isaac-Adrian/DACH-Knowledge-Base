import type { Topic, TopicCategory } from './types';

// Pre-built topic library organized by category
export const TOPIC_LIBRARY: Topic[] = [
  // Languages
  { id: 'lang-typescript', name: 'TypeScript', category: 'Languages', isCustom: false, icon: '📘' },
  { id: 'lang-javascript', name: 'JavaScript', category: 'Languages', isCustom: false, icon: '📒' },
  { id: 'lang-python', name: 'Python', category: 'Languages', isCustom: false, icon: '🐍' },
  { id: 'lang-csharp', name: 'C#', category: 'Languages', isCustom: false, icon: '💜' },
  { id: 'lang-java', name: 'Java', category: 'Languages', isCustom: false, icon: '☕' },
  { id: 'lang-go', name: 'Go', category: 'Languages', isCustom: false, icon: '🐹' },
  { id: 'lang-rust', name: 'Rust', category: 'Languages', isCustom: false, icon: '🦀' },
  { id: 'lang-sql', name: 'SQL', category: 'Languages', isCustom: false, icon: '🗃️' },
  { id: 'lang-cpp', name: 'C++', category: 'Languages', isCustom: false, icon: '⚡' },
  { id: 'lang-ruby', name: 'Ruby', category: 'Languages', isCustom: false, icon: '💎' },

  // Frontend
  { id: 'fe-react', name: 'React', category: 'Frontend', isCustom: false, icon: '⚛️' },
  { id: 'fe-vue', name: 'Vue.js', category: 'Frontend', isCustom: false, icon: '💚' },
  { id: 'fe-angular', name: 'Angular', category: 'Frontend', isCustom: false, icon: '🅰️' },
  { id: 'fe-svelte', name: 'Svelte', category: 'Frontend', isCustom: false, icon: '🔥' },
  { id: 'fe-nextjs', name: 'Next.js', category: 'Frontend', isCustom: false, icon: '▲' },
  { id: 'fe-html-css', name: 'HTML/CSS', category: 'Frontend', isCustom: false, icon: '🎨' },
  { id: 'fe-tailwind', name: 'Tailwind CSS', category: 'Frontend', isCustom: false, icon: '🌊' },
  { id: 'fe-accessibility', name: 'Accessibility (a11y)', category: 'Frontend', isCustom: false, icon: '♿' },
  { id: 'fe-testing', name: 'Frontend Testing', category: 'Frontend', isCustom: false, icon: '🧪' },

  // Backend
  { id: 'be-nodejs', name: 'Node.js', category: 'Backend', isCustom: false, icon: '💚' },
  { id: 'be-dotnet', name: '.NET / ASP.NET', category: 'Backend', isCustom: false, icon: '🟣' },
  { id: 'be-django', name: 'Django', category: 'Backend', isCustom: false, icon: '🎸' },
  { id: 'be-fastapi', name: 'FastAPI', category: 'Backend', isCustom: false, icon: '⚡' },
  { id: 'be-spring', name: 'Spring Boot', category: 'Backend', isCustom: false, icon: '🍃' },
  { id: 'be-graphql', name: 'GraphQL', category: 'Backend', isCustom: false, icon: '📊' },
  { id: 'be-rest', name: 'REST API Design', category: 'Backend', isCustom: false, icon: '🔌' },
  { id: 'be-grpc', name: 'gRPC', category: 'Backend', isCustom: false, icon: '📡' },
  { id: 'be-auth', name: 'Authentication/OAuth', category: 'Backend', isCustom: false, icon: '🔐' },

  // Cloud/Infra
  { id: 'cloud-azure', name: 'Azure', category: 'Cloud/Infra', isCustom: false, icon: '☁️' },
  { id: 'cloud-aws', name: 'AWS', category: 'Cloud/Infra', isCustom: false, icon: '🟠' },
  { id: 'cloud-gcp', name: 'Google Cloud', category: 'Cloud/Infra', isCustom: false, icon: '🔵' },
  { id: 'cloud-kubernetes', name: 'Kubernetes', category: 'Cloud/Infra', isCustom: false, icon: '⛵' },
  { id: 'cloud-docker', name: 'Docker', category: 'Cloud/Infra', isCustom: false, icon: '🐳' },
  { id: 'cloud-terraform', name: 'Terraform', category: 'Cloud/Infra', isCustom: false, icon: '🏗️' },
  { id: 'cloud-serverless', name: 'Serverless/Functions', category: 'Cloud/Infra', isCustom: false, icon: '⚡' },
  { id: 'cloud-networking', name: 'Cloud Networking', category: 'Cloud/Infra', isCustom: false, icon: '🌐' },

  // Data
  { id: 'data-postgresql', name: 'PostgreSQL', category: 'Data', isCustom: false, icon: '🐘' },
  { id: 'data-mongodb', name: 'MongoDB', category: 'Data', isCustom: false, icon: '🍃' },
  { id: 'data-cosmosdb', name: 'CosmosDB', category: 'Data', isCustom: false, icon: '🌌' },
  { id: 'data-redis', name: 'Redis', category: 'Data', isCustom: false, icon: '🔴' },
  { id: 'data-kafka', name: 'Kafka', category: 'Data', isCustom: false, icon: '📬' },
  { id: 'data-elasticsearch', name: 'Elasticsearch', category: 'Data', isCustom: false, icon: '🔍' },
  { id: 'data-modeling', name: 'Data Modeling', category: 'Data', isCustom: false, icon: '📐' },
  { id: 'data-etl', name: 'ETL/Data Pipelines', category: 'Data', isCustom: false, icon: '🔄' },

  // Architecture
  { id: 'arch-microservices', name: 'Microservices', category: 'Architecture', isCustom: false, icon: '🧩' },
  { id: 'arch-event-driven', name: 'Event-Driven Architecture', category: 'Architecture', isCustom: false, icon: '📨' },
  { id: 'arch-ddd', name: 'Domain-Driven Design', category: 'Architecture', isCustom: false, icon: '🏛️' },
  { id: 'arch-system-design', name: 'System Design', category: 'Architecture', isCustom: false, icon: '📋' },
  { id: 'arch-patterns', name: 'Design Patterns', category: 'Architecture', isCustom: false, icon: '🎯' },
  { id: 'arch-api-design', name: 'API Design', category: 'Architecture', isCustom: false, icon: '📝' },
  { id: 'arch-cqrs', name: 'CQRS/Event Sourcing', category: 'Architecture', isCustom: false, icon: '📊' },
  { id: 'arch-clean', name: 'Clean Architecture', category: 'Architecture', isCustom: false, icon: '✨' },

  // DevOps
  { id: 'devops-cicd', name: 'CI/CD Pipelines', category: 'DevOps', isCustom: false, icon: '🔄' },
  { id: 'devops-git', name: 'Git & Version Control', category: 'DevOps', isCustom: false, icon: '📚' },
  { id: 'devops-github-actions', name: 'GitHub Actions', category: 'DevOps', isCustom: false, icon: '🤖' },
  { id: 'devops-monitoring', name: 'Monitoring & Observability', category: 'DevOps', isCustom: false, icon: '📈' },
  { id: 'devops-security', name: 'DevSecOps', category: 'DevOps', isCustom: false, icon: '🔒' },
  { id: 'devops-testing', name: 'Test Automation', category: 'DevOps', isCustom: false, icon: '🧪' },
  { id: 'devops-iac', name: 'Infrastructure as Code', category: 'DevOps', isCustom: false, icon: '📜' },

  // Soft Skills
  { id: 'soft-communication', name: 'Communication', category: 'Soft Skills', isCustom: false, icon: '💬' },
  { id: 'soft-leadership', name: 'Leadership', category: 'Soft Skills', isCustom: false, icon: '👑' },
  { id: 'soft-mentoring', name: 'Mentoring', category: 'Soft Skills', isCustom: false, icon: '🎓' },
  { id: 'soft-documentation', name: 'Documentation', category: 'Soft Skills', isCustom: false, icon: '📖' },
  { id: 'soft-problem-solving', name: 'Problem Solving', category: 'Soft Skills', isCustom: false, icon: '🧠' },
  { id: 'soft-collaboration', name: 'Collaboration', category: 'Soft Skills', isCustom: false, icon: '🤝' },
  { id: 'soft-time-mgmt', name: 'Time Management', category: 'Soft Skills', isCustom: false, icon: '⏰' },
  { id: 'soft-presenting', name: 'Presenting', category: 'Soft Skills', isCustom: false, icon: '🎤' },
];

// Get all unique categories
export const CATEGORIES: TopicCategory[] = [
  'Languages',
  'Frontend',
  'Backend',
  'Cloud/Infra',
  'Data',
  'Architecture',
  'DevOps',
  'Soft Skills',
];

// Get topics by category
export function getTopicsByCategory(category: TopicCategory): Topic[] {
  return TOPIC_LIBRARY.filter((t) => t.category === category);
}

// Get a topic by ID (from library or custom)
export function getTopicById(id: string, customTopics: Topic[] = []): Topic | undefined {
  return TOPIC_LIBRARY.find((t) => t.id === id) || customTopics.find((t) => t.id === id);
}

// Search topics by name
export function searchTopics(query: string, customTopics: Topic[] = []): Topic[] {
  const lowerQuery = query.toLowerCase();
  const allTopics = [...TOPIC_LIBRARY, ...customTopics];
  return allTopics.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery)
  );
}
