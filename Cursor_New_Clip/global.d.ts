// Global type definitions for HEXGATE

// Window extensions
interface Window {
    I18N: I18NTranslations;
    _currentLang: string;
    showPage: (pageName: string, btnElement?: HTMLElement | null) => void;
    filterPatch: (category: string, btn: HTMLElement) => void;
    filterTrend: (category: string, btn: HTMLElement) => void;
    toggleTheme: () => void;
    setTheme: (themeName: string, btnElement?: HTMLElement | null) => void;
    changeFont: (fontName: string, btn: HTMLElement) => void;
    enterDashboard: () => void;
    logout: () => void;
    setLanguage: (lang: string) => void;
    applyLanguage: (lang: string) => void;
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    showLoading: (show?: boolean) => void;
}

// Translation types
type LanguageCode = 'en' | 'zh' | 'ja' | 'ko';

interface I18NTranslations {
    [key: string]: {
        nav: {
            home: string;
            trend: string;
            clips: string;
            about: string;
            settings: string;
            logout: string;
        };
        search: {
            placeholder: string;
        };
        header: {
            online: string;
        };
        login: {
            subtitle: string;
            google: string;
            facebook: string;
            riot: string;
            secure: string;
        };
        home: {
            patchNotes: string;
            myInventory: string;
            noClips: string;
        };
        clips: {
            title: string;
        };
        about: {
            title: string;
            mission: string;
            vision: string;
            support: {
                title: string;
                desc: string;
            };
            secure: {
                title: string;
                desc: string;
            };
            global: {
                title: string;
                desc: string;
            };
        };
        settings: {
            title: string;
            darkMode: string;
            typography: string;
            theme: string;
        };
        common: {
            loading: string;
            success: string;
            error: string;
            warning: string;
            info: string;
        };
    };
}

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info';

// Page names
type PageName = 'home' | 'trend' | 'clips' | 'about' | 'search';

// Theme names
type ThemeName = 'ahri' | 'yasuo' | 'garen' | 'kalista' | 'default';

// Game types
type GameType = 'lol' | 'val';

// API Response types
interface SummonerResponse {
    status?: boolean;
    gameName?: string;
    tagLine?: string;
    puuid?: string;
}

// Upload form data
interface UploadDraft {
    hero: string;
    caption: string;
    game: GameType;
}
