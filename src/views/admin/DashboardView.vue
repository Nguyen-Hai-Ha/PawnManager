<script setup>
import { onMounted, computed } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';
import { storeToRefs } from 'pinia';

const dashboardStore = useDashboardStore();
const { summary, loading, todayDateStr, currentMonthYearStr, hasFetched } = storeToRefs(dashboardStore);
const { fetchSummary, formatCurrency } = dashboardStore;

onMounted(() => {
  if (hasFetched.value === false) {
    fetchSummary();
  }
});

const totalLoanSummary = computed(() => {
  const initial = { count: 0, loan: 0, interest: 0, month: 0 };
  return summary.value.loanSummary.reduce((acc, curr) => ({
    count: acc.count + (curr.count || 0),
    loan: acc.loan + (curr.total_loan || 0),
    interest: acc.interest + (curr.total_interest || 0),
    month: acc.month + (curr.month_interest || 0)
  }), initial);
});

// Pie Chart 1: Projected Interest
const projectedDashArray = computed(() => {
  const p = parseFloat(summary.value.projected.percent) || 0;
  const dash = (p * 251.2) / 100;
  return `${dash} ${251.2 - dash}`;
});

// Pie Chart 2: Profit Ratio
const profitRatios = computed(() => {
  const total = totalLoanSummary.value.interest || 1;
  const ratios = summary.value.loanSummary.map(item => ({
    name: item.name,
    percent: ((item.total_interest || 0) / total * 100).toFixed(2),
    raw: (item.total_interest || 0) / total
  }));
  
  // Calculate dash offsets
  let currentOffset = 62.8; // Start at top
  return ratios.map(r => {
    const dash = r.raw * 251.2;
    const offset = currentOffset;
    currentOffset -= dash;
    return { ...r, dash: `${dash} ${251.2 - dash}`, offset };
  });
});

const getProfitRatioByTypeName = (name) => {
  const r = profitRatios.value.find(item => item.name.toLowerCase() === name.toLowerCase());
  return r ? r.percent + '%' : '0%';
};

</script>

