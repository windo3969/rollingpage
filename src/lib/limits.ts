// 메시지 작성 제한. 클라이언트(입력창)와 서버(검증)가 같은 값을 쓴다.
// DB 제약은 content 2000자로 더 넉넉하다 — 결과 페이지 레이아웃에 맞춰 여기서 조정한다.
export const MESSAGE_MAX_LENGTH = 500;
export const AUTHOR_MAX_LENGTH = 30;

// 브라우저에서 압축한 뒤의 사진 크기 상한 (버킷 file_size_limit와 동일)
export const PHOTO_MAX_BYTES = 2 * 1024 * 1024;
