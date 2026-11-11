import { useEffect, useState } from "react";

const fmt = (n) => n.toLocaleString("ko-KR");
const pct = (c) => `${c > 0 ? "+" : ""}${(c * 100).toFixed(2)}%`;
const color = (c) => (c > 0 ? "#d60000" : c < 0 ? "#0051c7" : "#333");

function PriceChart({ data }) {
  const W = 800;
  const H = 240;
  const P = 30;
  const closes = data.map((d) => d.Close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const x = (i) => P + (i * (W - P * 2)) / Math.max(data.length - 1, 1);
  const y = (v) => H - P - ((v - min) * (H - P * 2)) / (max - min || 1);
  const points = data.map((d, i) => `${x(i)},${y(d.Close)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: W }}>
      <polyline points={points} fill="none" stroke="#1428a0" strokeWidth="2" />
      {data.map((d, i) => (
        <circle key={d.Date} cx={x(i)} cy={y(d.Close)} r="3" fill="#1428a0">
          <title>{`${d.Date}  ${fmt(d.Close)}원`}</title>
        </circle>
      ))}
      <text x={P} y={y(max) - 8} fontSize="12" fill="#666">
        최고 {fmt(max)}
      </text>
      <text x={P} y={y(min) + 18} fontSize="12" fill="#666">
        최저 {fmt(min)}
      </text>
    </svg>
  );
}

function App() {
  const [stock, setStock] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/samsung")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setStock)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>데이터를 불러오지 못했습니다: {error}</p>;
  if (!stock) return <p>불러오는 중...</p>;

  const { code, name, data } = stock;
  const last = data[data.length - 1];

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>
        {name} <small style={{ color: "#888" }}>({code})</small>
      </h1>
      <p style={{ fontSize: 24 }}>
        <b>{fmt(last.Close)}원</b>{" "}
        <span style={{ color: color(last.Change) }}>{pct(last.Change)}</span>
        <span style={{ fontSize: 14, color: "#888" }}> · {last.Date} 기준</span>
      </p>

      <PriceChart data={data} />

      <table style={{ borderCollapse: "collapse", marginTop: 16, textAlign: "right" }}>
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            {["날짜", "시가", "고가", "저가", "종가", "등락률", "거래량"].map((h) => (
              <th key={h} style={{ padding: "6px 12px" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...data].reverse().map((d) => (
            <tr key={d.Date} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "6px 12px" }}>{d.Date}</td>
              <td style={{ padding: "6px 12px" }}>{fmt(d.Open)}</td>
              <td style={{ padding: "6px 12px" }}>{fmt(d.High)}</td>
              <td style={{ padding: "6px 12px" }}>{fmt(d.Low)}</td>
              <td style={{ padding: "6px 12px" }}><b>{fmt(d.Close)}</b></td>
              <td style={{ padding: "6px 12px", color: color(d.Change) }}>{pct(d.Change)}</td>
              <td style={{ padding: "6px 12px" }}>{fmt(d.Volume)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
