/**
 * Sacred Text Restructuring Utility
 * Transforms plain text into the Sacred Shifter voice structure
 */

interface RestructureOptions {
  maxParagraphSentences?: number;
  addThematicHeadings?: boolean;
  emphasizeKeyPhrases?: boolean;
  addClosingInvocation?: boolean;
  resonanceTags?: string[];
}

export function restructureCodexEntry(
  content: string, 
  title: string,
  options: RestructureOptions = {}
): string {
  const {
    maxParagraphSentences = 4,
    addThematicHeadings = true,
    emphasizeKeyPhrases = true,
    addClosingInvocation = true,
    resonanceTags = []
  } = options;

  // Split content into sentences
  const sentences = content
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length === 0) return content;

  let restructured = '';
  const paragraphs: string[] = [];
  
  // Group sentences into paragraphs
  for (let i = 0; i < sentences.length; i += maxParagraphSentences) {
    const paragraphSentences = sentences.slice(i, i + maxParagraphSentences);
    paragraphs.push(paragraphSentences.join('. ') + '.');
  }

  // Add thematic headings based on content analysis
  if (addThematicHeadings && paragraphs.length > 1) {
    const headings = generateThematicHeadings(paragraphs, title, resonanceTags);
    
    paragraphs.forEach((paragraph, index) => {
      if (headings[index]) {
        restructured += `### ${headings[index]}\n\n`;
      }
      
      let processedParagraph = paragraph;
      
      // Emphasize key phrases
      if (emphasizeKeyPhrases) {
        processedParagraph = emphasizeKeyInsights(processedParagraph, resonanceTags);
      }
      
      restructured += processedParagraph + '\n\n';
    });
  } else {
    // Simple paragraph restructuring without headings
    paragraphs.forEach(paragraph => {
      let processedParagraph = paragraph;
      
      if (emphasizeKeyPhrases) {
        processedParagraph = emphasizeKeyInsights(processedParagraph, resonanceTags);
      }
      
      restructured += processedParagraph + '\n\n';
    });
  }

  // Add closing invocation
  if (addClosingInvocation) {
    const invocation = generateClosingInvocation(title, resonanceTags);
    restructured += `*${invocation}*`;
  }

  return restructured.trim();
}

function generateThematicHeadings(paragraphs: string[], title: string, resonanceTags: string[]): (string | null)[] {
  const headings: (string | null)[] = [];
  
  // Poetic heading templates based on Sacred Shifter voice
  const templates = [
    'The Essence of {concept}',
    '{concept} as Living Truth',
    'Practicing {concept}',
    'The Sacred Art of {concept}',
    '{concept} in Motion',
    'Honoring {concept}',
    'The Gravity of {concept}',
    '{concept} as Sanctuary',
    'Embodying {concept}',
    'The Frequency of {concept}'
  ];

  paragraphs.forEach((paragraph, index) => {
    if (index === 0) {
      // First paragraph gets a concept introduction heading
      const mainConcept = extractMainConcept(paragraph, resonanceTags);
      if (mainConcept) {
        const template = templates[Math.floor(Math.random() * templates.length)];
        headings.push(template.replace('{concept}', mainConcept));
      } else {
        headings.push(null);
      }
    } else if (index === paragraphs.length - 1 && paragraphs.length > 2) {
      // Last paragraph gets integration heading
      headings.push('Integration & Becoming');
    } else {
      // Middle paragraphs get contextual headings
      const concept = extractMainConcept(paragraph, resonanceTags);
      if (concept && Math.random() > 0.3) { // 70% chance of heading
        const template = templates[Math.floor(Math.random() * templates.length)];
        headings.push(template.replace('{concept}', concept));
      } else {
        headings.push(null);
      }
    }
  });

  return headings;
}

function extractMainConcept(text: string, resonanceTags: string[]): string | null {
  // Look for resonance tags in the text first
  for (const tag of resonanceTags) {
    if (text.toLowerCase().includes(tag.toLowerCase())) {
      return tag.charAt(0).toUpperCase() + tag.slice(1);
    }
  }

  // Extract key concepts from the text
  const keyWords = [
    'kindness', 'love', 'wisdom', 'truth', 'sacred', 'divine', 'consciousness',
    'awareness', 'presence', 'healing', 'transformation', 'integration',
    'coherence', 'resonance', 'frequency', 'vibration', 'energy', 'flow',
    'grace', 'beauty', 'mystery', 'wonder', 'compassion', 'forgiveness',
    'boundaries', 'sovereignty', 'authenticity', 'vulnerability', 'courage'
  ];

  for (const word of keyWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(text)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  }

  return null;
}

function emphasizeKeyInsights(text: string, resonanceTags: string[]): string {
  let emphasized = text;

  // Patterns that should be emphasized (truth lines)
  const emphasisPatterns = [
    /(\w+\s+is\s+not\s+\w+,?\s+it\s+is\s+\w+)/gi, // "X is not Y, it is Z"
    /(\w+\s+functions\s+as\s+[^.]+)/gi, // "X functions as Y"
    /(these\s+are\s+not\s+[^.]+\.?\s+they\s+are\s+[^.]+)/gi, // "These are not X. They are Y"
    /(coherence\s+arises\s+[^.)]+)/gi, // Coherence statements
  ];

  emphasisPatterns.forEach(pattern => {
    emphasized = emphasized.replace(pattern, '*$1*');
  });

  // Emphasize resonance tags when they appear
  resonanceTags.forEach(tag => {
    const regex = new RegExp(`\\b(${tag})\\b`, 'gi');
    emphasized = emphasized.replace(regex, '*$1*');
  });

  return emphasized;
}

function generateClosingInvocation(title: string, resonanceTags: string[]): string {
  const invocations = [
    'And so, the field bends toward truth.',
    'May this wisdom ripple through the collective.',
    'In this recognition, we remember our wholeness.',
    'The sacred recognizes itself in you.',
    'Let this knowing anchor in your cells.',
    'And so it is, in perfect timing.',
    'May you trust the intelligence that moves through you.',
    'In this breath, all possibilities converge.'
  ];

  // Use resonance tags to create contextual invocations
  if (resonanceTags.length > 0) {
    const primaryTag = resonanceTags[0];
    const contextualInvocations = [
      `And so, ${primaryTag} bends the field — holding us together in belonging.`,
      `May ${primaryTag} be your compass in the mystery.`,
      `In honoring ${primaryTag}, you honor the wholeness seeking to emerge.`,
      `Let ${primaryTag} be both your practice and your prayer.`
    ];
    
    return Math.random() > 0.5 
      ? contextualInvocations[Math.floor(Math.random() * contextualInvocations.length)]
      : invocations[Math.floor(Math.random() * invocations.length)];
  }

  return invocations[Math.floor(Math.random() * invocations.length)];
}

// Utility to restructure all entries in bulk
export function bulkRestructureEntries(entries: Array<{content: string; title: string; resonance_tags: string[]}>) {
  return entries.map(entry => ({
    ...entry,
    content: restructureCodexEntry(entry.content, entry.title, {
      resonanceTags: entry.resonance_tags
    })
  }));
}