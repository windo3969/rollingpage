// 검색엔진 노출 정책 (CLAUDE.md 3장).
// 기본값은 전부 차단. 마케팅용 공개 페이지만 PUBLIC_PATHS에 추가해 예외로 허용한다.
// 새 공개 페이지를 추가할 때는 page 파일의 metadata에 indexableRobots도 함께 지정해야 한다.

export const PUBLIC_PATHS = ["/"] as const;

export const noIndexRobots = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export const indexableRobots = {
  index: true,
  follow: true,
};

export const X_ROBOTS_TAG = "noindex, nofollow";
