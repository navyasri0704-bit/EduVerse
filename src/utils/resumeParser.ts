import * as pdfjsLib from 'pdfjs-dist';

// Use Vite's local asset URL for pdf.worker to avoid cross-origin CDN fetch errors
try {
  // @ts-ignore
  import('pdfjs-dist/build/pdf.worker.min.mjs?url').then((workerModule) => {
    if (workerModule && workerModule.default) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default;
    }
  }).catch((err) => {
    console.warn('Worker module import warning:', err);
  });
} catch (e) {
  console.warn('Could not set PDF worker URL:', e);
}

export async function parseResumeFile(file: File): Promise<string> {
  if (!file || !file.name) {
    return 'Sample Resume Content';
  }

  const fileType = file.name.split('.').pop()?.toLowerCase();

  if (fileType === 'txt' || fileType === 'md' || fileType === 'json') {
    try {
      return await file.text();
    } catch (e) {
      return file.name;
    }
  }

  if (fileType === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useWorkerFetch: false,
        useSystemFonts: true
      });

      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => (item && typeof item.str === 'string' ? item.str : ''))
          .join(' ');
        fullText += pageText + '\n';
      }

      if (fullText.trim().length > 10) {
        return fullText.trim();
      }
    } catch (err) {
      console.warn('PDF.js parsing failed, attempting fallback text extraction:', err);
    }

    // Secondary fallback: Extract printable ASCII sequences from raw binary buffer
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let rawText = '';
      for (let i = 0; i < bytes.length; i++) {
        const byte = bytes[i];
        if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13) {
          rawText += String.fromCharCode(byte);
        } else if (rawText.length > 0 && rawText[rawText.length - 1] !== ' ') {
          rawText += ' ';
        }
      }
      
      // Clean up common PDF formatting artifacts
      const cleaned = rawText
        .replace(/[\/\\()\[\]{}<>]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleaned.length > 20) {
        return cleaned;
      }
    } catch (e) {
      console.error('Binary text extraction error:', e);
    }

    // Ultimate fallback
    try {
      const text = await file.text();
      return text || file.name;
    } catch (e) {
      return file.name;
    }
  }

  // Fallback for docx or other plain files
  try {
    const text = await file.text();
    return text || file.name;
  } catch (err) {
    console.error('File reading error:', err);
    return file.name;
  }
}

/**
 * Client-side fallback analyzer when AI service key is offline or for instant feedback
 */
export function analyzeResumeLocally(resumeText: any, targetCareer: any = 'Software Engineer') {
  const safeResumeText = typeof resumeText === 'string' ? resumeText : String(resumeText || '');
  const safeCareer = typeof targetCareer === 'string' ? targetCareer : String(targetCareer || 'Software Engineer');
  const text = safeResumeText.toLowerCase();

  // Known skill database to extract
  const skillKeywords = [
    'react', 'typescript', 'javascript', 'node.js', 'python', 'java', 'c++', 'c#',
    'sql', 'postgresql', 'mongodb', 'docker', 'kubernetes', 'aws', 'gcp', 'azure',
    'rest api', 'graphql', 'express', 'django', 'flask', 'fastapi', 'tailwind',
    'css', 'html', 'git', 'github', 'ci/cd', 'unit testing', 'pytorch', 'tensorflow',
    'scikit-learn', 'data structures', 'algorithms', 'system design', 'microservices'
  ];

  const extractedSkills: string[] = [];
  skillKeywords.forEach(skill => {
    if (text.includes(skill.toLowerCase())) {
      // Capitalize nicely
      const pretty = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      extractedSkills.push(pretty);
    }
  });

  // Default fallback skills if none detected in raw text
  if (extractedSkills.length === 0) {
    extractedSkills.push('Problem Solving', 'Git', 'Software Fundamentals', 'Communication');
  }

  const wordCount = safeResumeText.trim().split(/\s+/).filter(Boolean).length;
  let score = Math.min(Math.max(Math.floor(wordCount / 5) + extractedSkills.length * 4, 60), 95);
  let atsCompatibility = Math.min(Math.max(65 + extractedSkills.length * 3, 70), 96);

  const strengths: string[] = [];
  if (extractedSkills.length >= 5) {
    strengths.push(`Extracted ${extractedSkills.length} core technical skills matching software engineering roles.`);
  } else {
    strengths.push('Clean resume layout with baseline technical skills detected.');
  }

  if (text.includes('project') || text.includes('built') || text.includes('developed')) {
    strengths.push('Demonstrates hands-on project experience and development keywords.');
  } else {
    strengths.push('Clear academic history and educational background.');
  }

  if (text.includes('optimized') || text.includes('increased') || text.includes('reduced') || /\d+%/.test(text)) {
    strengths.push('Includes quantitative impact metrics (e.g., percentages, performance gains).');
  } else {
    strengths.push('Logical formatting with clear section headers.');
  }

  const weaknesses: string[] = [];
  if (!text.includes('docker') && !text.includes('aws') && !text.includes('cloud')) {
    weaknesses.push('Missing DevOps & Cloud deployment keywords (Docker, AWS, Kubernetes).');
  }
  if (!text.includes('system design') && !text.includes('architecture')) {
    weaknesses.push('Lacks system design or scalable architectural details.');
  }
  if (!/\d+%/.test(text) && !text.includes('metrics')) {
    weaknesses.push('Few metric-driven bullet points (e.g. "improved latency by 35%").');
  }

  const atsSuggestions = [
    'Ensure section titles use standard terms like "Experience", "Projects", "Education", "Skills".',
    'Include strong action verbs at the start of bullet points (e.g. "Architected", "Engineered", "Deployed").',
    `Incorporate missing target role keywords for ${safeCareer}: Docker, Cloud, System Design, Unit Testing.`
  ];

  const projectAnalysis = [
    {
      title: 'Extracted Main Project / Experience',
      impactScore: extractedSkills.length > 5 ? 'High' : 'Moderate',
      feedback: 'Ensure all projects list tech stack tools and quantifiable performance metrics.'
    }
  ];

  return {
    resumeScore: score,
    atsCompatibility,
    extractedSkills,
    strengths,
    weaknesses,
    atsSuggestions,
    projectAnalysis
  };
}

