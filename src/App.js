import React, { useState, useEffect, useRef } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';

const lightTheme = {
    background: '#ffffff',
    card: '#f9fafb',
    text: '#111827',
    accent: '#2563eb',
};

const darkTheme = {
    background: '#1f2d3d',
    card: '#2c3e50',
    text: '#e2e8f0',
    accent: '#4f9eea',
};

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-family: 'Pretendard', sans-serif;
        background-color: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.text};
        overflow: hidden;
        transition: all 0.4s ease;
    }
`;

const Wrapper = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
`;

const Section = styled(motion.section)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem 1.5rem;
    background-color: ${({ theme }) => theme.background};
`;

const Card = styled.div`
    background: ${({ theme }) => theme.card};
    border-radius: 1.25rem;
    padding: 2.5rem;
    max-width: 840px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    transition: box-shadow 0.4s ease, transform 0.3s ease;

    &:hover {
        box-shadow: 0 30px 90px rgba(0, 0, 0, 0.2);
        transform: translateY(-6px);
    }
`;

const ProjectGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
`;

// ✅ 최종 ProjectCard 최적화 적용: 끊김 최소화, GPU 가속, 부드러운 cubic-bezier 전환

const ProjectCard = styled.div`
    perspective: 1000px;
    width: 100%;
    height: 220px;
    position: relative;
    cursor: pointer;
    contain: strict;
    transform: translateZ(0);
    will-change: transform;

    .inner {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
    }

    &:hover .inner {
        transform: rotateY(180deg);
    }

    .front, .back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        transform-style: preserve-3d;
        border-radius: 0.75rem;
        box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: ${({ theme }) => theme.card};
        text-align: center;
        transform: translateZ(0);
    }

    .back {
        transform: rotateY(180deg) translateZ(0);
    }
`;

const Title = styled.h2`
    font-size: 2rem;
    color: ${({ theme }) => theme.accent};
    margin-bottom: 1.25rem;
`;

const Text = styled.p`
    font-size: 1rem;
    line-height: 1.8rem;
    margin-bottom: 1rem;
    white-space: pre-line;
`;

const NameHeader = styled.h1`
    font-size: 3.5rem;
    font-weight: 900;
    color: ${({ theme }) => theme.accent};
    margin-bottom: 1rem;
    text-align: center;
`;

const Subtext = styled.p`
    font-size: 1.25rem;
    text-align: center;
`;

const ToggleButton = styled.button`
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    background: ${({ theme }) => theme.accent};
    color: white;
    border: none;
    border-radius: 0.5rem;
    z-index: 100;
`;

const Nav = styled.nav`
    position: fixed;
    top: 1rem;
    left: 1rem;
    display: flex;
    gap: 1rem;
    z-index: 100;
`;

export default function Portfolio() {
    const [darkMode, setDarkMode] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const isAnimating = useRef(false);

    const [typedText, setTypedText] = useState('');
    const fullText = `“문제를 이해하고, 기술로 해결하는 사람”
기획부터 데이터, 디자인까지 넘나들며
사용자 중심의 실용적인 기술을 만드는 개발자입니다.`;

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setTypedText(fullText.slice(0, i + 1));
            i++;
            if (i === fullText.length) clearInterval(interval);
        }, 80);
        return () => clearInterval(interval);
    }, []);

    // ✅ 전체 코드 수정: ProjectCard에 flip 효과 및 내용 표시 적용을 위한 데이터와 JSX 수정

