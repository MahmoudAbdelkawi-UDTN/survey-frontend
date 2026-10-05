import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileStack,
  Hourglass,
  HelpCircle,
  Inbox,
  LayoutGrid,
  PenLine,
  Send,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react"
import { usePageHeader } from "@/components/layout/usePageHeader"
import { formatScore } from "@/lib/format"
import { categoricalColors, statusColors } from "@/lib/chartColors"
import { useDashboardCharts, useDashboardStats } from "@/features/dashboard/hooks"
import { StatCard } from "@/features/dashboard/components/StatCard"
import { ChartCard } from "@/features/dashboard/components/ChartCard"
import { TimeSeriesAreaChart } from "@/features/dashboard/components/TimeSeriesAreaChart"
import { StatusDistributionChart, StatusDistributionLegend } from "@/features/dashboard/components/StatusDistributionChart"
import { AverageScoreByApplicationChart } from "@/features/dashboard/components/AverageScoreByApplicationChart"
import { ScoreDistributionChart } from "@/features/dashboard/components/ScoreDistributionChart"
import { ApplicationPerformanceChart } from "@/features/dashboard/components/ApplicationPerformanceChart"

export default function DashboardPage() {
  usePageHeader("Dashboard")
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: charts, isLoading: chartsLoading } = useDashboardCharts()

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Applications</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total applications" value={String(stats?.totalApplications ?? 0)} icon={LayoutGrid} isLoading={statsLoading} />
          <StatCard label="Active applications" value={String(stats?.activeApplications ?? 0)} icon={Activity} isLoading={statsLoading} />
          <StatCard label="Total sections" value={String(stats?.totalSections ?? 0)} icon={FileStack} isLoading={statsLoading} />
          <StatCard label="Total questions" value={String(stats?.totalQuestions ?? 0)} icon={HelpCircle} isLoading={statsLoading} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Submissions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total submissions" value={String(stats?.totalSubmissions ?? 0)} icon={Inbox} isLoading={statsLoading} />
          <StatCard label="Draft" value={String(stats?.draftSubmissions ?? 0)} icon={PenLine} isLoading={statsLoading} />
          <StatCard label="Submitted" value={String(stats?.submittedSubmissions ?? 0)} icon={Send} isLoading={statsLoading} />
          <StatCard label="Under review" value={String(stats?.underReviewSubmissions ?? 0)} icon={Hourglass} isLoading={statsLoading} />
          <StatCard label="Reviewed" value={String(stats?.reviewedSubmissions ?? 0)} icon={CheckCircle2} isLoading={statsLoading} />
          <StatCard label="Pending reviews" value={String(stats?.pendingReviews ?? 0)} icon={Clock} isLoading={statsLoading} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Scores &amp; activity</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Average score" value={formatScore(stats?.averageFinalScore)} icon={TrendingUp} isLoading={statsLoading} />
          <StatCard label="Highest score" value={formatScore(stats?.highestFinalScore)} icon={Trophy} isLoading={statsLoading} />
          <StatCard label="Lowest score" value={formatScore(stats?.lowestFinalScore)} icon={TrendingDown} isLoading={statsLoading} />
          <StatCard label="Submissions today" value={String(stats?.submissionsToday ?? 0)} icon={CalendarDays} isLoading={statsLoading} />
          <StatCard label="This week" value={String(stats?.submissionsThisWeek ?? 0)} icon={CalendarDays} isLoading={statsLoading} />
          <StatCard label="This month" value={String(stats?.submissionsThisMonth ?? 0)} icon={CalendarDays} isLoading={statsLoading} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Insights</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard
            title="Submission activity"
            description="New submissions started over the last 30 days"
            isLoading={chartsLoading}
            isEmpty={!charts?.submissionActivity.some((d) => d.count > 0)}
          >
            <TimeSeriesAreaChart
              data={charts?.submissionActivity ?? []}
              color={categoricalColors[0]}
              seriesName="Submissions"
              gradientId="fill-activity"
            />
          </ChartCard>

          <ChartCard
            title="Submission status distribution"
            description="Where all submissions currently stand"
            isLoading={chartsLoading}
            isEmpty={!charts?.statusDistribution.some((d) => d.count > 0)}
          >
            <div className="flex h-full flex-col">
              <div className="flex-1">
                <StatusDistributionChart data={charts?.statusDistribution ?? []} />
              </div>
              <StatusDistributionLegend data={charts?.statusDistribution ?? []} />
            </div>
          </ChartCard>

          <ChartCard
            title="Average score by application"
            description="Among reviewed submissions, top 10 applications"
            isLoading={chartsLoading}
            isEmpty={!charts?.averageScoreByApplication.length}
          >
            <AverageScoreByApplicationChart data={charts?.averageScoreByApplication ?? []} />
          </ChartCard>

          <ChartCard
            title="Review activity"
            description="Reviews completed over the last 30 days"
            isLoading={chartsLoading}
            isEmpty={!charts?.reviewActivity.some((d) => d.count > 0)}
          >
            <TimeSeriesAreaChart
              data={charts?.reviewActivity ?? []}
              color={statusColors.reviewed}
              seriesName="Reviews completed"
              gradientId="fill-review-activity"
            />
          </ChartCard>

          <ChartCard
            title="Score distribution"
            description="Final scores across reviewed submissions"
            isLoading={chartsLoading}
            isEmpty={!charts?.scoreDistribution.some((d) => d.count > 0)}
          >
            <ScoreDistributionChart data={charts?.scoreDistribution ?? []} />
          </ChartCard>

          <ChartCard
            title="Application performance"
            description="Submissions received vs. reviewed, top 10 applications"
            isLoading={chartsLoading}
            isEmpty={!charts?.applicationPerformance.length}
          >
            <ApplicationPerformanceChart data={charts?.applicationPerformance ?? []} />
          </ChartCard>
        </div>
      </section>
    </div>
  )
}
