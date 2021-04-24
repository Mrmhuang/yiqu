<template>
    <div class="footer">
        <span>Copyright © 2020 易趣</span>
    </div>
</template>

<script>
    export default {
        name: "footer"
    }
</script>

<style lang="less">
    .footer{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        background-color: rgb(45,50,54);
        span{
            color: white;
        }
    }
</style>
