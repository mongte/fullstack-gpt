# Fullstack GPT

LangChain을 학습하기 위한 프로젝트입니다.

## 설치 방법

1. 저장소를 클론합니다:
```bash
git clone https://github.com/mongte/fullstack-gpt.git
cd fullstack-gpt
```

2. 의존성을 설치합니다:
```bash
npm install
```

3. 환경 변수를 설정합니다:
- `.env.example` 파일을 `.env`로 복사합니다
- OpenAI API 키를 `.env` 파일에 설정합니다

4. 개발 서버를 실행합니다:
```bash
npm run dev
```

## 프로젝트 구조

- `src/`: 소스 코드
  - `index.ts`: 메인 엔트리 포인트
- `dist/`: 컴파일된 JavaScript 파일