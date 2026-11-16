import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import styles from "./SalesChart.module.css";

const formatarReais = (valor) =>
  Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function SalesChart({ dados, categorias, cores }) {
  return (
    <div className={styles.container} data-cy="grafico-vendas">
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={dados}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
          />
          <XAxis
            dataKey="periodo"
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }}
          />
          <YAxis
            width={110}
            tickFormatter={formatarReais}
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 12 }}
          />
          <Tooltip
            formatter={(valor) => formatarReais(valor)}
            contentStyle={{
              background: "#2b2b2b",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#ffffff",
            }}
          />
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ color: "#ffffff", fontSize: 13 }}
          />
          {categorias.map((c) => (
            <Line
              key={c.id}
              type="monotone"
              dataKey={c.nome}
              stroke={cores[c.id]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesChart;
