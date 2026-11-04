import type { Chapter } from '#/quizzes/types'

export const chapter04: Chapter = {
  id: '4-speech',
  number: 4,
  title: 'Speech recognition and synthesis',
  questions: [
    {
      id: '4-01',
      question:
        'What sampling rate is typical for capturing audio in speech recognition applications?',
      options: [
        '16,000 samples per second (16 kHz)',
        '44,100 samples per second (44.1 kHz)',
        '1,000 samples per second (1 kHz)',
        '192,000 samples per second (192 kHz)',
      ],
      correctIndex: 0,
      explanation:
        'Speech recognition balances clarity and efficiency at 8 to 16 kHz, typically 16 kHz. 44.1 kHz is used for music and captures more detail than speech needs.',
    },
    {
      id: '4-02',
      question:
        'What happens during the pre-processing stage of speech recognition?',
      options: [
        'Background noise is added to make the model more robust',
        'The audio is converted to a video format',
        'Feature vectors, such as MFCCs, are extracted from the audio waveform for modeling',
        'The transcript is capitalized and punctuated',
      ],
      correctIndex: 2,
      explanation:
        'Pre-processing turns raw samples into compact features; Mel-Frequency Cepstral Coefficients (MFCCs) mimic how the human ear perceives sound. Capitalization and punctuation are post-processing.',
    },
    {
      id: '4-03',
      question: 'What are phonemes?',
      options: [
        'Artifacts removed from the audio during clean-up',
        'The smallest units of sound that distinguish words',
        'AI models that generate audio',
        'Frames of 20 to 30 milliseconds of audio',
      ],
      correctIndex: 1,
      explanation:
        'Phonemes are the smallest units of sound; "cat" consists of /k/, /ae/ and /t/. The acoustic model predicts phonemes from audio features.',
    },
    {
      id: '4-04',
      question:
        'An acoustic model cannot tell "their" from "there" because they sound identical. Which component resolves this ambiguity?',
      options: [
        'The language model',
        'The neural vocoder',
        'Audio capture',
        'Prosody generation',
      ],
      correctIndex: 0,
      explanation:
        'The language model applies vocabulary, grammar and context to choose the most likely word sequence. Vocoders and prosody belong to speech synthesis.',
    },
    {
      id: '4-05',
      question:
        'Which decoding technique keeps a shortlist of the top-scoring partial transcriptions and prunes low-scoring paths at every step?',
      options: [
        'Inverse text normalization',
        'Grapheme-to-phoneme conversion',
        'Fourier transform',
        'Beam search',
      ],
      correctIndex: 3,
      explanation:
        'Beam search maintains a "beam" of the best hypotheses as it processes each audio frame. A wider beam is more accurate but slower.',
    },
    {
      id: '4-06',
      question:
        'A transcript shows "3 PM" although the speaker said "three p m". Which speech recognition stage produced this?',
      options: [
        'Acoustic modeling',
        'Post-processing (inverse text normalization)',
        'Audio capture',
        'Pre-processing',
      ],
      correctIndex: 1,
      explanation:
        'Post-processing cleans up raw decoder output: capitalization, punctuation, number formatting and inverse text normalization of spoken forms into written forms.',
    },
    {
      id: '4-07',
      question: 'What is the correct order of the speech recognition pipeline?',
      options: [
        'Pre-processing, audio capture, decoding, acoustic modeling, language modeling, post-processing',
        'Audio capture, acoustic modeling, pre-processing, decoding, language modeling, post-processing',
        'Audio capture, pre-processing, acoustic modeling, language modeling, decoding, post-processing',
        'Audio capture, language modeling, acoustic modeling, pre-processing, post-processing, decoding',
      ],
      correctIndex: 2,
      explanation:
        'Capture the signal, extract features, predict phonemes, apply language knowledge, search for the best word sequence, then format the text.',
    },
    {
      id: '4-08',
      question:
        'In speech synthesis, "Dr. Smith paid $25" is converted to "Doctor Smith paid twenty-five dollars". Which stage does this?',
      options: [
        'Prosody generation',
        'Text normalization',
        'Vocoding',
        'Beam search',
      ],
      correctIndex: 1,
      explanation:
        'Text normalization expands abbreviations, numbers, dates and symbols into spoken forms so the system does not try to pronounce raw symbols.',
    },
    {
      id: '4-09',
      question:
        'The words "though", "through" and "cough" share the letters "ough" but are pronounced differently. Which part of speech synthesis handles this?',
      options: [
        'Grapheme-to-phoneme (G2P) conversion during linguistic analysis',
        'Text normalization',
        'The neural vocoder',
        'Audio sampling',
      ],
      correctIndex: 0,
      explanation:
        'G2P maps written letters (graphemes) to sounds (phonemes), using pronunciation dictionaries and neural models trained on them.',
    },
    {
      id: '4-10',
      question:
        'Synthesized speech sounds robotic and monotone, although every word is pronounced correctly. Which aspect most likely needs improvement?',
      options: [
        'Text normalization',
        'The sampling rate',
        'Grapheme-to-phoneme conversion',
        'Prosody (pitch, duration, intensity, pauses and stress)',
      ],
      correctIndex: 3,
      explanation:
        'Robotic-sounding speech usually results from flat prosody, not from imperfect phoneme pronunciation. Prosody makes speech sound natural.',
    },
    {
      id: '4-11',
      question: 'What does a neural vocoder do in speech synthesis?',
      options: [
        'It converts mel-spectrograms into raw audio waveforms',
        'It converts audio into phonemes',
        'It expands abbreviations into words',
        'It detects the language of the input text',
      ],
      correctIndex: 0,
      explanation:
        'An acoustic model produces mel-spectrograms from phonemes and prosody targets; the neural vocoder turns those into audio samples. Converting audio to phonemes is speech recognition.',
    },
    {
      id: '4-12',
      question:
        'Which two factors directly affect speech recognition accuracy? Select two.',
      options: [
        'Background noise',
        'Microphone quality',
        'The neural voice selected for output',
        'The pitch contour of the synthesized response',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Background noise, microphone quality and the distance to the speaker affect the input signal. The output voice and its pitch are speech synthesis settings.',
    },
    {
      id: '4-13',
      question:
        'In which part of speech synthesis is text broken into individual words so that each word can be assigned phonetic sounds?',
      options: [
        'Lemmatization',
        'Key phrase extraction',
        'Transcribing',
        'Tokenization',
      ],
      correctIndex: 3,
      explanation:
        'Synthesis tokenizes the text into words and then assigns phonetic sounds to each word. Transcribing is the opposite direction (speech to text).',
    },
    {
      id: '4-14',
      question:
        'Which scenarios combine speech recognition and speech synthesis? Select two.',
      options: [
        'An interactive voice response (IVR) system that callers speak to and that answers with spoken guidance',
        'A language learning app that listens to a student and gives spoken feedback',
        'Batch transcription of recorded meetings into searchable notes',
        'A navigation app that announces directions',
      ],
      correctIndexes: [0, 1],
      explanation:
        'IVR and pronunciation coaching need both: listen (recognition) and respond (synthesis). Batch transcription is recognition only, and announcing directions is synthesis only.',
    },
  ],
}
