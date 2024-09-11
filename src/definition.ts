interface Project {
    id: number;
    name: string;
    url: string;  // URL to fetch project languages
}

interface ProjectLanguages {
    [language: string]: number;  // Language as key, bytes as value
}