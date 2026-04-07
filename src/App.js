import React, { useState, useEffect, useCallback } from 'react';
import styled, { ThemeProvider, createGlobalStyle, css } from 'styled-components';
import { motion } from 'framer-motion';

const lightTheme = {
    bg: '#eceff1',
    card: '#ffffff',
    text: '#202124',
    textMuted: '#5f6368',
    border: '#dadce0',
    accent: '#1a73e8',
    accentHover: '#1557b0',
    navActive: '#e8f0fe',
    chipBg: '#f1f3f4',
    shadow: '0 1px 2px rgba(60, 64, 67, 0.28), 0 0 1px rgba(60, 64, 67, 0.12)',
    shadowHover: '0 2px 8px rgba(60, 64, 67, 0.22), 0 0 1px rgba(60, 64, 67, 0.1)',
    radius: '18px',
    radiusSm: '12px',
    radiusPill: '100px',
};

const darkTheme = {
    bg: '#0f1113',
    card: '#1a1d21',
    text: '#e8eaed',
    textMuted: '#9aa0a6',
    border: '#3c4043',
    accent: '#8ab4f8',
    accentHover: '#aecbfa',
    navActive: 'rgba(138, 180, 248, 0.14)',
    chipBg: '#2d3136',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.45)',
    shadowHover: '0 4px 12px rgba(0, 0, 0, 0.35)',
    radius: '18px',
    radiusSm: '12px',
    radiusPill: '100px',
};

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    html,
    body,
    #root {
        height: 100%;
        margin: 0;
    }
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-feature-settings: 'kern' 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: ${({ theme }) => theme.bg};
        color: ${({ theme }) => theme.text};
        transition: background-color 0.35s ease, color 0.25s ease;
    }
    @media (min-width: 961px) {
        html,
        body {
            overflow: hidden;
        }
    }
`;

const ViewportShell = styled.div`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    max-height: 100%;
    display: grid;
    gap: 0.75rem;
    padding: 0.85rem;
    padding-right: 5.75rem;
    background: ${({ theme }) => theme.bg};

    grid-template-columns: 11rem minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: minmax(0, 0.95fr) minmax(0, 1.05fr) minmax(0, 1.15fr) minmax(0, 0.95fr);
    grid-template-areas:
        'rail intro intro'
        'rail about skills'
        'rail exp exp'
        'rail projects contact';

    @media (max-width: 960px) {
        grid-template-columns: 1fr;
        grid-template-rows: none;
        grid-template-areas:
            'rail'
            'intro'
            'about'
            'skills'
            'exp'
            'projects'
            'contact';
        height: auto;
        min-height: 100%;
        max-height: none;
        padding-right: 0.85rem;
        padding-bottom: 4.5rem;
        gap: 0.65rem;
    }
`;

const Rail = styled.aside`
    grid-area: rail;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-height: 0;
    padding: 0.65rem 0.5rem;
    border-radius: ${({ theme }) => theme.radius};
    background: ${({ theme }) => theme.card};
    box-shadow: ${({ theme }) => theme.shadow};
    border: 1px solid ${({ theme }) => theme.border};
    overflow-y: auto;

    @media (max-width: 960px) {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding: 0.5rem 0.45rem;
    }
`;

const RailHeading = styled.div`
    font-size: 0.625rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.textMuted};
    padding: 0.35rem 0.65rem 0.5rem;

    @media (max-width: 960px) {
        width: 100%;
        flex-basis: 100%;
        padding-bottom: 0.25rem;
    }
`;

const NavBtn = styled.button`
    display: flex;
    align-items: center;
    gap: 0;
    width: 100%;
    padding: 0.5rem 0.7rem;
    border: none;
    border-radius: ${({ theme }) => theme.radiusSm};
    cursor: pointer;
    font-size: 0.8125rem;
    font-family: inherit;
    text-align: left;
    letter-spacing: -0.01em;
    color: ${({ $active, theme }) => ($active ? theme.accent : theme.text)};
    background: ${({ $active, theme }) => ($active ? theme.navActive : 'transparent')};
    font-weight: ${({ $active }) => ($active ? 600 : 500)};
    transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease;

    &:hover {
        background: ${({ $active, theme }) => ($active ? theme.navActive : theme.chipBg)};
        color: ${({ theme }) => theme.accent};
    }

    @media (max-width: 960px) {
        width: auto;
        flex: 0 0 auto;
        white-space: nowrap;
    }
