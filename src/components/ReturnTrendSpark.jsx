import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const WINDOWS = ['1M', '3M', '6M', 'YTD', '1Y'];

export default function ReturnTrendSpark({ returns, height = 36 }) {
  if (!returns) return <div className="spark-empty status-line">—</div>;

  const data = WINDOWS.filter((w) => returns[w] != null).map((w) => ({ window: w, value: returns[w] }));
  if (data.length < 2) return <div className="spark-empty status-line">—</div>;

  const last = data[data.length - 1].value;
  const stroke = last >= 0 ? 'var(--up)' : 'var(--down)';

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
          <YAxis hide domain={['auto', 'auto']} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
