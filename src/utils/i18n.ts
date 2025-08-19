/**
 * Internationalization utilities for NexCaptcha
 * Provides translation, locale management, and message formatting functions
 */

import type { I18nConfig } from '../types';

// Default translations for supported languages
export const DEFAULT_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    verify: 'Verify you are human',
    title: 'Security Verification',
    loading: 'Loading challenge...',
    error: 'Verification failed',
    tryAgain: 'Try again',
    complete: 'Verification complete',
    dragDrop: 'Drag items to correct positions',
    emojiSelection: 'Select the correct emojis',
    sliderPuzzle: 'Complete the puzzle',
    numberSorting: 'Sort the numbers',
    audioMatching: 'Match the audio clips',
    submit: 'Submit',
    clear: 'Clear',
    checking: 'Checking...',
    correct: 'Correct!',
    incorrect: 'Incorrect, try again',
    timeRemaining: 'Time remaining: {time}',
    attemptsLeft: 'Attempts left: {count}',
    selectEmojis: 'Select {count} emojis',
    dragToPosition: 'Drag to position {position}',
    sortInOrder: 'Sort in {order} order',
    listenAndMatch: 'Listen and match to categories',
  },
  es: {
    verify: 'Verificar que soy humano',
    title: 'Verificación de seguridad',
    loading: 'Cargando desafío...',
    error: 'Verificación fallida',
    tryAgain: 'Intentar de nuevo',
    complete: 'Verificación completa',
    dragDrop: 'Arrastra elementos a las posiciones correctas',
    emojiSelection: 'Selecciona los emojis correctos',
    sliderPuzzle: 'Completa el rompecabezas',
    numberSorting: 'Ordena los números',
    audioMatching: 'Empareja los clips de audio',
    submit: 'Enviar',
    clear: 'Limpiar',
    checking: 'Verificando...',
    correct: '¡Correcto!',
    incorrect: 'Incorrecto, inténtalo de nuevo',
    timeRemaining: 'Tiempo restante: {time}',
    attemptsLeft: 'Intentos restantes: {count}',
    selectEmojis: 'Selecciona {count} emojis',
    dragToPosition: 'Arrastra a la posición {position}',
    sortInOrder: 'Ordena en orden {order}',
    listenAndMatch: 'Escucha y empareja con categorías',
  },
  fr: {
    verify: 'Vérifier que vous êtes humain',
    title: 'Vérification de sécurité',
    loading: 'Chargement du défi...',
    error: 'Échec de la vérification',
    tryAgain: 'Réessayer',
    complete: 'Vérification terminée',
    dragDrop: 'Faites glisser les éléments aux bonnes positions',
    emojiSelection: 'Sélectionnez les bons emojis',
    sliderPuzzle: 'Complétez le puzzle',
    numberSorting: 'Triez les nombres',
    audioMatching: 'Associez les clips audio',
    submit: 'Soumettre',
    clear: 'Effacer',
    checking: 'Vérification...',
    correct: 'Correct !',
    incorrect: 'Incorrect, réessayez',
    timeRemaining: 'Temps restant : {time}',
    attemptsLeft: 'Tentatives restantes : {count}',
    selectEmojis: 'Sélectionnez {count} emojis',
    dragToPosition: 'Glissez vers la position {position}',
    sortInOrder: 'Triez par ordre {order}',
    listenAndMatch: 'Écoutez et associez aux catégories',
  },
  de: {
    verify: 'Bestätigen Sie, dass Sie ein Mensch sind',
    title: 'Sicherheitsüberprüfung',
    loading: 'Herausforderung wird geladen...',
    error: 'Überprüfung fehlgeschlagen',
    tryAgain: 'Erneut versuchen',
    complete: 'Überprüfung abgeschlossen',
    dragDrop: 'Ziehen Sie Elemente an die richtigen Positionen',
    emojiSelection: 'Wählen Sie die richtigen Emojis',
    sliderPuzzle: 'Vervollständigen Sie das Puzzle',
    numberSorting: 'Sortieren Sie die Zahlen',
    audioMatching: 'Ordnen Sie die Audio-Clips zu',
    submit: 'Absenden',
    clear: 'Löschen',
    checking: 'Überprüfung...',
    correct: 'Richtig!',
    incorrect: 'Falsch, versuchen Sie es erneut',
    timeRemaining: 'Verbleibende Zeit: {time}',
    attemptsLeft: 'Verbleibende Versuche: {count}',
    selectEmojis: 'Wählen Sie {count} Emojis',
    dragToPosition: 'Zur Position {position} ziehen',
    sortInOrder: 'In {order} Reihenfolge sortieren',
    listenAndMatch: 'Hören und Kategorien zuordnen',
  },
  pt: {
    verify: 'Verificar que você é humano',
    title: 'Verificação de segurança',
    loading: 'Carregando desafio...',
    error: 'Verificação falhou',
    tryAgain: 'Tentar novamente',
    complete: 'Verificação completa',
    dragDrop: 'Arraste itens para as posições corretas',
    emojiSelection: 'Selecione os emojis corretos',
    sliderPuzzle: 'Complete o quebra-cabeça',
    numberSorting: 'Ordene os números',
    audioMatching: 'Combine os clipes de áudio',
    submit: 'Enviar',
    clear: 'Limpar',
    checking: 'Verificando...',
    correct: 'Correto!',
    incorrect: 'Incorreto, tente novamente',
    timeRemaining: 'Tempo restante: {time}',
    attemptsLeft: 'Tentativas restantes: {count}',
    selectEmojis: 'Selecione {count} emojis',
    dragToPosition: 'Arraste para a posição {position}',
    sortInOrder: 'Ordene em ordem {order}',
    listenAndMatch: 'Ouça e combine com categorias',
  },
  it: {
    verify: 'Verifica di essere umano',
    title: 'Verifica di sicurezza',
    loading: 'Caricamento sfida...',
    error: 'Verifica fallita',
    tryAgain: 'Riprova',
    complete: 'Verifica completata',
    dragDrop: 'Trascina gli elementi nelle posizioni corrette',
    emojiSelection: 'Seleziona le emoji corrette',
    sliderPuzzle: 'Completa il puzzle',
    numberSorting: 'Ordina i numeri',
    audioMatching: 'Abbina i clip audio',
    submit: 'Invia',
    clear: 'Cancella',
    checking: 'Verifica...',
    correct: 'Corretto!',
    incorrect: 'Sbagliato, riprova',
    timeRemaining: 'Tempo rimanente: {time}',
    attemptsLeft: 'Tentativi rimanenti: {count}',
    selectEmojis: 'Seleziona {count} emoji',
    dragToPosition: 'Trascina alla posizione {position}',
    sortInOrder: 'Ordina in ordine {order}',
    listenAndMatch: 'Ascolta e abbina alle categorie',
  },
  ja: {
    verify: 'あなたが人間であることを確認してください',
    title: 'セキュリティ確認',
    loading: 'チャレンジを読み込み中...',
    error: '確認に失敗しました',
    tryAgain: 'もう一度試す',
    complete: '確認完了',
    dragDrop: 'アイテムを正しい位置にドラッグしてください',
    emojiSelection: '正しい絵文字を選択してください',
    sliderPuzzle: 'パズルを完成させてください',
    numberSorting: '数字を並べ替えてください',
    audioMatching: 'オーディオクリップをマッチさせてください',
    submit: '送信',
    clear: 'クリア',
    checking: '確認中...',
    correct: '正解！',
    incorrect: '不正解、もう一度試してください',
    timeRemaining: '残り時間: {time}',
    attemptsLeft: '残り試行回数: {count}',
    selectEmojis: '{count}個の絵文字を選択',
    dragToPosition: '位置{position}にドラッグ',
    sortInOrder: '{order}順に並べ替え',
    listenAndMatch: '聞いてカテゴリーとマッチさせる',
  },
  ko: {
    verify: '당신이 인간임을 확인하세요',
    title: '보안 확인',
    loading: '챌린지 로딩 중...',
    error: '확인 실패',
    tryAgain: '다시 시도',
    complete: '확인 완료',
    dragDrop: '항목을 올바른 위치로 드래그하세요',
    emojiSelection: '올바른 이모지를 선택하세요',
    sliderPuzzle: '퍼즐을 완성하세요',
    numberSorting: '숫자를 정렬하세요',
    audioMatching: '오디오 클립을 매치하세요',
    submit: '제출',
    clear: '지우기',
    checking: '확인 중...',
    correct: '정답!',
    incorrect: '틀렸습니다, 다시 시도하세요',
    timeRemaining: '남은 시간: {time}',
    attemptsLeft: '남은 시도 횟수: {count}',
    selectEmojis: '{count}개의 이모지 선택',
    dragToPosition: '위치 {position}로 드래그',
    sortInOrder: '{order} 순서로 정렬',
    listenAndMatch: '듣고 카테고리와 매치',
  },
  'zh-CN': {
    verify: '验证您是人类',
    title: '安全验证',
    loading: '正在加载挑战...',
    error: '验证失败',
    tryAgain: '重试',
    complete: '验证完成',
    dragDrop: '将项目拖拽到正确位置',
    emojiSelection: '选择正确的表情符号',
    sliderPuzzle: '完成拼图',
    numberSorting: '对数字进行排序',
    audioMatching: '匹配音频片段',
    submit: '提交',
    clear: '清除',
    checking: '检查中...',
    correct: '正确！',
    incorrect: '错误，请重试',
    timeRemaining: '剩余时间：{time}',
    attemptsLeft: '剩余尝试次数：{count}',
    selectEmojis: '选择{count}个表情符号',
    dragToPosition: '拖拽到位置{position}',
    sortInOrder: '按{order}顺序排序',
    listenAndMatch: '听音频并匹配类别',
  },
  'zh-TW': {
    verify: '驗證您是人類',
    title: '安全驗證',
    loading: '正在載入挑戰...',
    error: '驗證失敗',
    tryAgain: '重試',
    complete: '驗證完成',
    dragDrop: '將項目拖曳到正確位置',
    emojiSelection: '選擇正確的表情符號',
    sliderPuzzle: '完成拼圖',
    numberSorting: '對數字進行排序',
    audioMatching: '匹配音訊片段',
    submit: '提交',
    clear: '清除',
    checking: '檢查中...',
    correct: '正確！',
    incorrect: '錯誤，請重試',
    timeRemaining: '剩餘時間：{time}',
    attemptsLeft: '剩餘嘗試次數：{count}',
    selectEmojis: '選擇{count}個表情符號',
    dragToPosition: '拖曳到位置{position}',
    sortInOrder: '按{order}順序排序',
    listenAndMatch: '聽音訊並匹配類別',
  },
};