// ✅ projects 배열 수정: title/description/link 포함
    const projects = [
        {
            title: '환율 예측 딥러닝',
            description: 'LSTM + Attention 기반 예측 모델 설계, RMSE 23.2, 정확도 86%',
            link: 'https://drive.google.com/file/d/1Aqf8UsVSLJ9vHH878fJW_-ILTAYxifvf/view?usp=drive_link'
        },
        {
            title: '글로벌 테러 분석',
            description: 'XGBoost 기반 국가별 위험도 예측, 피해 규모 기준 분석 포함',
            link: 'https://drive.google.com/file/d/1SuRGublxR6hcuJbRKYWS1VGz_8-3-dWL/view?usp=drive_link'
        },
        {
            title: 'CO₂ 배출량 분석',
            description: '산업군/국가별 추세 시각화, Tableau + Pandas 분석',
            link: 'https://docs.google.com/presentation/d/1LhEUQofWhph5TJ8fBinRTcU-w02VTUI0/edit?usp=drive_link&ouid=109937379090600177991&rtpof=true&sd=true'
        },
        {
            title: '교회 앱 개발(2022~23)',
            description: 'React Native 기반 프론트엔드 개발',
            link: 'https://github.com/see-the-glory/on-you-frontend'
        },
        {
            title: '교회 앱 리뉴얼 (2025~)',
            description: 'React Native + Firebase, OPEN AI 연동, 모임 CRUD 등 고도화 진행 중',
            link: 'https://github.com/gyu-bin/ChurchProject'
        }
    ];

    const sections = [
        {
            id: 'intro',
            title: '문규빈',
            content: ''
                /*`“문제를 이해하고, 기술로 해결하는 사람”
기획부터 데이터, 디자인까지 넘나들며
사용자 중심의 실용적인 기술을 만드는 개발자입니다.`*/
        },
        {
            id: 'about',
            title: 'About Me',
            content: `저는 기술을 통해 실제 문제를 해결하는 데 집중하는 개발자입니다.
초기에는 React 기반의 프론트엔드 개발로 시작했지만, 단순한 화면 구현에 머무르지 않고 사용자 경험을 더 깊이 이해하고자 백엔드와 데이터 분석까지 확장해 왔습니다.

직접 기획하고 제작한 교회 앱은 Firebase 기반의 실시간 기능과 사용자 권한 시스템을 구현하며 실제 배포까지 경험했고,
멋쟁이사자처럼 데이터 분석 부트캠프에서는 팀 프로젝트를 통해 환율 예측, 테러 분석 등 실제 데이터를 기반으로 의미 있는 인사이트를 도출해내는 경험을 쌓았습니다.

기획-디자인-개발을 넘나드는 전방위 경험 덕분에 전체 흐름을 보는 눈이 생겼고,
혼자서 빠르게 실행할 수 있는 능력과 함께 팀 내에서는 책임감 있게 맡은 바를 끝까지 완수하는 자세로 일합니다.

코드를 짜는 것에 그치지 않고, 사용자에게 어떤 가치가 전달될 수 있을지 고민하며 기술을 실용적으로 쓰는 개발자가 되고자 합니다.`
        },
        {
            id: 'skills',
            title: 'Skills',
            content: `React – 모듈화 구조 및 컴포넌트 단위 UI 설계
TypeScript – 안정적 설계를 위한 타입 시스템 경험
React Native – Expo 기반 앱 개발 + Firebase 연동
Python – Pandas, Scikit-learn, TensorFlow 기반 데이터 분석
XGBoost – 분류 모델 실전 프로젝트 사용
Firebase – Firestore, Auth, Cloud Function 구성 실전 경험
협업툴 – Git, Notion, Slack, Figma`
        },
        {
            id: 'experience',
            title: 'Experience',
            content: `◼ GS SHOP (2024.01 ~ 2024.10)
- MiPlatform → React SPA 마이그레이션
- 공통 컴포넌트 리팩터링 및 화면 전환 최적화

◼ 그라비티 네오싸이언 (2022.02 ~ 2023.10)
- LG TingQ 앱 유지보수 및 고도화 개발
- React Native + Firebase 기반 구조 개선

◼ 그라비티 네오싸이언 (2021.10 ~ 2022.02)
- LG 스마트 식품관 관리자 페이지(Spring 기반)
- UI 개발 및 데이터 연동 API 설계

◼ 에딧홈 (2021.01 ~ 2021.05)
- 쇼핑몰 관리자 페이지 개발 및 유지보수 (React)

◼ 코아스시스템 (2020.07 ~ 2020.10)
- 관리자 페이지 유지보수 (Java, JSP)

◼ 미스솔루션 (2019.07 ~ 2020.06)
- 관리자 시스템 개발 및 유지보수 (Java, JSP)`
        },
        {
            id: 'projects',
            title: 'Projects',
            content: ''
        },
        {
            id: 'contact',
            title: 'Contact',
            content: `이메일: rbqls6651@naver.com
GitHub: https://github.com/gyu-bin
Church App: https://github.com/gyu-bin/ChurchProject`
        }
    ];

    const handleScroll = (e) => {
        if (isAnimating.current) return;
        if (e.deltaY > 20 && pageIndex < sections.length - 1) {
            isAnimating.current = true;
            setPageIndex(prev => prev + 1);
            setTimeout(() => (isAnimating.current = false), 800);
        } else if (e.deltaY < -20 && pageIndex > 0) {
            isAnimating.current = true;
            setPageIndex(prev => prev - 1);
            setTimeout(() => (isAnimating.current = false), 800);
        }
    };

    useEffect(() => {
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [pageIndex]);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <GlobalStyle />
            <ToggleButton onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </ToggleButton>
            <Nav>
                {sections.map((sec, i) => (
                    <a key={sec.id} onClick={() => setPageIndex(i)} style={{ cursor: 'pointer' }}>
                        {sec.title}
                    </a>
                ))}
            </Nav>
            <Wrapper>
                {sections.map((section, index) => (
                    <Section
                        key={section.id}
                        style={{ zIndex: index }}
                        initial={{ y: '100%' }}
                        animate={{ y: index <= pageIndex ? '0%' : '100%' }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                    >
                        {section.id === 'intro' ? (
                            <motion.div
                                style={{ textAlign: 'center', maxWidth: '800px', padding: '2rem' }}
                            >
                                <motion.h1
                                    style={{ fontSize: '3rem', fontWeight: 600, marginBottom: '1.5rem' }}
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    문규빈
                                </motion.h1>

                                <motion.h2
                                    style={{ fontSize: '1.75rem', fontWeight: 500, whiteSpace: 'pre-line', color: darkMode ? darkTheme.accent : lightTheme.accent }}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 1 }}
                                >
                                    {typedText}
                                </motion.h2>
                            </motion.div>
                        ) : section.id === 'projects' ? (
                            <Card>
                                <Title>{section.title}</Title>
                                <ProjectGrid>
                                    {projects.map((proj, idx) => (
                                        <ProjectCard key={idx}>
                                            <div className="inner">
                                                <div className="front">
                                                    <Text style={{ fontWeight: 'bold' }}>{proj.title}</Text>
                                                    <Text style={{ marginTop: '0.5rem' }}>{proj.description}</Text>
                                                </div>
                                                <div className="back">
                                                    <a
                                                        href={proj.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ marginTop: '0.5rem', color: '#4f9eea', fontWeight: 600 }}
                                                    >
                                                        🔗 보러가기
                                                    </a>
                                                </div>
                                            </div>
                                        </ProjectCard>
                                    ))}
                                </ProjectGrid>
                            </Card>
                        ) : (
                            <Card>
                                <Title>{section.title}</Title>
                                {section.content.split('\n').map((line, i) => (
                                    <Text key={i}>{line}</Text>
                                ))}
                            </Card>
                        )}
                    </Section>
                ))}
            </Wrapper>
        </ThemeProvider>
    );
}
