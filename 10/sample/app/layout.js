import "./globals.css";

export const metadata = {
  title: "내 서비스",
  description: "정보와 디지털 문해력 10~13회 프로젝트",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
