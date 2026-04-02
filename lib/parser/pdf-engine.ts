/**
 * Multi-Layer PDF Extraction Engine (Ultra-Robust)
 * Uses pdf-parse-fork as a stable base with custom annotation extraction.
 */

// @ts-ignore
const pdf = require('pdf-parse-fork');

export interface ExtractedData {
  text: string;
  annotations: Array<{ url: string; page: number }>;
  metadata: {
    pages: number;
    title?: string;
  };
}

/**
 * Extracts full text and annotations using a single pass.
 */
export async function extractFullData(buffer: Buffer): Promise<ExtractedData> {
  const allAnnotations: Array<{ url: string; page: number }> = [];
  
  // Custom page renderer to capture annotations using internal pdfjs access within pdf-parse
  const render_page = async (pageData: any) => {
    // 1. Standard text extraction logic (imitating pdf-parse default)
    const render_options = {
      normalizeWhitespace: true,
      disableCombineTextItems: false
    };

    const textContent = await pageData.getTextContent(render_options);
    let lastY, text = '';
    for (let item of textContent.items) {
      if (lastY == item.transform[5] || !lastY) {
        text += item.str;
      } else {
        text += '\n' + item.str;
      }
      lastY = item.transform[5];
    }

    // 2. Deep Dive: Capture Annotations for this page
    try {
      const annotations = await pageData.getAnnotations();
      annotations.forEach((ann: any) => {
        if (ann.subtype === 'Link' && (ann.url || ann.unsafeUrl)) {
          allAnnotations.push({
            url: ann.url || ann.unsafeUrl,
            page: pageData.pageNumber
          });
        }
      });
    } catch (e) {
      console.warn(`Annotation capture failed on page ${pageData.pageNumber}`, e);
    }

    return text;
  };

  try {
    const data = await pdf(buffer, { pagerender: render_page });
    
    return {
      text: data.text,
      annotations: allAnnotations,
      metadata: {
        pages: data.numpages,
        title: data.info?.Title,
      }
    };
  } catch (error) {
    console.error('Fatal PDF Extraction Error:', error);
    throw new Error('Failed to extract PDF data securely. Check file format.');
  }
}
