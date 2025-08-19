import { Translations } from './types';

export const translations: Translations = {
  en: {
    title: 'Are you a robot?',
    dragInstruction: 'Drag the {source} to the {target}',
    audioInstruction: 'Click the {target} sound among the audio tracks',
    emojiInstruction: 'Click the {target} emoji',
    loading: 'Loading...',
    verifying: 'Verifying...',
    success: 'Verification successful!',
    failed: 'Verification failed. Please try again.',
    retry: 'Try Again',
    playSound: 'Play Sound',
    submitAnswer: 'Submit Answer',
    attribution: 'by nexwinds.com',
    clickToVerify: 'Click to verify you\'re human',
    modalWelcomeTitle: 'Welcome to nexcaptcha',
    modalWelcomeContent: 'This verification system uses advanced security layers to protect against automated attacks while maintaining a smooth user experience.',
    modalInstructionsTitle: 'How it works',
    modalInstructionsContent: 'You\'ll complete a series of interactive challenges designed to verify human behavior. These may include drag-and-drop tasks, audio recognition, or visual puzzles.',
    modalAudioTitle: 'Audio Integration',
    modalAudioContent: 'Some challenges include audio components for accessibility and enhanced security.',
    modalReadyTitle: 'Ready to start?',
    modalReadyContent: 'Click the button below to begin your verification challenge. The process typically takes 10-30 seconds.',
    audioIntegrationTitle: 'Audio Integration Steps:',
    audioStep1: 'Audio files are dynamically generated based on challenge content',
    audioStep2: 'Use the play button to hear the audio challenge',
    audioStep3: 'Select or input your answer based on what you hear',
    audioStep4: 'Audio challenges support multiple languages and accessibility features',
    playExample: 'Play Example',
    next: 'Next',
    startChallenge: 'Start Challenge',
    regenerate: 'New Challenge',
    close: 'Close',
    verified: 'Verified'
  },
  pt: {
    title: 'Você é um robô?',
    dragInstruction: 'Arraste o {source} para o {target}',
    audioInstruction: 'Clique no som {target} entre as faixas de áudio',
    emojiInstruction: 'Clique no emoji {target}',
    loading: 'Carregando...',
    verifying: 'Verificando...',
    success: 'Verificação bem-sucedida!',
    failed: 'Verificação falhou. Tente novamente.',
    retry: 'Tentar Novamente',
    playSound: 'Reproduzir Som',
    submitAnswer: 'Enviar Resposta',
    attribution: 'Por nexwinds.com',
    regenerate: 'Novo Desafio',
    close: 'Fechar',
    verified: 'Verificado'
  },
  es: {
    title: '¿Eres un robot?',
    dragInstruction: 'Arrastra el {source} al {target}',
    audioInstruction: 'Haz clic en el sonido {target} entre las pistas de audio',
    emojiInstruction: 'Haz clic en el emoji {target}',
    loading: 'Cargando...',
    verifying: 'Verificando...',
    success: '¡Verificación exitosa!',
    failed: 'Verificación fallida. Inténtalo de nuevo.',
    retry: 'Intentar de Nuevo',
    playSound: 'Reproducir Sonido',
    submitAnswer: 'Enviar Respuesta',
    attribution: 'Por nexwinds.com',
    regenerate: 'Nuevo Desafío',
    close: 'Cerrar',
    verified: 'Verificado'
  },
  fr: {
    title: 'Êtes-vous un robot?',
    dragInstruction: 'Faites glisser le {source} vers le {target}',
    audioInstruction: 'Cliquez sur le son {target} parmi les pistes audio',
    emojiInstruction: 'Cliquez sur l\'emoji {target}',
    loading: 'Chargement...',
    verifying: 'Vérification...',
    success: 'Vérification réussie!',
    failed: 'Vérification échouée. Veuillez réessayer.',
    retry: 'Réessayer',
    playSound: 'Jouer le Son',
    submitAnswer: 'Soumettre la Réponse',
    attribution: 'Par nexwinds.com',
    regenerate: 'Nouveau Défi',
    close: 'Fermer',
    verified: 'Vérifié'
  },
  de: {
    title: 'Sind Sie ein Roboter?',
    dragInstruction: 'Ziehen Sie das {source} zum {target}',
    audioInstruction: 'Klicken Sie auf den {target}-Sound unter den Audiospuren',
    emojiInstruction: 'Klicken Sie auf das {target}-Emoji',
    loading: 'Laden...',
    verifying: 'Überprüfung...',
    success: 'Überprüfung erfolgreich!',
    failed: 'Überprüfung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    retry: 'Erneut Versuchen',
    playSound: 'Sound Abspielen',
    submitAnswer: 'Antwort Senden',
    attribution: 'Von nexwinds.com',
    regenerate: 'Neue Herausforderung',
    close: 'Schließen',
    verified: 'Verifiziert'
  }
};

export const getTranslation = (lang: string, key: string): string => {
  const langTranslations = translations[lang as keyof typeof translations] ?? translations.en;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return langTranslations[key as keyof typeof langTranslations] ?? translations.en[key as keyof typeof translations.en];
};

export const formatTranslation = (lang: string, key: string, params: Record<string, string>): string => {
  let text = getTranslation(lang, key);
  Object.entries(params).forEach(([param, value]) => {
    text = text.replace(`{${param}}`, value);
  });
  return text;
};