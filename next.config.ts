import type { NextConfig } from "next";
import { X_ROBOTS_TAG } from "./src/lib/seo";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // 랜딩("/")을 제외한 모든 응답(페이지, API, 정적 파일)에 적용.
        // "/:path+"는 경로 세그먼트가 1개 이상일 때만 매칭되므로 "/"는 제외된다.
        source: "/:path+",
        headers: [{ key: "X-Robots-Tag", value: X_ROBOTS_TAG }],
      },
    ];
  },
};

export default nextConfig;
