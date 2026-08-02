import * as pdfjsLib from 'pdfjs-dist';

// Worker dosyasını doğrudan public klasöründen çağırıyoruz (CORS / CDN engellerine takılmaz)
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // PDF belgesini yükle
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (error: any) {
    console.error('PDF metin çıkarma detaylı hata logu:', error);
    throw new Error('PDF dosyası ayrıştırılamadı: ' + (error?.message || 'Bilinmeyen hata'));
  }
};