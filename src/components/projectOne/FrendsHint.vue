<template>
    <div class="frends-hint-container">
        <div class="header-title-box">
            <div class="title">Message from Dongming Jia：</div>
            <div class="icon">
                <span class="iconfont iconclose"></span>
            </div>
        </div>
        <div class="text-box">
            <div class="title">
                友情提醒
            </div>
            <p class="message">请与本周五前完成审批，如有问题,请与本周五前完成审批，如有问题,KloudSync房间号：M123</p>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
    .frends-hint-container{
        width: 386px;
        box-shadow:0px 2px 4px 0px rgba(0,0,0,0.08);
        border-radius:8px;
        position: relative;
        .header-title-box{
            padding: 17px 28px;
            display: flex;
            background-color: #4288F0;
            .title{
             font-size:16px;
             color:white;
            }
            .icon{
                .iconfont{
                    color: white;
                    font-size: 25px;
                }
            }
        }
        .text-box{
            padding: 24px;
            .title{
                font-size: 18px;
                color: #4288F0;
                margin-bottom: 12px;
                font-weight: 500;
            }
            .message{
                font-size: 16px;
                color: #949494;
                line-height: 20px;
            }
        }
    }
</style>