`;

const panelFocusCss = css`
    ${({ $focused, theme }) =>
        $focused &&
        css`
            box-shadow: ${theme.shadow}, 0 0 0 2px ${theme.accent}33;
        `}
`;

const Panel = styled.section`
    grid-area: ${({ $area }) => $area};
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 0.85rem 1rem;
    border-radius: ${({ theme }) => theme.radius};
    background: ${({ theme }) => theme.card};
    border: 1px solid ${({ theme }) => theme.border};
    box-shadow: ${({ theme }) => theme.shadow};
    overflow: hidden;
    transition: box-shadow 0.22s ease, border-color 0.22s ease;
    ${panelFocusCss}

    &:hover {
        border-color: ${({ theme }) => theme.border};
    }
`;

const PanelScroll = styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    padding-right: 0.35rem;
    margin-right: -0.15rem;

    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.border};
        border-radius: 100px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
`;

const PanelTitle = styled.h2`
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.textMuted};
    margin: 0 0 0.55rem;
    flex-shrink: 0;
`;

const BodyText = styled.p`
    font-size: 0.8125rem;
    line-height: 1.65;
    margin: 0 0 0.55rem;
    white-space: pre-line;
    color: ${({ theme }) => theme.text};
    letter-spacing: -0.011em;

    &:last-child {
        margin-bottom: 0;
    }
`;

const IntroPanel = styled(Panel)`
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 1rem 1.25rem;
    background: ${({ theme }) => theme.card};
`;

const IntroName = styled(motion.h1)`
    font-size: clamp(1.5rem, 2.9vw, 2.125rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    margin: 0 0 0.5rem;
    color: ${({ theme }) => theme.text};
`;

const IntroTagline = styled(motion.p)`
    font-size: clamp(0.78rem, 1.4vw, 0.9375rem);
    font-weight: 400;
    white-space: pre-line;
    color: ${({ theme }) => theme.textMuted};
    margin: 0;
    line-height: 1.65;
    max-width: 34rem;
    letter-spacing: -0.02em;
`;

const SkillList = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
`;

const SkillItem = styled.li`
    font-size: 0.8125rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.text};
    padding: 0.4rem 0.65rem;
    border-radius: ${({ theme }) => theme.radiusSm};
    background: ${({ theme }) => theme.chipBg};
    letter-spacing: -0.015em;
`;

const ProjectMiniGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

const ProjectMini = styled.a`
    display: block;
    padding: 0.65rem 0.75rem;
    border-radius: ${({ theme }) => theme.radiusSm};
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.bg};
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
        border-color: ${({ theme }) => theme.accent};
        box-shadow: ${({ theme }) => theme.shadowHover};
        transform: translateY(-2px);
    }
`;

const ProjectMiniTitle = styled.div`
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.text};
    margin-bottom: 0.3rem;
    line-height: 1.35;
`;

const ProjectMiniDesc = styled.div`
    font-size: 0.75rem;
    line-height: 1.45;
    color: ${({ theme }) => theme.textMuted};
    letter-spacing: -0.01em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const ContactLine = styled.p`
    font-size: 0.8125rem;
    line-height: 1.65;
    margin: 0 0 0.55rem;
    word-break: break-all;
    letter-spacing: -0.015em;
    color: ${({ theme }) => theme.text};

    a {
        color: ${({ theme }) => theme.accent};
        text-decoration: none;
        font-weight: 500;
    }
    a:hover {
        text-decoration: underline;
        color: ${({ theme }) => theme.accentHover};
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const TopBar = styled.div`
    position: fixed;
    top: 0.85rem;
    right: 0.85rem;
    z-index: 200;
`;

const ToggleButton = styled.button`
    padding: 0.5rem 1rem;
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.card};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: ${({ theme }) => theme.radiusPill};
    cursor: pointer;
    box-shadow: ${({ theme }) => theme.shadow};
    transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;

    &:hover {
        background: ${({ theme }) => theme.chipBg};
        box-shadow: ${({ theme }) => theme.shadowHover};
    }
