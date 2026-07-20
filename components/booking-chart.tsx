"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A bar chart with a label"

type BookingChartDatum = {
  month: string
  bookings: number
}

type BookingDataChartProps = {
  data?: Record<string, number> | BookingChartDatum[]
}

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function normalizeChartData(data?: BookingDataChartProps["data"]): BookingChartDatum[] {
  if (!data) {
    return []
  }

  if (Array.isArray(data)) {
    return data.map((item) => ({
      month: item.month,
      bookings: Number(item.bookings ?? 0),
    }))
  }

  return Object.entries(data).map(([month, bookings]) => ({
    month,
    bookings: Number(bookings ?? 0),
  }))
}

export function BookingDataChart({ data }: BookingDataChartProps) {
  const chartData = normalizeChartData(data)
  const totalBookings = chartData.reduce((sum, item) => sum + item.bookings, 0)
  const lastValue = chartData.at(-1)?.bookings ?? 0
  const previousValue = chartData.at(-2)?.bookings ?? 0
  const percentageChange = previousValue === 0
    ? lastValue > 0
      ? 100
      : 0
    : ((lastValue - previousValue) / previousValue) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Chart</CardTitle>
        <CardDescription>
          {chartData.length > 0 ? "Booking count by month" : "No booking data available"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="bookings" fill="var(--color-bookings)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {percentageChange >= 0 ? "Trending up" : "Trending down"} by {Math.abs(percentageChange).toFixed(1)}% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing booking totals for the selected months
        </div>
      </CardFooter>
    </Card>
  )
}
