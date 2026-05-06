"use client";

import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f6f7f9",
        color: "#171717",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "520px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          background: "#ffffff",
          padding: "28px",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        }}
      >
        <h1
          style={{
            margin: "0 0 16px",
            fontSize: "28px",
            lineHeight: 1.25,
          }}
        >
          定位信息已记录
        </h1>
        <p
          style={{
            margin: "0 0 24px",
            color: "#4b5563",
            fontSize: "16px",
            lineHeight: 1.7,
          }}
        >
          感谢授权，您的位置信息已经成功提交。
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          style={{
            width: "100%",
            border: "0",
            borderRadius: "6px",
            background: "#111827",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
            padding: "12px 16px",
          }}
        >
          返回首页
        </button>
      </section>
    </main>
  );
}