// Supported locales
export const SUPPORTED_LOCALES = Object.keys(DEFAULT_TRANSLATIONS);

// RTL (Right-to-Left) languages
export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'];

/**
 * I18n utility class for managing translations and locale
 */
export class I18nManager {
  private locale: string;
  private messages: Record<string, string>;
  private fallbackLocale: string;

  constructor(config?: I18nConfig) {
    this.locale = config?.locale || 'en';
    this.fallbackLocale = 'en';
    this.messages = this.buildMessages(config);
  }

  /**
   * Build messages object from config and defaults
   */
  private buildMessages(config?: I18nConfig): Record<string, string> {
    const defaultMessages = DEFAULT_TRANSLATIONS[this.locale] || DEFAULT_TRANSLATIONS[this.fallbackLocale];
    const customMessages = config?.messages || {};
    
    return {
      ...defaultMessages,
      ...customMessages,
    };
  }

  /**
   * Get translated message by key
   */
  t(key: string, params?: Record<string, string | number>): string {
    let message = this.messages[key];
    
    // Fallback to default locale if key not found
    if (!message && this.locale !== this.fallbackLocale) {
      message = DEFAULT_TRANSLATIONS[this.fallbackLocale][key];
    }
    
    // Fallback to key if no translation found
    if (!message) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    // Replace parameters in message
    if (params) {
      return this.formatMessage(message, params);
    }
    
    return message;
  }

