import type { Lang } from '../index';

export interface Role {
  company: string;
  title: string;
  dates: string;
  summary?: string;
  highlights?: string[];
}

export interface ResumeCopy {
  title: string;
  description: string;
  heading: string;
  tagline: string;
  location: string;
  experience: string;
  education: string;
  university: string;
  degree: string;
  educationNote: string;
  skillsHeading: string;
  languagesHeading: string;
  languages: string;
  skills: string[];
  roles: Role[];
}

export const resume: Record<Lang, ResumeCopy> = {
  en: {
    title: 'Sam Slotsky | Resume',
    description: 'Sam Slotsky: senior and staff software engineer at Keycard, Reddit, Shopify, Gatsby and Manifold.',
    heading: 'Resume',
    tagline: 'Paterfamilias. Jazz saxophonist. Code quality champion. I like to make things that are good.',
    location: 'Minneapolis–St. Paul',
    experience: 'Experience',
    education: 'Education',
    university: 'University of Iowa',
    degree: 'BA, Computer Science and Jazz Studies · 2005 – 2009',
    educationNote: 'Phi Beta Kappa. Studied French language, history and government at the Institute of Urban Sciences in 2007.',
    skillsHeading: 'Skills',
    languagesHeading: 'Languages',
    languages: 'English (native), French (professional working proficiency)',
    skills: [
    "TypeScript",
    "JavaScript",
    "Node.js",
    "React",
    "Web Components",
    "ReScript & OCaml",
    "PostgreSQL",
    "Build tooling & bundlers",
    "CI/CD",
    "Testing & visual regression",
    "Micro-frontends",
    "Mentoring",
    "Cross-team alignment",
  ],
    roles: [
    {
      company: "Keycard",
      title: "Member of Technical Staff",
      dates: "Jan 2026 – Present",
      summary:
        "Building the Keycard Console, the management UI for identity and access for AI agents.",
      highlights: [
        "Made access policy approachable for every admin without limiting experts by building a best-in-class policy builder: a rich visual editor alongside a full-control Cedar editor with an IDE-like experience, without compromising performance.",
        "Made every surface, from the Console to the server-rendered sign-in and signup pages, feel like one consistently beautiful and delightful product, despite different tech and performance requirements, by building and maintaining the design library that powers them all.",
        "Kept every Console page fast as customer data grew by converting the entire management API to keyset pagination, almost single-handedly.",
        "Helped take Keycard from zero to one with self-serve onboarding that gets new users from sign-up to a deployed, Keycard-secured agent in one sitting, implementing most of its front-end progress signals, often by extending the APIs behind them first.",
      ],
    },
    {
      company: "Reddit",
      title: "Senior Software Engineer",
      dates: "Nov 2023 – Jan 2026",
      summary:
        "Maintained the framework and infrastructure used to build and serve Reddit on the web.",
      highlights: [
        "Revamped a slow, resource-hungry bundling process so it scales as more languages are added, letting i18n expansion continue without slowing down shipping.",
        "Cut the development feedback loop to a small fraction of its old length by enabling local development as an alternative to the cloud-based workflow.",
        "Tuned CI processes and resources to shorten overall time to production.",
      ],
    },
    {
      company: "Shopify → Flexport",
      title: "Senior Software Engineer",
      dates: "Jun 2021 – Nov 2023",
      summary:
        "Logistics engineering on the Shopify Fulfillment Network (SFN), continuing at Flexport after Shopify sold its fulfillment business to Flexport.",
      highlights: [
        "Designed and built systems to orchestrate and track inventory transfers within a fulfillment network.",
        "Built tools for support staff to correct data inconsistencies caused by operational errors with transfer inventory.",
        "Drove the adoption of better database tooling as the new standard for the engineering organization.",
        "Gathered alignment across many teams on transfer problems that touch multiple domains, and led teams building that multi-domain software.",
      ],
    },
    {
      company: "Gatsby",
      title: "Staff Software Engineer",
      dates: "May 2020 – Jun 2021",
      highlights: [
        "Expanded Gatsby Cloud to build sites from GitLab and Bitbucket repositories.",
        "Built a Shopify integration that scales resiliently to 10k products.",
        "Led by example on code quality, readability and maintainability, and made sure feature work shipped with tests and metrics.",
        "Kept the team shipping by finding and removing bottlenecks to production and advocating for small units of work with WIP limits.",
        "Leveled up junior engineers through regular 1:1s and pair programming.",
      ],
    },
    {
      company: "Manifold",
      title: "Lead Frontend Engineer",
      dates: "Apr 2018 – May 2020",
      highlights: [
        "Co-architected and led the implementation of the management console, the first Manifold app built on a micro-frontend architecture.",
        "Persuaded the organization to adopt TypeScript incrementally on the front end, and supported coworkers through the transition.",
        "Mentored the team on testing: raised Dashboard coverage from 20% to 80% and built a full-stack visual regression suite for our Web Components.",
        "Led the front-end guild in aligning on values for improving software quality.",
      ],
    },
    {
      company: "Ackmann & Dickenson",
      title: "Software Engineer → Senior → Principal",
      dates: "Mar 2012 – Apr 2018",
      summary: "Built custom software for clients in a variety of industries.",
      highlights: [
        "Used PostgreSQL to compute daily statistics over an enormous set of medical compensation data for SullivanCotter.",
        "Built a popular, highly performant leaderboard for MotivAction, with custom SQL that supported many different ranking metrics.",
        "Wrote open source list management and form validation libraries reused across client applications.",
        "Established standards and practices to keep quality and consistency high.",
      ],
    },
    {
      company: "Thomson Reuters",
      title: "Software Engineer",
      dates: "Jun 2009 – Mar 2012",
      highlights: [
        "Built UIs on back-end services for legal research products, and led coordination between the website team and a new DataRoom service.",
        "Introduced behavior-driven development by writing tests in SpecFlow.",
      ],
    },
  ],
  },
  ru: {
    title: 'Сэм Слотски | Резюме',
    description: 'Сэм Слотски: старший и ведущий (staff) инженер-программист в Keycard, Reddit, Shopify, Gatsby и Manifold.',
    heading: 'Резюме',
    tagline: 'Глава семьи. Джазовый саксофонист. Поборник качественного кода. Люблю делать хорошие вещи.',
    location: 'Миннеаполис — Сент-Пол',
    experience: 'Опыт работы',
    education: 'Образование',
    university: 'Университет Айовы',
    degree: 'Бакалавр, информатика и джазовое исполнительство · 2005 – 2009',
    educationNote: 'Член общества Phi Beta Kappa. В 2007 году изучал французский язык, историю и государственное управление в Институте урбанистики.',
    skillsHeading: 'Навыки',
    languagesHeading: 'Языки',
    languages: 'Английский (родной), французский (профессиональный рабочий уровень)',
    skills: ['TypeScript', 'JavaScript', 'Node.js', 'React', 'Web Components', 'ReScript и OCaml', 'PostgreSQL', 'Инструменты сборки и бандлеры', 'CI/CD', 'Тестирование и визуальная регрессия', 'Микрофронтенды', 'Менторство', 'Согласование между командами'],
    roles: [
      {
        company: 'Keycard',
        title: 'Член технического персонала',
        dates: 'янв. 2026 – настоящее время',
        summary: 'Разрабатываю Keycard Console — интерфейс управления идентификацией и доступом для ИИ-агентов.',
        highlights: [
          'Сделал политику доступа понятной любому администратору, не ограничивая экспертов: создал лучший в своём классе конструктор политик — богатый визуальный редактор и полнофункциональный редактор Cedar с возможностями уровня IDE, без ущерба для производительности.',
          'Добился того, что все интерфейсы, от Console до серверных страниц входа и регистрации, ощущаются как единый, неизменно красивый и приятный продукт, несмотря на разные технологии и требования к производительности: создал и поддерживаю библиотеку дизайна, на которой они все построены.',
          'Сохранил высокую скорость всех страниц Console по мере роста данных клиентов, почти в одиночку переведя весь API управления на keyset-пагинацию.',
          'Помог вывести Keycard «от нуля к единице» с помощью самостоятельного онбординга, который за один присест ведёт нового пользователя от регистрации до развёрнутого агента, защищённого Keycard; реализовал большую часть сигналов прогресса во фронтенде, часто сначала расширяя стоящие за ними API.',
        ],
      },
      {
        company: 'Reddit',
        title: 'Старший инженер-программист',
        dates: 'нояб. 2023 – янв. 2026',
        summary: 'Поддерживал фреймворк и инфраструктуру, на которых строится и работает веб-версия Reddit.',
        highlights: [
          'Переработал медленный и ресурсоёмкий процесс сборки так, чтобы он масштабировался с добавлением новых языков: расширение i18n продолжилось без замедления релизов.',
          'Сократил цикл обратной связи при разработке до малой доли прежнего, сделав локальную разработку альтернативой облачному процессу.',
          'Настроил процессы и ресурсы CI, чтобы сократить общее время выхода в продакшен.',
        ],
      },
      {
        company: 'Shopify → Flexport',
        title: 'Старший инженер-программист',
        dates: 'июнь 2021 – нояб. 2023',
        summary: 'Логистическая разработка в Shopify Fulfillment Network (SFN); после продажи фулфилмент-бизнеса Shopify компании Flexport продолжил работу во Flexport.',
        highlights: [
          'Спроектировал и создал системы для оркестрации и отслеживания перемещений запасов внутри сети фулфилмента.',
          'Создал инструменты, с помощью которых служба поддержки исправляет несоответствия в данных о перемещаемых запасах, вызванные операционными ошибками.',
          'Добился принятия более удобных инструментов для работы с базами данных в качестве нового стандарта инженерной организации.',
          'Согласовывал позиции многих команд по проблемам перемещений, затрагивающим несколько доменов, и руководил командами, разрабатывавшими это междоменное ПО.',
        ],
      },
      {
        company: 'Gatsby',
        title: 'Ведущий (staff) инженер-программист',
        dates: 'май 2020 – июнь 2021',
        highlights: [
          'Расширил Gatsby Cloud, добавив сборку сайтов из репозиториев GitLab и Bitbucket.',
          'Создал интеграцию с Shopify, устойчиво масштабирующуюся до 10 тыс. товаров.',
          'Личным примером задавал планку качества, читаемости и сопровождаемости кода и следил, чтобы новые функции выходили с тестами и метриками.',
          'Поддерживал темп релизов команды: находил и устранял узкие места на пути в продакшен и продвигал небольшие единицы работы с лимитами WIP.',
          'Помогал расти младшим инженерам через регулярные встречи один на один и парное программирование.',
        ],
      },
      {
        company: 'Manifold',
        title: 'Ведущий фронтенд-инженер',
        dates: 'апр. 2018 – май 2020',
        highlights: [
          'Был одним из архитекторов и руководил разработкой консоли управления — первого приложения Manifold на микрофронтендной архитектуре.',
          'Убедил организацию постепенно перейти на TypeScript во фронтенде и поддерживал коллег во время перехода.',
          'Обучал команду тестированию: поднял покрытие Dashboard с 20% до 80% и создал полностековый набор тестов визуальной регрессии для наших веб-компонентов.',
          'Руководил фронтенд-гильдией в выработке общих ценностей для повышения качества ПО.',
        ],
      },
      {
        company: 'Ackmann & Dickenson',
        title: 'Инженер-программист → старший → главный',
        dates: 'март 2012 – апр. 2018',
        summary: 'Разрабатывал заказное ПО для клиентов из самых разных отраслей.',
        highlights: [
          'С помощью PostgreSQL вычислял ежедневную статистику по огромному массиву данных о вознаграждении медиков для SullivanCotter.',
          'Создал популярную и очень быструю таблицу лидеров для MotivAction с собственным SQL, поддерживавшим множество метрик ранжирования.',
          'Написал библиотеки с открытым кодом для управления списками и валидации форм, которые повторно использовались в клиентских приложениях.',
          'Внедрил стандарты и практики, поддерживавшие высокое качество и единообразие.',
        ],
      },
      {
        company: 'Thomson Reuters',
        title: 'Инженер-программист',
        dates: 'июнь 2009 – март 2012',
        highlights: [
          'Создавал интерфейсы поверх бэкенд-сервисов для продуктов юридических исследований и руководил координацией между командой сайта и новым сервисом DataRoom.',
          'Внедрил разработку через поведение (BDD), написав тесты на SpecFlow.',
        ],
      },
    ],
  },
  uk: {
    title: 'Сем Слотскі | Резюме',
    description: 'Сем Слотскі: старший і провідний (staff) інженер-програміст у Keycard, Reddit, Shopify, Gatsby та Manifold.',
    heading: 'Резюме',
    tagline: 'Голова родини. Джазовий саксофоніст. Поборник якісного коду. Люблю робити добрі речі.',
    location: 'Міннеаполіс — Сент-Пол',
    experience: 'Досвід роботи',
    education: 'Освіта',
    university: 'Університет Айови',
    degree: 'Бакалавр, інформатика та джазове виконавство · 2005 – 2009',
    educationNote: 'Член товариства Phi Beta Kappa. 2007 року вивчав французьку мову, історію та державне управління в Інституті урбаністики.',
    skillsHeading: 'Навички',
    languagesHeading: 'Мови',
    languages: 'Англійська (рідна), французька (професійний робочий рівень)',
    skills: ['TypeScript', 'JavaScript', 'Node.js', 'React', 'Web Components', 'ReScript і OCaml', 'PostgreSQL', 'Інструменти збирання та бандлери', 'CI/CD', 'Тестування та візуальна регресія', 'Мікрофронтенди', 'Менторство', 'Узгодження між командами'],
    roles: [
      {
        company: 'Keycard',
        title: 'Член технічного персоналу',
        dates: 'січ. 2026 – дотепер',
        summary: 'Розробляю Keycard Console — інтерфейс керування ідентифікацією та доступом для ШІ-агентів.',
        highlights: [
          'Зробив політику доступу зрозумілою кожному адміністраторові, не обмежуючи експертів: створив найкращий у своєму класі конструктор політик — багатий візуальний редактор і повнофункціональний редактор Cedar із можливостями рівня IDE, без шкоди для продуктивності.',
          'Домігся того, що всі інтерфейси, від Console до серверних сторінок входу та реєстрації, сприймаються як єдиний, незмінно гарний і приємний продукт, попри різні технології та вимоги до продуктивності: створив і підтримую бібліотеку дизайну, на якій усі вони побудовані.',
          'Зберіг високу швидкість усіх сторінок Console зі зростанням даних клієнтів, майже самотужки перевівши весь API керування на keyset-пагінацію.',
          'Допоміг вивести Keycard «від нуля до одиниці» завдяки самостійному онбордингу, який за один раз веде нового користувача від реєстрації до розгорнутого агента, захищеного Keycard; реалізував більшість сигналів прогресу у фронтенді, часто спершу розширюючи API, що за ними стоять.',
        ],
      },
      {
        company: 'Reddit',
        title: 'Старший інженер-програміст',
        dates: 'лист. 2023 – січ. 2026',
        summary: 'Підтримував фреймворк та інфраструктуру, на яких будується й працює вебверсія Reddit.',
        highlights: [
          'Переробив повільний і ресурсомісткий процес збирання так, щоб він масштабувався з додаванням нових мов: розширення i18n тривало без уповільнення релізів.',
          'Скоротив цикл зворотного зв’язку під час розробки до малої частки попереднього, зробивши локальну розробку альтернативою хмарному процесу.',
          'Налаштував процеси й ресурси CI, щоб скоротити загальний час виходу в продакшн.',
        ],
      },
      {
        company: 'Shopify → Flexport',
        title: 'Старший інженер-програміст',
        dates: 'черв. 2021 – лист. 2023',
        summary: 'Логістична розробка в Shopify Fulfillment Network (SFN); після продажу фулфілмент-бізнесу Shopify компанії Flexport продовжив роботу у Flexport.',
        highlights: [
          'Спроєктував і створив системи для оркестрації та відстеження переміщень запасів у мережі фулфілменту.',
          'Створив інструменти, за допомогою яких служба підтримки виправляє невідповідності в даних про переміщувані запаси, спричинені операційними помилками.',
          'Домігся ухвалення зручніших інструментів для роботи з базами даних як нового стандарту інженерної організації.',
          'Узгоджував позиції багатьох команд щодо проблем переміщень, які зачіпають кілька доменів, і керував командами, що розробляли це міждоменне ПЗ.',
        ],
      },
      {
        company: 'Gatsby',
        title: 'Провідний (staff) інженер-програміст',
        dates: 'трав. 2020 – черв. 2021',
        highlights: [
          'Розширив Gatsby Cloud, додавши збирання сайтів із репозиторіїв GitLab і Bitbucket.',
          'Створив інтеграцію з Shopify, що стабільно масштабується до 10 тис. товарів.',
          'Власним прикладом задавав планку якості, читабельності й супроводжуваності коду та стежив, щоб нові функції виходили з тестами й метриками.',
          'Підтримував темп релізів команди: знаходив і усував вузькі місця на шляху до продакшну та просував невеликі одиниці роботи з лімітами WIP.',
          'Допомагав зростати молодшим інженерам через регулярні зустрічі сам на сам і парне програмування.',
        ],
      },
      {
        company: 'Manifold',
        title: 'Провідний фронтенд-інженер',
        dates: 'квіт. 2018 – трав. 2020',
        highlights: [
          'Був одним з архітекторів і керував розробкою консолі керування — першого застосунку Manifold на мікрофронтендній архітектурі.',
          'Переконав організацію поступово перейти на TypeScript у фронтенді та підтримував колег під час переходу.',
          'Навчав команду тестування: підняв покриття Dashboard з 20% до 80% і створив повностековий набір тестів візуальної регресії для наших вебкомпонентів.',
          'Керував фронтенд-гільдією у виробленні спільних цінностей для підвищення якості ПЗ.',
        ],
      },
      {
        company: 'Ackmann & Dickenson',
        title: 'Інженер-програміст → старший → головний',
        dates: 'бер. 2012 – квіт. 2018',
        summary: 'Розробляв замовне ПЗ для клієнтів із найрізноманітніших галузей.',
        highlights: [
          'За допомогою PostgreSQL обчислював щоденну статистику за величезним масивом даних про винагороди медиків для SullivanCotter.',
          'Створив популярну й дуже швидку таблицю лідерів для MotivAction із власним SQL, що підтримував безліч метрик ранжування.',
          'Написав бібліотеки з відкритим кодом для керування списками та валідації форм, які повторно використовувалися в клієнтських застосунках.',
          'Запровадив стандарти й практики, що підтримували високу якість і одноманітність.',
        ],
      },
      {
        company: 'Thomson Reuters',
        title: 'Інженер-програміст',
        dates: 'черв. 2009 – бер. 2012',
        highlights: [
          'Створював інтерфейси поверх бекенд-сервісів для продуктів юридичних досліджень і керував координацією між командою сайту та новим сервісом DataRoom.',
          'Запровадив розробку через поведінку (BDD), написавши тести на SpecFlow.',
        ],
      },
    ],
  },
};
