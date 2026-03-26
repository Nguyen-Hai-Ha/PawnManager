<template>
  <div class="dashboard">
    <!-- Stat Cards -->
    <div class="stat-cards">
      <!-- Giao dịch -->
      <div class="stat-card">
        <div class="stat-card-inner">
          <div class="stat-info">
            <div class="stat-label">Giao dịch</div>
            <div class="stat-sub">Hôm nay 18/3</div>
            <div class="stat-value teal">4</div>
            <div class="stat-compare">
              <span class="badge-green">0%</span>
              <span class="compare-text"> So với ngày hôm qua</span>
            </div>
          </div>
          <div class="stat-icon icon-yellow">
            <span>🪙</span>
          </div>
        </div>
      </div>

      <!-- Cho vay -->
      <div class="stat-card">
        <div class="stat-card-inner">
          <div class="stat-info">
            <div class="stat-label">Cho vay</div>
            <div class="stat-sub">Hợp đồng</div>
            <div class="stat-value teal">1</div>
            <div class="stat-compare">
              <span class="muted">( 10,000,000 vnđ)</span>
            </div>
          </div>
          <div class="stat-icon icon-purple">
            <span>🧑‍💼</span>
          </div>
        </div>
      </div>

      <!-- Đã thu -->
      <div class="stat-card">
        <div class="stat-card-inner">
          <div class="stat-info">
            <div class="stat-label">Đã thu</div>
            <div class="stat-sub">Hợp đồng</div>
            <div class="stat-value teal">2</div>
            <div class="stat-compare">
              <span class="muted">| (9,733,110)</span>
            </div>
            <div class="stat-compare">
              <span class="muted">Dự thu: 0 &nbsp; HĐI (0)</span>
            </div>
          </div>
          <div class="stat-icon icon-teal">
            <span>🧮</span>
          </div>
        </div>
      </div>

      <!-- Quỹ tiền -->
      <div class="stat-card stat-card-dark">
        <div class="stat-card-inner">
          <div class="stat-info">
            <div class="stat-label white">Quỹ tiền</div>
            <div class="stat-value-large negative">-67,136,890</div>
          </div>
          <div class="stat-icon icon-teal-light">
            <span>🐷</span>
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
              <div class="th-value">3</div>
            </th>
            <th>
              Tổng đang cho vay
              <div class="th-value teal">79,000,000</div>
            </th>
            <th>
              Tổng lãi đã thu
              <div class="th-value orange">2,974,222</div>
            </th>
            <th>
              Lãi tháng 3/2026
              <div class="th-value red">2,974,222</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span class="loan-icon">🖐️</span> Cầm đồ</td>
            <td>1</td>
            <td>
              <div class="teal bold">29,000,000</div>
              <div class="muted small">37%</div>
            </td>
            <td>
              <div class="orange bold">1,772,000</div>
              <div class="muted small">60%</div>
            </td>
            <td class="red bold">1,772,000</td>
          </tr>
          <tr>
            <td><span class="loan-icon">🏦</span> Tín chấp</td>
            <td>1</td>
            <td>
              <div class="teal bold">10,000,000</div>
              <div class="muted small">13%</div>
            </td>
            <td>
              <div class="orange bold">300,000</div>
              <div class="muted small">10%</div>
            </td>
            <td class="red bold">300,000</td>
          </tr>
          <tr>
            <td><span class="loan-icon">💰</span> Trả góp</td>
            <td>1</td>
            <td>
              <div class="teal bold">40,000,000</div>
              <div class="muted small">51%</div>
            </td>
            <td>
              <div class="orange bold">902,222</div>
              <div class="muted small">30%</div>
            </td>
            <td class="red bold">902,222</td>
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
              <!-- 100% teal = full circle (Đã thu 100%) -->
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#1a7a6e"
                stroke-width="20"
                stroke-dasharray="251.2 0"
                stroke-dashoffset="62.8"
              />
            </svg>
            <div class="pie-label-left">100%</div>
            <div class="pie-label-right">0%</div>
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
          <span class="trial">Trial Version</span>
          <span class="brand">Canvess.com</span>
        </div>
      </div>

      <!-- Tỷ lệ lợi nhuận -->
      <div class="chart-card">
        <div class="chart-title">Tỷ lệ lợi nhuận</div>
        <div class="chart-body">
          <div class="pie-wrapper">
            <svg viewBox="0 0 100 100" class="pie-chart">
              <!-- Cầm đồ 30.33% -->
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#3480E4"
                stroke-width="20"
                stroke-dasharray="76.15 175.05"
                stroke-dashoffset="62.8"
              />
              <!-- Tín chấp 10.09% -->
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#1a7a6e"
                stroke-width="20"
                stroke-dasharray="25.33 225.87"
                stroke-dashoffset="-13.35"
              />
              <!-- Trả góp 59.58% -->
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#e05c2e"
                stroke-width="20"
                stroke-dasharray="149.62 101.58"
                stroke-dashoffset="-38.68"
              />
            </svg>
            <div class="pie-labels-profit">
              <div class="pl-label" style="top:15%;left:72%">30.33%</div>
              <div class="pl-label" style="top:60%;left:5%">10.09%</div>
              <div class="pl-label" style="top:75%;left:40%">59.58%</div>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item"><span class="dot dot-teal"></span> Cầm đồ</div>
            <div class="legend-item"><span class="dot dot-green"></span> Tín chấp</div>
            <div class="legend-item"><span class="dot dot-orange"></span> Trả góp</div>
          </div>
        </div>
        <div class="chart-footer">
          <span class="trial">Trial Version</span>
          <span class="brand">Canvess.com</span>
        </div>
      </div>

      <!-- Hợp đồng chờ duyệt -->
      <div class="chart-card pending-card">
        <div class="chart-title">Hợp đồng chờ duyệt</div>
        <div class="pending-body">
          <div class="pending-icon">🪙</div>
          <div class="pending-count">0</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Static data - no fetch needed
</script>

<style scoped>
@import '@/assets/main.css';
</style>