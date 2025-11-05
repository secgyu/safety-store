import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ChartDataPoint {
  date: string;
  risk: number;
}

interface RiskTrendChartProps {
  data: ChartDataPoint[];
}

export function RiskTrendChart({ data }: RiskTrendChartProps) {
  if (data.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            위험도 추세
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>아직 충분한 데이터가 없습니다.</p>
            <p className="text-sm mt-2">정기적으로 진단을 받으면 추세를 확인할 수 있습니다.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          위험도 추세
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value}점`, "위험도"]}
            />
            <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="3 3" label="평균" />
            <Line
              type="monotone"
              dataKey="risk"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5, fill: "#3b82f6" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>팁:</strong> 위험도가 지속적으로 증가하고 있다면 즉시 개선 계획을 수립하세요.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