  /**
   * Format message with parameters
   */
  private formatMessage(message: string, params: Record<string, string | number>): string {
    return message.replace(/\{(\w+)\}/g, (match, key) => {
      const value = params[key];
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Change locale and rebuild messages
   */
  setLocale(locale: string, customMessages?: Record<string, string>): void {
    this.locale = locale;
    this.messages = this.buildMessages({ locale, messages: customMessages });
  }

  /**
   * Get current locale
   */
  getLocale(): string {
    return this.locale;
  }

  /**
   * Check if locale is RTL
   */
  isRTL(): boolean {
    return RTL_LOCALES.includes(this.locale);
  }

  /**
   * Get direction for CSS
   */
  getDirection(): 'ltr' | 'rtl' {
    return this.isRTL() ? 'rtl' : 'ltr';
  }

  /**
   * Add or update translations
   */
  addTranslations(translations: Record<string, string>): void {
    this.messages = {
      ...this.messages,
      ...translations,
    };
  }

  /**
   * Get all available messages
   */
  getMessages(): Record<string, string> {
    return { ...this.messages };
  }
}

/**
 * Create I18n manager instance
 */
export const createI18nManager = (config?: I18nConfig): I18nManager => {
  return new I18nManager(config);
};

/**
 * Detect browser locale
 */
export const detectBrowserLocale = (): string => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const browserLocale = navigator.language || (navigator as any).userLanguage;
  
  // Check if exact locale is supported
  if (SUPPORTED_LOCALES.includes(browserLocale)) {
    return browserLocale;
  }
  
  // Check if language part is supported (e.g., 'en' from 'en-US')
  const languageCode = browserLocale.split('-')[0];
  if (SUPPORTED_LOCALES.includes(languageCode)) {
    return languageCode;
  }
  
  // Check for Chinese variants
  if (browserLocale.startsWith('zh')) {
    if (browserLocale.includes('TW') || browserLocale.includes('HK') || browserLocale.includes('MO')) {
      return 'zh-TW';
    }
    return 'zh-CN';
  }
  
  return 'en'; // Default fallback
};

/**
 * Validate locale
 */
export const isValidLocale = (locale: string): boolean => {
  return SUPPORTED_LOCALES.includes(locale);
};

/**
 * Get locale display name
 */
export const getLocaleDisplayName = (locale: string): string => {
  const displayNames: Record<string, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    pt: 'Português',
    it: 'Italiano',
    ja: '日本語',
    ko: '한국어',
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
  };
  
  return displayNames[locale] || locale;
};

/**
 * Format time duration for display
 */
export const formatDuration = (seconds: number, locale: string = 'en'): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${remainingSeconds}s`;
};

/**
 * Format number for display based on locale
 */
export const formatNumber = (num: number, locale: string = 'en'): string => {
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch {
    return num.toString();
  }
};

/**
 * Get plural form based on count and locale
 */
export const getPlural = (count: number, singular: string, plural: string, locale: string = 'en'): string => {
  // Simplified pluralization - in production, use a proper i18n library like react-i18next
  if (locale.startsWith('zh') || locale === 'ja' || locale === 'ko') {
    // Languages without plural forms
    return singular;
  }
  
  return count === 1 ? singular : plural;
};

// Export default instance for convenience
export const defaultI18n = createI18nManager();

// Utility function for quick translation
export const t = (key: string, params?: Record<string, string | number>): string => {
  return defaultI18n.t(key, params);
};