import type { ReactNode } from 'react';
// import { useState } from 'react'; // TODO: Uncomment this once the agentic and override modes are implemented
import { useTranslation } from 'react-i18next';
// import { useTheme } from '@app/providers';
// import { useLocalStorage } from '@shared/hooks';
// import { STORAGE_KEYS } from '@shared/constants';
// import { SUPPORTED_LOCALES } from '@shared/i18n';
import { useAIChat } from '@shared/context';
import { Button } from '@shared/components/vendor/impact-ui';
import styles from './Header.module.css';
import { getUserInfo } from '@shared/utils/userInfo';

function AskIrisIcon() {
  return (
    <svg
      className={styles.askIrisIcon}
      width="20"
      height="20"
      viewBox="0 0 19.9825 20.0001"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9.8888 17.6991C10.3293 18.0398 10.7637 18.381 11.2042 18.7158C11.2686 18.7626 11.257 18.7509 11.2277 18.8154C11.0456 19.203 10.858 19.585 10.6759 19.9726C10.6642 19.9902 10.6633 20.0137 10.6339 19.9902L10.6281 19.9843C10.1818 19.6379 9.7296 19.2907 9.28333 18.9443C9.2717 18.9385 9.25989 18.9324 9.25989 18.915C9.26009 18.9092 9.26584 18.9032 9.27161 18.8974C9.45953 18.5039 9.64814 18.1102 9.83606 17.7167C9.84766 17.6877 9.8538 17.67 9.8888 17.6991ZM17.3243 10.0175C17.3652 10.0001 17.383 9.99996 17.4122 10.0409C17.4768 10.1349 17.5468 10.2175 17.6173 10.3056L18.4337 11.3622L18.4513 11.3857C18.4513 11.3857 18.4489 11.3863 18.4464 11.3886L18.463 11.4091L13.6945 13.7001L13.3419 14.4306V14.4345C13.1658 14.7926 12.9956 15.1506 12.8253 15.5146L11.9152 17.412C11.7507 17.7527 11.5855 18.0929 11.421 18.4335C11.421 18.4453 11.4152 18.4569 11.3976 18.4628H11.3859L11.3624 18.4452L10.3058 17.6288C10.2177 17.5584 10.1292 17.4883 10.0411 17.4238C10.0131 17.4038 10.0042 17.3863 10.007 17.3661L10.006 17.3652L10.0177 17.3359L10.2999 16.7538L11.6095 14.0234C11.715 13.8019 11.8214 13.5791 11.9269 13.3593C11.9281 13.3569 11.9296 13.3547 11.9308 13.3525L12.3849 12.3964L13.3146 11.9531C13.3178 11.943 13.3296 11.9358 13.3478 11.9267C13.6413 11.7858 13.9409 11.6447 14.2345 11.5038C14.6632 11.2983 15.0919 11.0922 15.5206 10.8866C15.9258 10.6929 16.3371 10.4994 16.7423 10.2997C16.9361 10.2058 17.1305 10.1174 17.3243 10.0175ZM4.68469 9.57708C4.79035 9.77664 4.89057 9.97029 4.99622 10.1699L5.87708 11.832L6.55872 13.1249C6.59107 13.1896 6.62368 13.2542 6.66516 13.3281C6.73444 13.3628 6.79609 13.3938 6.85755 13.4296L8.15051 14.1113L9.81262 14.9921C10.0122 15.0978 10.2058 15.198 10.4054 15.3036C10.4288 15.3154 10.4347 15.3271 10.423 15.3505C10.0882 16.0435 9.75967 16.7425 9.42493 17.4355C9.28398 17.7232 9.14888 18.0169 9.00794 18.3046C9.00788 18.3221 8.99615 18.334 8.9845 18.3456L6.64368 13.332L1.6427 10.998C1.64491 10.9963 1.667 10.9801 1.68372 10.9745C1.97148 10.8336 2.2651 10.6926 2.55286 10.5575C3.24583 10.2228 3.94484 9.89424 4.63782 9.5595C4.66714 9.54777 4.67298 9.54784 4.68469 9.57708ZM18.9034 9.26556C18.9209 9.26556 18.9269 9.27738 18.9327 9.28899C19.2793 9.73535 19.6263 10.1883 19.9728 10.6347C19.9958 10.6638 19.9727 10.6699 19.9552 10.6757L19.9611 10.6816C19.5735 10.8695 19.1914 11.0513 18.8038 11.2333C18.7394 11.2626 18.7569 11.2743 18.7042 11.2099C18.3636 10.7694 18.0283 10.3349 17.6876 9.89446C17.6585 9.85948 17.6762 9.85333 17.7052 9.84173C18.0987 9.65381 18.4924 9.46519 18.8859 9.27727C18.8917 9.27727 18.8976 9.27141 18.9034 9.26556ZM1.27844 8.78997C1.61908 9.23045 1.95441 9.66492 2.29505 10.1054C2.3242 10.1404 2.30651 10.1465 2.27747 10.1581C1.88401 10.3461 1.49026 10.5347 1.0968 10.7226C1.09095 10.7226 1.08508 10.7285 1.07923 10.7343C1.06179 10.7343 1.05574 10.7225 1.04993 10.7109C0.703476 10.2646 0.356341 9.81242 0.00988909 9.36614C-0.0135944 9.33679 0.00985018 9.33002 0.0274672 9.32415L0.0216078 9.31829C0.409219 9.13036 0.791223 8.94859 1.17883 8.76653C1.24327 8.73722 1.22577 8.72558 1.27844 8.78997ZM13.338 6.66692L18.34 9.00188C18.3378 9.0035 18.3157 9.01974 18.299 9.02532C18.0112 9.16626 17.7176 9.30724 17.4298 9.44231C16.7368 9.77705 16.0378 10.1056 15.3449 10.4404C15.3155 10.4521 15.3097 10.4521 15.298 10.4228C15.1923 10.2232 15.0921 10.0296 14.9865 9.83001L14.1056 8.1679L13.424 6.87591C13.3913 6.8107 13.3584 6.74534 13.3165 6.67083C13.2475 6.63625 13.1854 6.60598 13.1241 6.57024L11.8322 5.8886L10.17 5.00774C9.97048 4.90209 9.77685 4.80188 9.57727 4.69622C9.55387 4.68449 9.54797 4.6728 9.55969 4.64934C9.89443 3.95638 10.223 3.25734 10.5577 2.56438C10.6987 2.27662 10.8338 1.983 10.9747 1.69524C10.9748 1.67778 10.9865 1.66589 10.9982 1.65423L13.338 6.66692ZM8.62024 1.55462L9.67688 2.37102C9.76497 2.44149 9.85344 2.5115 9.94153 2.5761C9.96677 2.59413 9.97505 2.61018 9.97473 2.62786L9.98255 2.6347L8.0802 6.59954L7.60364 7.60345L6.65735 8.05364C6.6515 8.05901 6.64608 8.06757 6.63489 8.07317C6.34133 8.21408 6.04173 8.35512 5.74817 8.49602C5.31949 8.70156 4.89072 8.90768 4.46204 9.11321C4.05688 9.30698 3.64552 9.50048 3.24036 9.70013C3.04655 9.79409 2.85214 9.88251 2.65833 9.98235C2.61748 9.99981 2.59971 9.9999 2.57044 9.95891C2.50585 9.86498 2.43582 9.78234 2.36536 9.69427L1.54895 8.63763L1.53137 8.61419C1.53137 8.61419 1.53404 8.61114 1.53821 8.60735L1.52551 8.59075L6.29407 6.29973L6.63587 5.58977C6.63607 5.5836 6.63784 5.57703 6.64075 5.57122V5.56536C6.81685 5.20728 6.98712 4.84923 7.15735 4.48528L8.06751 2.58782C8.23194 2.24721 8.39721 1.90695 8.56165 1.56634C8.56165 1.55459 8.56747 1.54291 8.58508 1.53704H8.5968L8.62024 1.55462ZM9.34778 0.00969583L9.35364 0.0155552C9.79999 0.362067 10.253 0.709082 10.6993 1.05559C10.7109 1.0614 10.7228 1.06748 10.7228 1.08489C10.7226 1.09066 10.7168 1.0967 10.7111 1.10247C10.5231 1.49593 10.3345 1.88967 10.1466 2.28313C10.135 2.31218 10.1289 2.32983 10.0939 2.30071C9.65339 1.96007 9.21893 1.61888 8.77844 1.28411C8.714 1.23724 8.72568 1.24899 8.75501 1.1845C8.93707 0.796877 9.1247 0.414897 9.30676 0.027274C9.31847 0.00971808 9.31873 -0.0133759 9.34778 0.00969583Z"
        fill="white"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      className={styles.bellIcon}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke="#60697D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.7295 21C13.5537 21.3031 13.3014 21.5547 12.9978 21.7295C12.6941 21.9044 12.3499 21.9965 11.9995 21.9965C11.6492 21.9965 11.3049 21.9044 11.0013 21.7295C10.6977 21.5547 10.4453 21.3031 10.2695 21"
        stroke="#60697D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const badgeName = (name: string) => {
  return name.trim()
  .split(/[\s.]+|(?=[A-Z])/)
  .filter(Boolean)
  .map(word => word[0])
  .join('')
  .toUpperCase()
};

function UserAvatar() {
  const { userName } = getUserInfo();
  return <span className={styles.avatarText}>{badgeName(userName)}</span>;
}

export interface HeaderProps {
  notificationCount?: number;
  onAgentHub?: () => void;
  actionSlot?: ReactNode;
}

export function Header({ notificationCount = 0, onAgentHub, actionSlot }: HeaderProps) {
  const { t } = useTranslation('common');
  // const { theme, toggleTheme } = useTheme();
  // const [, setLocale] = useLocalStorage<string>(STORAGE_KEYS.locale, i18n.language);
  // const [agentMode, setAgentMode] = useState<'agentic' | 'override'>('agentic'); // TODO: Uncomment this once the agentic and override modes are implemented
  const { openChat } = useAIChat();

  // const changeLanguage = (lng: string) => {
  //   setLocale(lng);
  //   void i18n.changeLanguage(lng);
  // };

  const handleAskIrisClick = () => {
    if (onAgentHub) {
      onAgentHub();
    }
    openChat({ source: 'header' });
  };

  return (
    <header className={styles.header} data-app-header>
      <div
        className={styles.brand}
        role="button"
        tabIndex={0}
        onClick={() => { window.location.href = window.location.origin + '/home'; }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') window.location.href = window.location.origin + '/home'; }}
      >
        <span className={styles.brandName}>
          <img
            alt="Impact Logo"
            height="100%"
            width="100%"
            src="https://impact-kit.devs.iaproducts.ai/api/v1/files/uploads/impact-ui/prod/icons/IA_Logo.svg"
          />
        </span>
        <span className={styles.brandDivider} aria-hidden="true" />
        <span className={styles.product}>{t('app.title')}</span>
      </div>

      <div className={styles.actions}>
        {actionSlot}
        {/* TODO: Uncomment this once the agentic and override modes are implemented */}
        {/* <div
          className={styles.modeToggle}
          role="group"
          aria-label={t('header.modeToggle')}
        >
          <button
            type="button"
            className={[styles.modeBtn, agentMode === 'agentic' && styles.modeBtnActive]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={agentMode === 'agentic'}
            onClick={() => setAgentMode('agentic')}
          >
            {t('header.agentic')}
          </button>
          <button
            type="button"
            className={[styles.modeBtn, agentMode === 'override' && styles.modeBtnActive]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={agentMode === 'override'}
            onClick={() => setAgentMode('override')}
          >
            {t('header.override')}
          </button>
        </div> */}

        <Button htmlType="button" variant="tertiary" size="large" icon={<AskIrisIcon />} onClick={handleAskIrisClick} aria-label={t('header.agentHub')} title={t('header.agentHub')}>
          Iris
        </Button>

        <span className={styles.notification}>
          <BellIcon />
          {notificationCount > 0 && (
            <span className={styles.badge}>
              <span className={styles.badgeOuter} />
              <span className={styles.badgeInner} />
            </span>
          )}
        </span>

        {/* <label className={styles.langLabel}>
          <span className="sr-only">{t('language.label')}</span>
          <select
            className={styles.langSelect}
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            aria-label={t('language.label')}
          >
            {SUPPORTED_LOCALES.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {t(`language.${locale.code}`)}
              </option>
            ))}
          </select>
        </label> */}

        {/* <button
          type="button"
          aria-label={t('theme.toggle')}
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button> */}

        <div className={styles.avatar}>
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
