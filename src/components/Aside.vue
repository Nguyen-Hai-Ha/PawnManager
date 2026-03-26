<template>
    <aside>
        <div class="logo">Pawn Manager</div>
        <nav>
            <ul>
                <li>
                    <router-link to="/admin/dashboard" active-class="active">
                        <font-awesome-icon icon="fa-solid fa-chart-line" />Dashboard
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/customers" active-class="active">
                        <font-awesome-icon icon="fa-solid fa-user" />Khách Hàng
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/loan-pawn" active-class="active">
                        <font-awesome-icon icon="fa-solid fa-file-signature" />Cầm Đồ
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/repayments" active-class="active">
                        <font-awesome-icon icon="fa-solid fa-file-signature" />Trả Góp
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/pledges" active-class="active">
                        <font-awesome-icon icon="fa-solid fa-file-signature" />Tín Chấp
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/assets" active-class="active">
                        <font-awesome-icon icon="fa-solid fa-car-side" />Quản Lý Tài Sản
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/staff" active-class="active">
                        <font-awesome-icon icon="fa-solid fa-users-gear" />Quản Lý Nhân Viên
                    </router-link>
                </li>

                <li>
                    <router-link to="/admin/transactions" active-class="active">
                        <font-awesome-icon icon="fa-solid fa-file-invoice-dollar" />Quản Lý Thu Chi
                    </router-link>
                </li>
            </ul>
        </nav>
    </aside>
</template>
<script setup>
</script>
<style>
@import '@/assets/main.css';

aside a {
    color: #000000;
    text-decoration: none;
}

aside a.active {
    box-shadow: inset 3px 0 0 #1A7A6E;
}

aside a:hover {
    background-color: #B1B1B1;
}
</style>