<template>
  <div class="dashboard" v-if="!loading">
    <!-- Stat Cards -->
    <div class="stat-cards">
      <!-- Giao dịch -->
      <div class="stat-card">
        <div class="stat-card-inner">
          <div class="stat-info">
            <div class="stat-label">Giao dịch</div>
            <div class="stat-sub">Hôm nay {{ todayDateStr }}</div>
            <div class="stat-value teal">{{ summary.stats.transactions.today }}</div>
            <div class="stat-compare">
              <span :class="summary.stats.transactions.compare >= 0 ? 'badge-green' : 'badge-red'">
                {{ summary.stats.transactions.compare }}%
              </span>
              <span class="compare-text"> So với ngày hôm qua</span>
            </div>
          </div>
          <div class="stat-icon icon-yellow">
            <span><font-awesome-icon icon="fa-solid fa-credit-card" /></span>
          </div>
        </div>
      </div>

      <!-- Cho vay -->
      <div class="stat-card">
        <div class="stat-card-inner">
          <div class="stat-info">
            <div class="stat-label">Cho vay</div>
            <div class="stat-sub">Hợp đồng</div>
            <div class="stat-value teal">{{ summary.stats.loans.count }}</div>
            <div class="stat-compare">
              <span class="muted">( {{ formatCurrency(summary.stats.loans.amount) }} vnđ)</span>
            </div>
          </div>
          <div class="stat-icon icon-purple">
            <span><font-awesome-icon icon="fa-solid fa-landmark" /></span>
          </div>
        </div>
      </div>

      <!-- Đã thu -->
      <div class="stat-card">
        <div class="stat-card-inner">
          <div class="stat-info">
            <div class="stat-label">Đã thu</div>
            <div class="stat-sub">Hợp đồng</div>
            <div class="stat-value teal">{{ summary.stats.collected.count }}</div>
            <div class="stat-compare">
              <span class="muted">| ({{ formatCurrency(summary.stats.collected.amount) }})</span>
            </div>
            <div class="stat-compare">
              <span class="muted">Dự thu: {{ formatCurrency(summary.projected.unpaid) }}</span>
            </div>
          </div>
          <div class="stat-icon icon-teal">
            <span><font-awesome-icon icon="fa-solid fa-calculator" /></span>
          </div>
        </div>
      </div>

      <!-- Quỹ tiền -->
      <div class="stat-card stat-card-dark">
        <div class="stat-card-inner">
          <div class="stat-info">
            <div class="stat-label white">Quỹ tiền</div>
            <div class="stat-value-large" :class="summary.stats.fund >= 0 ? 'positive' : 'negative'">
              {{ formatCurrency(summary.stats.fund) }}
            </div>
          </div>
          <div class="stat-icon icon-teal-light">
            <span style="color: #000;"><font-awesome-icon icon="fa-solid fa-piggy-bank" /></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Schedules Row -->
    <div class="schedules-row">
      <!-- Đến hạn hôm nay -->
      <div class="schedule-card">
        <div class="schedule-header header-red">
          <span class="title">Đến hạn hôm nay</span>
          <span class="badge badge-white">{{ summary.dueToday.length }}</span>
        </div>
        <div class="schedule-body">
          <table class="schedule-table" v-if="summary.dueToday.length > 0">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Số tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in summary.dueToday" :key="item.id_contract">
                <td>
                  <div class="fw-bold">{{ item.customer_name }}</div>
                  <div class="small phone">{{ item.customer_phone }} | HĐ: {{ item.contract_code }}</div>
                </td>
                <td class="text-right fw-bold red">
                  {{ formatCurrency(item.amount_due) }}
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="empty-state">
            Không có hợp đồng nào đến hạn hôm nay.
          </div>
        </div>
      </div>

      <!-- Sắp đến hạn -->
      <div class="schedule-card">
        <div class="schedule-header header-orange">
          <span class="title">Sắp đến hạn (3 ngày tới)</span>
          <span class="badge badge-white">{{ summary.dueSoon.length }}</span>
        </div>
        <div class="schedule-body">
          <table class="schedule-table" v-if="summary.dueSoon.length > 0">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Ngày</th>
                <th>Số tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in summary.dueSoon" :key="item.id_contract">
                <td>
                  <div class="fw-bold">{{ item.customer_name }}</div>
                  <div class="small phone">{{ item.customer_phone }} | HĐ: {{ item.contract_code }}</div>
                </td>
                <td class="small">{{ item.expected_date }}</td>
                <td class="text-right fw-bold orange">
                  {{ formatCurrency(item.amount_due) }}
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="empty-state">
            Không có hợp đồng nào sắp đến hạn.
          </div>
        </div>
      </div>
    </div>

    <!-- Loan Summary Table -->
    <div class="loan-table-wrapper">
      <table class="loan-table">
        <thead>
          <tr>
            <th></th>
            <th>
              Số hợp đồng đang vay
              <div class="th-value">{{ totalLoanSummary.count }}</div>
            </th>
            <th>
              Tổng đang cho vay
              <div class="th-value teal">{{ formatCurrency(totalLoanSummary.loan) }}</div>
            </th>
            <th>
              Tổng lãi đã thu
              <div class="th-value orange">{{ formatCurrency(totalLoanSummary.interest) }}</div>
            </th>
            <th>
              Lãi tháng {{ currentMonthYearStr }}
              <div class="th-value red">{{ formatCurrency(totalLoanSummary.month) }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in summary.loanSummary" :key="item.id">
            <td class="fw-bold">
              {{ item.name }}
            </td>
            <td>{{ item.count || 0 }}</td>
            <td>
              <div class="teal bold">{{ formatCurrency(item.total_loan) }}</div>
              <div class="muted small">{{ totalLoanSummary.loan > 0 ? (item.total_loan / totalLoanSummary.loan * 100).toFixed(0) : 0 }}%</div>
            </td>
            <td>
              <div class="orange bold">{{ formatCurrency(item.total_interest) }}</div>
              <div class="muted small">{{ totalLoanSummary.interest > 0 ? (item.total_interest / totalLoanSummary.interest * 100).toFixed(0) : 0 }}%</div>
            </td>
            <td class="red bold">{{ formatCurrency(item.month_interest) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bottom Row: Charts + Pending -->
    <div class="bottom-row">
      <!-- Lãi thu dự kiến -->
      <div class="chart-card">
        <div class="chart-title">Lãi thu dự kiến</div>
        <div class="chart-body">
          <div class="pie-wrapper">
            <svg viewBox="0 0 100 100" class="pie-chart">
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#E05C2E"
                stroke-width="20"
              />
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#1a7a6e"
                stroke-width="20"
                :stroke-dasharray="projectedDashArray"
                stroke-dashoffset="62.8"
              />
            </svg>
            <div class="pie-label-left">{{ summary.projected.percent }}%</div>
            <div class="pie-label-right">{{ (100 - summary.projected.percent).toFixed(1) }}%</div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="dot dot-teal"></span> Đã thu
            </div>
            <div class="legend-item">
              <span class="dot dot-orange"></span> Chưa thu
            </div>
          </div>
        </div>
        <div class="chart-footer">
          <span class="trial">Version 1.0</span>
          <span class="brand">PawnManager</span>
        </div>
      </div>

      <!-- Tỷ lệ lợi nhuận -->
      <div class="chart-card">
        <div class="chart-title">Tỷ lệ lợi nhuận</div>
        <div class="chart-body">
          <div class="pie-wrapper">
            <svg viewBox="0 0 100 100" class="pie-chart">
              <circle
                v-for="(r, i) in profitRatios"
                :key="i"
                cx="50" cy="50" r="40"
                fill="none"
                :stroke="i === 0 ? '#3480E4' : (i === 1 ? '#1a7a6e' : '#e05c2e')"
                stroke-width="20"
                :stroke-dasharray="r.dash"
                :stroke-dashoffset="r.offset"
              />
            </svg>
            <div class="pie-labels-profit">
              <div class="pl-label" style="top:15%;left:72%">{{ getProfitRatioByTypeName('Cầm Đồ') }}</div>
              <div class="pl-label" style="top:60%;left:5%">{{ getProfitRatioByTypeName('Tín Chấp') }}</div>
              <div class="pl-label" style="top:75%;left:40%">{{ getProfitRatioByTypeName('Trả Góp') }}</div>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item"><span class="dot dot-blue"></span> Cầm đồ</div>
            <div class="legend-item"><span class="dot dot-teal"></span> Tín chấp</div>
            <div class="legend-item"><span class="dot dot-orange"></span> Trả góp</div>
          </div>
        </div>
        <div class="chart-footer">
          <span class="trial">Version 1.0</span>
          <span class="brand">PawnManager</span>
        </div>
      </div>
    </div>

    
  </div>
  <div v-else class="loading-container">
    Đang tải dữ liệu...
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.2rem;
  color: #1a7a6e;
}
.dot-blue { background-color: #3480E4; }
.positive { color: white; }
.negative { color: #ff5252; }

/* Schedules Row */
.schedules-row {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.schedule-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}
.schedule-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: bold;
}
.header-red { background:  #c62828; }
.header-orange { background: #fb8c00; }
.badge-white { background: rgba(255, 255, 255, 0.2); border-radius: 20px; padding: 2px 10px; }
.schedule-body { padding: 0; flex: 1; max-height: 400px; overflow-y: auto; }
.schedule-table { width: 100%; border-collapse: collapse; }
.schedule-table th { padding: 10px 20px; font-size: 13px; color: #757575; text-align: left; background: #fafafa; border-bottom: 1px solid #eee; }
.schedule-table td { padding: 12px 20px; border-bottom: 1px solid #f5f5f5; vertical-align: middle; text-align: left; }
.phone { color: #888; margin-top: 4px; }
.text-right { text-align: right; }
.red { color: #d32f2f; }
.orange { color: #f57c00; }
.fw-bold { font-weight: 600; }
.small { font-size: 13px; }
.empty-state { padding: 30px; text-align: center; color: #999; font-style: italic; }
</style>
