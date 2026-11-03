import type { Chapter } from '../types'

export const chapter13: Chapter = {
  id: '13-content-understanding',
  number: 13,
  title: 'Information extraction with Content Understanding',
  questions: [
    {
      id: '13-01',
      question:
        'Which three content types can Azure Content Understanding extract structured data from? Select three.',
      options: [
        'Documents and images',
        'Audio recordings',
        'Video',
        'Relational database tables',
        'Compiled source code',
      ],
      correctIndexes: [0, 1, 2],
      explanation:
        'Content Understanding handles documents and images (PDFs, forms, invoices, receipts), audio (calls, recordings) and video. Database tables are already structured.',
    },
    {
      id: '13-02',
      question:
        'What is the key advantage of Azure Content Understanding over basic OCR?',
      options: [
        'It extracts text faster by skipping preprocessing',
        'It understands document structure and maps extracted data to a defined schema',
        'It only extracts the relationships between words, while OCR extracts structured data',
        'It does not require a Foundry resource',
      ],
      correctIndex: 1,
      explanation:
        'Basic OCR reads text but does not understand meaning or relationships. Schema-based extraction of fields and values is what sets Content Understanding apart.',
    },
    {
      id: '13-03',
      question:
        'In Azure Content Understanding, what is the purpose of a schema for document analysis?',
      options: [
        'To capture text and layout from pages',
        'To assign confidence scores to recognized text',
        'To normalize files into supported formats',
        'To define the fields (and their structure) for the values you want to extract',
      ],
      correctIndex: 3,
      explanation:
        'A schema lists the fields you care about and how they are structured, including nested collections such as invoice line items.',
    },
    {
      id: '13-04',
      question:
        'One invoice labels its number "Invoice No.", another "Invoice #", and a third has no label at all. What happens with a schema field InvoiceNumber?',
      options: [
        'All three can map to InvoiceNumber, because schemas are applied semantically',
        'Only exact label matches are extracted',
        'You need a separate schema per label variant',
        'Unlabeled values are always skipped',
      ],
      correctIndex: 0,
      explanation:
        'Content Understanding extracts the expected meaning, not just labels, so fields can be found even when labels differ or are missing.',
    },
    {
      id: '13-05',
      question:
        'What helps Content Understanding extract structured information from handwritten or visually complex forms?',
      options: [
        'Exact label matching',
        'Fixed page coordinates',
        'Schema-defined fields and relationships',
        'Source file normalization',
      ],
      correctIndex: 2,
      explanation:
        'Schema-defined fields describe what to extract regardless of layout. Exact labels and fixed coordinates break when forms vary or are handwritten.',
    },
    {
      id: '13-06',
      question:
        'What is the primary role of an analyzer in Azure Content Understanding?',
      options: [
        'It stores extracted data in a database',
        'It converts JSON output into human-readable text',
        'It defines how content is processed and what structured data is returned',
        'It trains a new foundation model',
      ],
      correctIndex: 2,
      explanation:
        'An analyzer defines the content type, extraction settings and output structure (schema), and applies them consistently to every request. Prebuilt and custom analyzers exist.',
    },
    {
      id: '13-07',
      question:
        'Scanned supplier forms contain fields and pricing tables. Which analyzer capability returns structured JSON for the fields and the repeated table rows?',
      options: [
        'Content extraction',
        'Field extraction',
        'Classification',
        'Markdown output',
      ],
      correctIndex: 1,
      explanation:
        'Field extraction returns schema-defined values, including repeated rows. Content extraction returns text and layout, and classification categorizes documents.',
    },
    {
      id: '13-08',
      question:
        'You need to extract product brands, counts and shelf condition from photos of store shelves as structured fields with confidence values. What should you create?',
      options: [
        'A Content Understanding document analyzer with a field schema',
        'An Azure Vision image analysis request that uses OCR',
        'A Content Safety image moderation configuration',
        'A Content Understanding image analyzer with a field schema',
      ],
      correctIndex: 3,
      explanation:
        'An image analyzer with a schema returns custom structured values from still images. OCR only reads visible text, and a document analyzer is meant for documents.',
    },
    {
      id: '13-09',
      question:
        'You must analyze recorded support calls between an agent and a customer and get role-attributed transcripts, summaries and sentiment with minimal configuration. Which analyzer should you use?',
      options: [
        'prebuilt-callCenter',
        'prebuilt-audioSearch',
        'A custom audio analyzer',
        'prebuilt-invoice',
      ],
      correctIndex: 0,
      explanation:
        'prebuilt-callCenter is designed for post-call analysis with speaker roles, summaries and sentiment. prebuilt-audioSearch is optimized for search and retrieval, and a custom analyzer needs more configuration.',
    },
    {
      id: '13-10',
      question:
        'A Python app analyzes videos with Content Understanding. Which two elements give speaker-attributed speech segments with times and timestamps of representative frames? Select two.',
      options: [
        'The transcriptPhrases array',
        'The keyFrameTimesMs array',
        'The cameraShotTimesMs array',
        'The width and height properties',
      ],
      correctIndexes: [0, 1],
      explanation:
        'transcriptPhrases holds speaker-attributed speech with start and end times; keyFrameTimesMs holds timestamps of representative key frames. cameraShotTimesMs marks shot changes.',
    },
    {
      id: '13-11',
      question:
        'Product images must yield descriptive text for an image search index and a structured product category. Which two actions should you perform? Select two.',
      options: [
        'Map the Markdown output to the content field of the search index',
        'Add a schema field that uses classify for the product category',
        'Configure Content Safety image moderation categories',
        'Map source locations to the content field of the search index',
      ],
      correctIndexes: [0, 1],
      explanation:
        'The Markdown output provides searchable descriptive content; a classify field returns a structured category. Source locations only identify where content came from.',
    },
    {
      id: '13-12',
      question:
        'When you submit content to Content Understanding with the Python SDK, what happens next?',
      options: [
        'The results are returned immediately in the same request',
        'The analysis runs asynchronously; you poll (or let the SDK poller wait) until the job completes',
        'The analyzer retrains itself on the submitted content',
        'The content is stored permanently in the analyzer',
      ],
      correctIndex: 1,
      explanation:
        'begin_analyze() starts a long-running operation; poller.result() waits for it. With the REST API you poll the Operation-Location URL.',
    },
    {
      id: '13-13',
      question:
        'Which statement about the enableOcr setting in Content Understanding is correct?',
      options: [
        'It extracts transcripts from audio and video files',
        'It is required for image search analyzers',
        'It applies to document text extraction; audio and video transcription use audiovisual analysis instead',
        'It translates extracted text into English',
      ],
      correctIndex: 2,
      explanation:
        'OCR reads text from document images. Transcripts of audio and video come from speech recognition in the audiovisual analyzers.',
    },
    {
      id: '13-14',
      question:
        'A voicemail is analyzed with a schema that includes caller, message summary, requested actions and callback number. In what format does Content Understanding return the result?',
      options: [
        'Structured JSON that matches the schema',
        'A WAV file with the extracted fields read aloud',
        'A PDF report',
        'Plain text without field names',
      ],
      correctIndex: 0,
      explanation:
        'Results are returned as structured JSON (with confidence scores per field), which makes them easy to store, search or integrate into downstream systems.',
    },
  ],
}
