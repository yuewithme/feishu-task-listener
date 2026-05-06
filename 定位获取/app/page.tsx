"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type LocationStatus =
  | "requesting"
  | "submitting"
  | "failed"
  | "denied"
  | "unsupported"
  | "timeout";

const statusMessages: Record<LocationStatus, string> = {
  requesting: "正在请求定位，请在浏览器弹窗中允许位置访问。",
  submitting: "定位成功，正在提交。",
  failed: "定位失败，请稍后重新获取位置。",
  denied: "用户拒绝定位。请在浏览器设置中允许位置访问后重试。",
  unsupported: "当前浏览器不支持定位功能。",
  timeout: "定位超时，请确认网络和定位权限后重试。",
};

function optionalNumber(value: number | null): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getErrorStatus(error: GeolocationPositionError): LocationStatus {
  if (error.code === error.PERMISSION_DENIED) {
    return "denied";
  }

  if (error.code === error.TIMEOUT) {
    return "timeout";
  }

  return "failed";
}

export default function HomePage() {
  const router = useRouter();
  const hasRequestedOnLoad = useRef(false);
  const [status, setStatus] = useState<LocationStatus>("requesting");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    setErrorMessage(null);

    if (!navigator.geolocation) {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setStatus("submitting");

        try {
          const response = await fetch("/api/location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: optionalNumber(position.coords.altitude),
              speed: optionalNumber(position.coords.speed),
              heading: optionalNumber(position.coords.heading),
            }),
          });

          if (!response.ok) {
            setStatus("failed");
            setErrorMessage("位置提交失败，请重新获取位置。");
            return;
          }

          router.push("/success");
        } catch (error) {
          console.error("Failed to submit location", error);
          setStatus("failed");
          setErrorMessage("位置提交失败，请检查网络后重试。");
        }
      },
      (error) => {
        setStatus(getErrorStatus(error));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, [router]);

  useEffect(() => {
    if (hasRequestedOnLoad.current) {
      return;
    }

    hasRequestedOnLoad.current = true;
    requestLocation();
  }, [requestLocation]);

  const canRetry =
    status === "failed" ||
    status === "denied" ||
    status === "unsupported" ||
    status === "timeout";

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
          maxWidth: "560px",
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
          位置授权确认
        </h1>
        <p
          style={{
            margin: "0 0 24px",
            color: "#4b5563",
            fontSize: "16px",
            lineHeight: 1.7,
          }}
        >
          本页面将请求获取您的地理位置，仅用于记录当前访问位置。授权后会上传经纬度、定位精度和访问时间。
        </p>
        <p
          aria-live="polite"
          style={{
            margin: "0",
            color: canRetry ? "#b42318" : "#1f2937",
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          {errorMessage ?? statusMessages[status]}
        </p>
        {canRetry ? (
          <button
            type="button"
            onClick={requestLocation}
            style={{
              marginTop: "20px",
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
            重新获取位置
          </button>
        ) : null}
      </section>
    </main>
  );
}
