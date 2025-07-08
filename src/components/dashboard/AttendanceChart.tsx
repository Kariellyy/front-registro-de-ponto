"use client";

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
  const maxValue = Math.max(...attendanceData.map((d) => d.present + d.absent));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Presença Semanal
      </h3>

      <div className="space-y-4">
        {attendanceData.map((data) => {
          const total = data.present + data.absent;
          const presentPercentage =
            total > 0 ? (data.present / total) * 100 : 0;

          return (
            <div key={data.day} className="flex items-center gap-4">
              <div className="w-8 text-sm font-medium text-gray-600">
                {data.day}
              </div>
              <div className="flex-1">
                <div className="flex h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 transition-all duration-300"
                    style={{ width: `${presentPercentage}%` }}
                  />
                  <div
                    className="bg-red-400 transition-all duration-300"
                    style={{ width: `${100 - presentPercentage}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600 w-16 text-right">
                {data.present}/{total}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-600">Presentes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full" />
          <span className="text-sm text-gray-600">Ausentes</span>
        </div>
      </div>
    </div>
  );
}