`;

const INTRO_FULL_TEXT = `“문제를 이해하고, 기술로 해결하는 사람”
기획부터 데이터, 디자인까지 넘나들며
사용자 중심의 실용적인 기술을 만드는 개발자입니다.`;

const SECTION_ORDER = [
    { id: 'intro', short: '소개' },
    { id: 'about', short: 'About' },
    { id: 'skills', short: 'Skills' },
    { id: 'experience', short: '경력' },
    { id: 'projects', short: '프로젝트' },
    { id: 'contact', short: '연락' },
];

export default function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [focusedId, setFocusedId] = useState('intro');
    const [typedText, setTypedText] = useState('');

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setTypedText(INTRO_FULL_TEXT.slice(0, i + 1));
            i++;
            if (i === INTRO_FULL_TEXT.length) clearInterval(interval);
        }, 55);
        return () => clearInterval(interval);
    }, []);

    const projects = [
        {
            title: '환율 예측 딥러닝',
            description: 'LSTM + Attention, RMSE 23.2',
            link: 'https://drive.google.com/file/d/1Aqf8UsVSLJ9vHH878fJW_-ILTAYxifvf/view?usp=drive_link',
        },
        {
            title: '글로벌 테러 분석',
            description: 'XGBoost 위험도 예측',
            link: 'https://drive.google.com/file/d/1SuRGublxR6hcuJbRKYWS1VGz_8-3-dWL/view?usp=drive_link',
        },
        {
            title: 'CO₂ 배출량 분석',
            description: 'Tableau + Pandas',
            link: 'https://docs.google.com/presentation/d/1LhEUQofWhph5TJ8fBinRTcU-w02VTUI0/edit?usp=drive_link&ouid=109937379090600177991&rtpof=true&sd=true',
        },
        {
            title: '교회 앱 (2022~23)',
            description: 'React Native',
            link: 'https://github.com/see-the-glory/on-you-frontend',
        },
        {
            title: '교회 앱 리뉴얼',
            description: 'RN + Firebase + AI',
            link: 'https://github.com/gyu-bin/ChurchProject',
        },
    ];

    const aboutContent = `저는 기술을 통해 실제 문제를 해결하는 데 집중하는 개발자입니다.
초기에는 React 기반의 프론트엔드 개발로 시작했지만, 단순한 화면 구현에 머무르지 않고 사용자 경험을 더 깊이 이해하고자 백엔드와 데이터 분석까지 확장해 왔습니다.

직접 기획하고 제작한 교회 앱은 Firebase 기반의 실시간 기능과 사용자 권한 시스템을 구현하며 실제 배포까지 경험했고,
멋쟁이사자처럼 데이터 분석 부트캠프에서는 팀 프로젝트를 통해 환율 예측, 테러 분석 등 실제 데이터를 기반으로 의미 있는 인사이트를 도출해내는 경험을 쌓았습니다.

기획-디자인-개발을 넘나드는 전방위 경험 덕분에 전체 흐름을 보는 눈이 생겼고,
혼자서 빠르게 실행할 수 있는 능력과 함께 팀 내에서는 책임감 있게 맡은 바를 끝까지 완수하는 자세로 일합니다.

코드를 짜는 것에 그치지 않고, 사용자에게 어떤 가치가 전달될 수 있을지 고민하며 기술을 실용적으로 쓰는 개발자가 되고자 합니다.`;

    const skillsLines = [
        'React – UI 설계, 상태 관리, 성능 최적화',
        'TypeScript – 타입 안정성',
        'React Native – Expo 배포',
        'Next.js / SPA – 마이그레이션·라우팅',
        '상태 관리 – Context, Custom Hooks',
        'UI – xyflow, realGrid',
        'Firebase – Firestore, Auth, Functions',
        '협업 – Git, Notion, Slack, Figma',
    ];

    const experienceContent = `◼ 디딤365 (2025.07 ~ 2026.02)
- 신한은행 생성형 AI 플랫폼 에이전트 빌더 페이지 프론트엔드 개발
- React + TypeScript 기반 드래그 앤 드롭 UI 구현 (xyflow 활용)
- 복잡한 워크플로우 편집기 개발 및 상태 관리 최적화

◼ GSSHOP (2024.01 ~ 2024.10)
- MiPlatform 레거시 코드를 React SPA로 마이그레이션
- 공통 컴포넌트 설계 및 재사용 가능한 구조로 리팩터링
- realGrid를 활용한 대용량 데이터 그리드 최적화
- React 기반 화면 전환 및 라우팅 구조 개선

◼ 그라비티네오싸이언 (2022.02 ~ 2023.10)
- LG ThinQ 앱 개발 및 유지보수
- React + TypeScript 기반 프로젝트 구조 설계 및 컴포넌트 개발
- 제품 사용방법 및 사용후기 페이지 개발
- 성능 최적화 및 사용자 경험 개선

◼ 그라비티네오싸이언 (2021.10 ~ 2022.02)
- LG 스마트 식품관 관리자 페이지 개발
- JavaScript, Spring, JSP 기반 프론트엔드 개발
- 관리자 페이지 UI 개발 및 백엔드 API 연동

