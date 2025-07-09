"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AttendanceData {
  day: string;
  present: number;
  absent: number;
}

const attendanceData: AttendanceData[] = [
  { day: "Seg", present: 45, absent: 5 },
  { day: "Ter", present: 48, absent: 2 },
  { day: "Qua", present: 46, absent: 4 },
  { day: "Qui", present: 49, absent: 1 },
  { day: "Sex", present: 47, absent: 3 },
  { day: "Sáb", present: 25, absent: 25 },
  { day: "Dom", present: 0, absent: 50 },
];

export default function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presença Semanal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {attendanceData.map((data) => {
            const total = data.present + data.absent;
            const presentPercentage =
              total > 0 ? (data.present / total) * 100 : 0;

            return (
              <div key={data.day} className="flex items-center gap-4">
                <div className="w-8 text-sm font-medium text-muted-foreground">
                  {data.day}
                </div>
                <div className="flex-1 space-y-1">
                  <Progress value={presentPercentage} className="h-6" />
                </div>
                <div className="text-sm text-muted-foreground w-16 text-right">
                  {data.present}/{total}
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-muted-foreground">Presentes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded-full" />
            <span className="text-sm text-muted-foreground">Ausentes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
