import type { Chapter } from '../types'

export const chapter06: Chapter = {
  id: '6-information-extraction',
  number: 6,
  title: 'Information extraction concepts',
  questions: [
    {
      id: '6-01',
      question: 'Which statement best defines AI information extraction?',
      options: [
        'Using SQL to query structured data in a database',
        'Copying files from cloud storage to local disks',
        'Analyzing unstructured content to identify and extract relevant fields and values',
        'Compressing documents to reduce storage costs',
      ],
      correctIndex: 2,
      explanation:
        'Information extraction turns unstructured content (documents, images, audio, video) into structured data fields. Querying a database works on data that is already structured.',
    },
    {
      id: '6-02',
      question:
        'Which two main steps make up a comprehensive information extraction solution? Select two.',
      options: [
        'Detecting and extracting text from images with OCR',
        'Identifying values and mapping them to specific data fields',
        'Generating synthetic training documents',
        'Translating every document into English',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Computer vision (OCR) detects the text; machine learning or generative AI then maps the extracted text to fields such as vendor, date and total.',
    },
    {
      id: '6-03',
      question: 'How is OCR used in the information extraction process?',
      options: [
        'Online Content Retrieval copies cloud data to a local device',
        'Optical character recognition converts images of text into machine-readable text',
        'Open Conversion Routine converts JSON into images',
        'Optical color recognition identifies the dominant colors in a form',
      ],
      correctIndex: 1,
      explanation:
        'OCR (optical character recognition) reads text in scanned documents, photos and PDFs and turns it into editable, searchable text.',
    },
    {
      id: '6-04',
      question:
        'A scanned document is rotated a few degrees. Which OCR preprocessing technique corrects this?',
      options: [
        'Noise reduction',
        'Contrast adjustment',
        'Resolution optimization',
        'Skew correction',
      ],
      correctIndex: 3,
      explanation:
        'Skew correction detects and corrects document rotation so text lines are horizontal. Noise reduction removes dust spots and scanning artifacts.',
    },
    {
      id: '6-05',
      question:
        'In which stage of the OCR pipeline are layout analysis and reading order determination performed?',
      options: [
        'Text region detection',
        'Image acquisition',
        'Character recognition',
        'Output generation',
      ],
      correctIndex: 0,
      explanation:
        'Text region detection distinguishes text from images and white space, groups characters into words and lines, and determines the reading order. Character recognition then identifies the individual characters.',
    },
    {
      id: '6-06',
      question:
        'Why does field extraction rely on positional metadata from OCR and not just on the text itself?',
      options: [
        'Because OCR output has no text without positions',
        'Because positions are needed to compress the document',
        'Because where a value appears helps determine its meaning, for example whether "12345" is an invoice number or a customer ID',
        'Because positions replace the need for confidence scores',
      ],
      correctIndex: 2,
      explanation:
        'Field extraction uses bounding boxes, page locations and reading order: the same text can mean different things depending on where it is in the document.',
    },
    {
      id: '6-07',
      question:
        'Which two statements describe template-based field detection? Select two.',
      options: [
        'It gives high accuracy and explainable results for known document types',
        'It requires manual template creation and struggles with layout variations',
        'It handles any new layout without configuration',
        'It uses a large language model to match text to a schema',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Templates use known positions, anchor keywords and regular expressions: accurate, fast and explainable, but manual and brittle. Matching text to a schema with an LLM is the generative AI approach.',
    },
    {
      id: '6-08',
      question: 'How does generative AI enhance field extraction?',
      options: [
        'By manually coding extraction rules for each document type',
        'By using language models to match extracted text to the fields in a schema definition',
        'By generating new documents from scratch',
        'By removing the need for any OCR or text input',
      ],
      correctIndex: 1,
      explanation:
        'With prompt-based extraction you give an LLM the document text and a schema, and it maps values to the fields. Few-shot learning lets it handle custom fields with minimal examples.',
    },
    {
      id: '6-09',
      question:
        'An extraction solution checks that the line item subtotals add up to the invoice total. Which validation technique is this?',
      options: [
        'OCR confidence scoring',
        'Format checking',
        'Outlier detection',
        'Cross-field validation',
      ],
      correctIndex: 3,
      explanation:
        'Cross-field validation checks relationships between extracted fields. Format checking verifies a single value against an expected pattern, such as an email address.',
    },
    {
      id: '6-10',
      question:
        'Dates are extracted as "03/07/2025", "7-3-2025" and "July 3, 2025". Converting them all to one ISO format is part of which stage?',
      options: [
        'Data normalization and standardization',
        'OCR output ingestion',
        'Text region detection',
        'Image acquisition',
      ],
      correctIndex: 0,
      explanation:
        'Normalization transforms raw values into consistent formats (dates, currencies, casing) and enables further validation before integration with business systems.',
    },
    {
      id: '6-11',
      question:
        'A company processes high-stakes legal documents and needs very high extraction accuracy. What does the course recommend considering?',
      options: [
        'Disabling confidence scores to speed up processing',
        'Human-in-the-loop validation',
        'Using only template-based detection',
        'Removing all preprocessing',
      ],
      correctIndex: 1,
      explanation:
        'Critical applications might need human review of extracted values. Templates alone do not guarantee accuracy when layouts vary.',
    },
    {
      id: '6-12',
      question:
        'An organization must process invoices in hundreds of different layouts from many suppliers. Which approach fits best?',
      options: [
        'A fixed template per supplier with hard-coded field positions',
        'Manual data entry',
        'A machine learning or generative AI based extraction approach',
        'Plain OCR without field mapping',
      ],
      correctIndex: 2,
      explanation:
        'Standardized forms favor templates; many formats and layouts call for a learned approach. Plain OCR returns text but not the meaning of each value.',
    },
    {
      id: '6-13',
      question:
        'Which process is a typical use of optical character recognition (OCR)?',
      options: [
        'Digitizing paper medical records',
        'Identifying wildlife in a photograph',
        'Translating speech into text',
        'Controlling access to a laptop with face recognition',
      ],
      correctIndex: 0,
      explanation:
        'OCR converts printed or handwritten text in images into machine-readable text, for example to digitize records. Identifying wildlife is image classification or object detection.',
    },
  ],
}