◼ 에딧홈 (2021.01 ~ 2021.05)
- 쇼핑몰 홈페이지 React 기반 개발
- 컴포넌트 기반 UI 구조 설계 및 구현

◼ 코아스시스템 (2020.07 ~ 2020.10)
- 관리자 페이지 유지보수 (주)에이치스틸

◼ 미스솔루션 (2019.09 ~ 2020.06)
- 시스템 개발 및 유지보수 (주)한국특강`;

    const focusPanel = useCallback((id) => {
        setFocusedId(id);
        requestAnimationFrame(() => {
            const panel = document.querySelector(`[data-panel="${id}"]`);
            const scrollEl = panel?.querySelector('[data-scroll-target]');
            if (scrollEl) scrollEl.scrollTop = 0;
        });
    }, []);

    const theme = darkMode ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <TopBar>
                <ToggleButton type="button" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? '라이트 모드' : '다크 모드'}
                </ToggleButton>
            </TopBar>
            <ViewportShell>
                <Rail aria-label="섹션 이동">
                    <RailHeading>목차</RailHeading>
                    {SECTION_ORDER.map(({ id, short }) => (
                        <NavBtn
                            key={id}
                            type="button"
                            $active={focusedId === id}
                            onClick={() => focusPanel(id)}
                        >
                            {short}
                        </NavBtn>
                    ))}
                </Rail>

                <IntroPanel $area="intro" data-panel="intro" $focused={focusedId === 'intro'}>
                    <IntroName
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                    >
                        문규빈
                    </IntroName>
                    <IntroTagline
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                    >
                        {typedText}
                    </IntroTagline>
                </IntroPanel>

                <Panel $area="about" data-panel="about" $focused={focusedId === 'about'}>
                    <PanelTitle>About Me</PanelTitle>
                    <PanelScroll data-scroll-target>
                        {aboutContent.split('\n').map((line, i) => (
                            <BodyText key={`ab-${i}`}>{line}</BodyText>
                        ))}
                    </PanelScroll>
                </Panel>

                <Panel $area="skills" data-panel="skills" $focused={focusedId === 'skills'}>
                    <PanelTitle>Skills</PanelTitle>
                    <PanelScroll data-scroll-target>
                        <SkillList>
                            {skillsLines.map((s) => (
                                <SkillItem key={s}>{s}</SkillItem>
                            ))}
                        </SkillList>
                    </PanelScroll>
                </Panel>

                <Panel $area="exp" data-panel="experience" $focused={focusedId === 'experience'}>
                    <PanelTitle>Experience</PanelTitle>
                    <PanelScroll data-scroll-target>
                        {experienceContent.split('\n').map((line, i) => (
                            <BodyText key={`ex-${i}`}>{line}</BodyText>
                        ))}
                    </PanelScroll>
                </Panel>

                <Panel $area="projects" data-panel="projects" $focused={focusedId === 'projects'}>
                    <PanelTitle>Projects</PanelTitle>
                    <PanelScroll data-scroll-target>
                        <ProjectMiniGrid>
                            {projects.map((p) => (
                                <ProjectMini key={p.title} href={p.link} target="_blank" rel="noopener noreferrer">
                                    <ProjectMiniTitle>{p.title}</ProjectMiniTitle>
                                    <ProjectMiniDesc>{p.description}</ProjectMiniDesc>
                                </ProjectMini>
                            ))}
                        </ProjectMiniGrid>
                    </PanelScroll>
                </Panel>

                <Panel $area="contact" data-panel="contact" $focused={focusedId === 'contact'}>
                    <PanelTitle>Contact</PanelTitle>
                    <PanelScroll data-scroll-target>
                        <ContactLine>
                            이메일:{' '}
                            <a href="mailto:rbqls6651@naver.com">rbqls6651@naver.com</a>
                        </ContactLine>
                        <ContactLine>
                            GitHub:{' '}
                            <a href="https://github.com/gyu-bin" target="_blank" rel="noopener noreferrer">
                                github.com/gyu-bin
                            </a>
                        </ContactLine>
                        <ContactLine>
                            Church App:{' '}
                            <a href="https://github.com/gyu-bin/ChurchProject" target="_blank" rel="noopener noreferrer">
                                ChurchProject
                            </a>
                        </ContactLine>
                    </PanelScroll>
                </Panel>
            </ViewportShell>
        </ThemeProvider>
    );
}
