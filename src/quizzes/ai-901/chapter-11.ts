import type { Chapter } from '../types'

export const chapter11: Chapter = {
  id: '11-foundry-speech',
  number: 11,
  title: 'Speech with Azure Speech in Foundry',
  questions: [
    {
      id: '11-01',
      question:
        'Which models does speech-to-text software typically use to convert audio into text? Select two.',
      options: [
        'An acoustic model that converts audio into phonemes',
        'A language model that maps phonemes to words',
        'A neural vocoder that generates waveforms',
        'A diffusion model that removes noise',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Speech recognition combines an acoustic model (audio to phonemes) and a language model (phonemes to words). Vocoders are used in speech synthesis.',
    },
    {
      id: '11-02',
      question:
        'Why would a developer use the Azure Speech-to-Text SDK instead of only the Foundry playground?',
      options: [
        'The SDK replaces the Azure Speech models',
        'The SDK lets you add speech recognition directly to application code',
        'The SDK is required to upload audio files to the portal',
        'The SDK works without a Foundry resource',
      ],
      correctIndex: 1,
      explanation:
        'The playground is for experimenting; the SDK handles networking, authentication and audio streaming so your own app can use speech recognition.',
    },
    {
      id: '11-03',
      question:
        'In the Azure Speech SDK for Python, which object stores the key and endpoint used to connect to Azure Speech?',
      options: [
        'AudioConfig',
        'SpeechRecognizer',
        'SpeechConfig',
        'SpeechSynthesizer',
      ],
      correctIndex: 2,
      explanation:
        'SpeechConfig holds the connection information. AudioConfig identifies the audio input or output, such as the default microphone or speaker.',
    },
    {
      id: '11-04',
      question:
        'An app must keep listening and transcribe a long presentation with many utterances. Which recognition approach should it use?',
      options: [
        'recognize_once_async()',
        'A single call to speak_text_async()',
        'Batch transcription of the microphone stream',
        'start_continuous_recognition() with event handlers',
      ],
      correctIndex: 3,
      explanation:
        'recognize_once_async() returns the result for a single utterance only. Continuous recognition raises recognizing/recognized events until you stop it.',
    },
    {
      id: '11-05',
      question:
        'Which two statements about batch transcription with Azure Speech are true? Select two.',
      options: [
        'It is used for audio files that are already stored, for example referenced by a SAS URI',
        'It runs asynchronously, because jobs are scheduled on a best-effort basis',
        'It is the right choice for live captions during a presentation',
        'Each job is guaranteed to start within a fixed number of seconds',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Batch transcription processes stored recordings asynchronously; jobs normally start within minutes but there is no estimate. Live captions need real-time transcription.',
    },
    {
      id: '11-06',
      question:
        'What information does a text-to-speech solution typically require?',
      options: [
        'The text to be spoken and the voice to use',
        'An audio recording and a transcript',
        'A list of phonemes and a sampling rate only',
        'An image and a caption',
      ],
      correctIndex: 0,
      explanation:
        'Speech synthesis needs the text and a voice. The service then handles tokenization, phonetics, prosody and audio generation.',
    },
    {
      id: '11-07',
      question:
        'A Python app must speak the variable response_text with the voice "en-US-Ava:DragonHDLatestNeural" through the default speaker. Which configuration should it use?',
      options: [
        'speech_synthesis_language and file output',
        'speech_synthesis_voice_name and file output',
        'speech_synthesis_language and default speaker output',
        'speech_synthesis_voice_name and default speaker output',
      ],
      correctIndex: 3,
      explanation:
        'speech_synthesis_voice_name selects a specific voice; an AudioOutputConfig with use_default_speaker=True plays it locally. Setting only the language does not select the voice, and file output writes to a file.',
    },
    {
      id: '11-08',
      question: 'What is an advantage of neural voices in Azure Speech?',
      options: [
        'They do not require a Foundry resource',
        'They overcome common limitations such as poor intonation, producing more natural speech',
        'They transcribe audio faster',
        'They store audio permanently in Azure Storage',
      ],
      correctIndex: 1,
      explanation:
        'Neural voices use neural networks to sound more natural. You can also adjust speed and pitch, or develop custom voices.',
    },
    {
      id: '11-09',
      question: 'What does the Azure Text-to-Speech SDK handle for developers?',
      options: [
        'Only selecting the voice; you write audio files manually',
        'Permanent storage of synthesized audio in Azure Storage',
        'Authentication, network communication, audio formatting and playback',
        'Training a custom acoustic model',
      ],
      correctIndex: 2,
      explanation:
        'The SDK takes care of the plumbing so you can focus on the app experience: send text, generate speech with neural voices, play or save it.',
    },
    {
      id: '11-10',
      question:
        'What is the correct order of a speech-to-speech pipeline for a voice agent?',
      options: [
        'Speech-to-text, then processing or reasoning, then text-to-speech',
        'Text-to-speech, then reasoning, then speech-to-text',
        'Reasoning, then speech-to-text, then text-to-speech',
        'Speech-to-text, then text-to-speech, then reasoning',
      ],
      correctIndex: 0,
      explanation:
        'The agent first transcribes what the user said, decides what to say (analyze, translate, reason), and then converts the response back into speech.',
    },
    {
      id: '11-11',
      question:
        'What is the main benefit of the Voice Live API in Azure Speech?',
      options: [
        'It stores call recordings for compliance',
        'It translates documents between languages',
        'It removes the need for a generative AI model',
        'It combines speech-to-text, reasoning and text-to-speech in one fully managed real-time service',
      ],
      correctIndex: 3,
      explanation:
        'Instead of wiring separate components together, Voice Live handles real-time voice conversations (including interruptions) in one managed service. You still choose a generative AI model for it.',
    },
    {
      id: '11-12',
      question:
        'What role does the Voice Live Python SDK (azure-ai-voicelive) play in a voice-enabled agent app?',
      options: [
        'It stores audio recordings permanently',
        'It opens a real-time connection, streams audio and handles spoken responses and interruptions',
        'It replaces the microphone and speakers on the user device',
        'It converts audio files to MP4',
      ],
      correctIndex: 1,
      explanation:
        'The app streams microphone audio to Voice Live, receives the spoken response and plays it through the speakers.',
    },
    {
      id: '11-13',
      question:
        'Which two statements about Voice Live in the Foundry playground are true? Select two.',
      options: [
        'You must choose a generative AI model for the agent to use',
        'Proactive engagement lets the agent start the conversation',
        'You must build separate speech-to-text and text-to-speech pipelines first',
        'Voice mode can only be used outside an agent definition',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Voice Live uses a generative AI model alongside its acoustic models. Enabling Voice mode on a Foundry agent puts the speech configuration in the agent itself, reducing client code.',
    },
    {
      id: '11-14',
      question:
        'A Python app must send a recorded WAV question to an audio-capable Azure OpenAI model in Foundry and receive both text and WAV audio back. What should it do?',
      options: [
        'Pass the WAV file name as input_audio and request text and audio',
        'Send the WAV file as input_audio and request only the text modality',
        'Base64-encode the WAV file as input_audio and request text and audio modalities',
        'Send the WAV content as a text message and request text and audio',
      ],
      correctIndex: 2,
      explanation:
        'The audio data itself must be sent (base64-encoded) as audio input, and both modalities must be requested to get spoken output. A file name alone sends no audio.',
    },
    {
      id: '11-15',
      question:
        'Which two services together enable text-to-text and speech-to-text translation between multiple languages? Select two.',
      options: [
        'Azure Speech',
        'Azure Translator',
        'Key phrase extraction',
        'Conversational language understanding',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Azure Speech provides speech translation, and Translator translates text. Key phrase extraction and conversational language understanding do not translate.',
    },
  ],
}
