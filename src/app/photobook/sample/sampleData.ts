// 포토북 샘플용 가상 데이터. 사진은 public/photobook-sample/ 의 일러스트(직접 그린 SVG)다.
// 실제 사진으로 바꾸려면 같은 폴더에 파일을 넣고 아래 경로만 바꾸면 된다.
const P = "/photobook-sample";

// npm run make:sample-pdf 로 이 페이지를 인쇄해 만든 파일
export const SAMPLE_PDF_PATH = `${P}/rollingpaper-photobook-sample.pdf`;

export const SAMPLE = {
  recipient: "지민",
  cover: {
    photo: `${P}/sunset.svg`,
    line: "지금처럼, 늘 너의\n행복이 가득하길",
    from: "From. 소중한 친구들",
  },
  closing: "너의 모든 날이\n행복하길 바라 :)",
  closingBackground: `${P}/clouds.svg`,
};

export type SamplePage =
  | { layout: "photoTop"; author: string; text: string; photo: string }
  | { layout: "textTop"; author: string; text: string; photo: string }
  | { layout: "collage"; author: string; text: string; photos: [string, string] }
  | { layout: "textOnly"; author: string; text: string }
  | { layout: "twoNotes"; notes: [{ author: string; text: string }, { author: string; text: string }] };

export const SAMPLE_PAGES: SamplePage[] = [
  {
    layout: "photoTop",
    author: "수연",
    photo: `${P}/sunset.svg`,
    text: "지민아! 생일 축하해!\n늘 행복하자 :)\n\n언제나 네 곁에\n좋은 사람들이 있길!",
  },
  {
    layout: "collage",
    author: "민지",
    photos: [`${P}/flowers.svg`, `${P}/city.svg`],
    text: "너와 함께한\n모든 순간이\n행복이야",
  },
  {
    layout: "textTop",
    author: "준호",
    photo: `${P}/cake.svg`,
    text: "생일 축하해!\n맛있는 거 많이 먹고\n행복한 하루 보내자",
  },
  {
    layout: "textOnly",
    author: "하은",
    text:
      "지민아, 올해도 네 생일을 같이 축하할 수 있어서 정말 기뻐.\n\n처음 만났던 날 기억나? 그때는 이렇게 오래 친구가 될 줄 몰랐는데, 어느새 서로의 가장 가까운 사람이 됐네.\n\n힘들 때마다 옆에 있어줘서 고마워. 이번 해에는 네가 하고 싶은 일들 전부 이뤄지길!",
  },
  {
    layout: "photoTop",
    author: "지훈",
    photo: `${P}/city.svg`,
    text: "항상 밝고\n너무 좋은 친구야!\n생일 진심으로 축하해",
  },
  {
    layout: "twoNotes",
    notes: [
      { author: "서연", text: "요즘 자주 못 봤지만\n늘 생각하고 있어.\n다음 달에 꼭 보자!" },
      { author: "도윤", text: "HBD!\n올해도 잘 부탁해 :)" },
    ],
  },
];
